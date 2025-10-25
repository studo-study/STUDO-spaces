import { Controller, Get, Param } from '@nestjs/common';
import { FolderService } from './folder.service';

@Controller('folder')
export class FolderController {
  constructor(private readonly foldersService: FolderService) {}
  @Get()
  getAllFolder() {
    return `This action returns all folders`;
  }

  @Get(':id')
  getFolderById(@Param('id') id: number) {
    return `This action returns folder #${id}`;
  }

}
