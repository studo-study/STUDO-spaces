export class CreateFolderDto {
  id: number;
  name: string;
  owner: string;
}

export class UpdateFolderDto extends CreateFolderDto {}

export class FolderResponseDto extends CreateFolderDto {}

export class FolderListResponseDto {
  folders: FolderResponseDto[];
}
