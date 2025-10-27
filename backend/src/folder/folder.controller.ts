import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { FolderService } from './folder.service';
import { Folder } from '../data/mock_data';

@Controller('folder')
export class FolderController {
  constructor(private readonly foldersService: FolderService) {}
  //OPHALEN VAN FOLDER-DATA
  //alle folders ophalen
  @Get()
  getAllFolder() {
    return this.foldersService.getAll();
  }

  //één specifieke folder ophalen
  @Get(':folder_id')
  getFolderById(@Param('folder_id') folder_id: string) {
    return this.foldersService.getById(folder_id);
  }

  //DELETEN
  //specifieke set verwijderen
  @Delete(':folder_id')
  deleteFolder(@Param('folder_id') folder_id: string) {
    return this.foldersService.deleteById(folder_id);
  }
}
