export class CreateSetLikeDto {
  user_id: string;
  set_id: string;
}

export class SetLikeResponseDto {
  id: string;
  user_id: string;
  set_id: string;
  created_at: string;
}

export class SetLikeResponseListDto {
  likes: SetLikeResponseDto[];
}
