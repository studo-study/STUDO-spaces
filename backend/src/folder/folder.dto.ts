export class CreateFolderDto {
  name: string;
  owner: string;
}

export class UpdateFolderDto {
  name?: string;
}

export class FolderResponseDto {
  id: string;
  name: string;
  user_id: string;
}

export class FolderListResponseDto {
  folders: FolderResponseDto[];
}

export class SwitchFolderDto {
  set_id: string;
  destinationFolder_id: string;
}
