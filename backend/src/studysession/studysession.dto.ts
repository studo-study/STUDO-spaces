export class UpdateStudysessionDto {
  started_at?: string;
  duration?: number;
  second_last_login?: string;
  last_login?: string;
}

export class StudysessionResponseDto {
  id: string;
  started_at: string;
  duration: number;
  second_last_login: string;
  last_login: string;
  user_id: string;
  set_id: string;
}

export class StudysessionListResponseDto {
  sessions: StudysessionResponseDto[];
}
