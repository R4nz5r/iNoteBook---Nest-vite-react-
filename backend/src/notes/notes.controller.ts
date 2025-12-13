import { AuthGuard } from '@nestjs/passport';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { NotesService } from './notes.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

@UseGuards(AuthGuard('jwt'))
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.notesService.create(createNoteDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
  ) {
    const tagsArray = tag ? tag.split(',') : undefined;
    return this.notesService.findAll(req.user.id, search, tagsArray);
  }
  @Get('favorites')
  getFavorites(@Request() req) {
    return this.notesService.getFavorites(req.user.id);
  }

  @Get('tags/:tag')
  getNotesByTag(@Param('tag') tag: string, @Request() req) {
    return this.notesService.getNotesByTag(req.user.id, tag);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.notesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ) {
    return this.notesService.update(id, updateNoteDto, req.user.id);
  }

  @Patch(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.notesService.toggleFavorite(id, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.notesService.remove(id, req.user.id);
  }
}
