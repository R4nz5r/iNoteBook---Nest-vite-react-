import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
  ) {}

  /** Create a new note */
  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      userId,
      tags: createNoteDto.tags || [],
    });
    return this.notesRepository.save(note);
  }

  /** Get all notes for a user, optional search and tags filtering */
  async findAll(
    userId: string,
    search?: string,
    tags?: string[],
  ): Promise<Note[]> {
    const query = this.notesRepository
      .createQueryBuilder('note')
      .where('note.userId = :userId', { userId })
      .orderBy('note.updatedAt', 'DESC');

    if (search) {
      query.andWhere(
        '(note.title ILIKE :search OR note.content ILIKE :search OR note.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (tags && tags.length > 0) {
      query.andWhere('note.tags && :tags', { tags });
      // '&&' checks array overlap in Postgres
    }

    return query.getMany();
  }

  /** Get a single note by ID */
  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, userId },
    });

    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  /** Update a note */
  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<Note> {
    const note = await this.findOne(id, userId);
    Object.assign(note, updateNoteDto);
    if (updateNoteDto.tags) note.tags = updateNoteDto.tags;
    return this.notesRepository.save(note);
  }

  /** Delete a note */
  async remove(id: string, userId: string): Promise<void> {
    const note = await this.findOne(id, userId);
    await this.notesRepository.remove(note);
  }

  /** Toggle favorite */
  async toggleFavorite(id: string, userId: string): Promise<Note> {
    const note = await this.findOne(id, userId);
    note.isFavorite = !note.isFavorite;
    return this.notesRepository.save(note);
  }

  /** Get favorite notes */
  async getFavorites(userId: string): Promise<Note[]> {
    return this.notesRepository.find({
      where: { userId, isFavorite: true },
      order: { updatedAt: 'DESC' },
    });
  }

  /** Get notes by single tag */
  async getNotesByTag(userId: string, tag: string): Promise<Note[]> {
    return (
      this.notesRepository
        .createQueryBuilder('note')
        .where('note.userId = :userId', { userId })
        .andWhere('note.tags && ARRAY[:tag]', { tag })
        // '&& ARRAY[:tag]' ensures Postgres treats it as array overlap
        .orderBy('note.updatedAt', 'DESC')
        .getMany()
    );
  }
}
