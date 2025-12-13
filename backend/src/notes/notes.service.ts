import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      userId,
    });
    return this.notesRepository.save(note);
  }
  async findAll(
    userId: string,
    search?: string,
    tags?: string[],
  ): Promise<Note[]> {
    const queryBuilder = this.notesRepository
      .createQueryBuilder('note')
      .where('note.userId = :userId', { userId })
      .orderBy('note.updateAt', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        '(note.title ILIKE :search OR note.content ILIKE :search OR note.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (tags && tags.length > 0) {
      queryBuilder.andWhere('note.tags && :tags', { tags });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }
  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<Note> {
    const note = await this.findOne(id, userId);

    Object.assign(note, updateNoteDto);
    return this.notesRepository.save(note);
  }

  async remove(id: string, userId: string): Promise<void> {
    const note = await this.findOne(id, userId);
    await this.notesRepository.remove(note);
  }

  async toggleFavorite(id: string, userId: string): Promise<Note> {
    const note = await this.findOne(id, userId);
    note.isFavorite = !note.isFavorite;
    return this.notesRepository.save(note);
  }

  async getFavorites(userId: string): Promise<Note[]> {
    return this.notesRepository.find({
      where: { userId, isFavorite: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async getNotesByTag(userId: string, tag: string): Promise<Note[]> {
    return this.notesRepository
      .createQueryBuilder('note')
      .where('note.userId = :userId', { userId })
      .andWhere(':tag = ANY(note.tags)', { tag })
      .orderBy('note.updatedAt', 'DESC')
      .getMany();
  }
}
