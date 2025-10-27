import { StudysetListResponseDto } from '../studyset/studyset.dto';

export class ProfileDto {
  user_id: string;
  email: string;
  displayName: string;
  img_url: string;
  joinDate: string;
  streak: number;
  joinNumber: number;
}

export class ProfileListResponseDto {
  profiles: ProfileDto[];
}

export class ProfileResponseDto {
  profile: ProfileDto;
  sets: StudysetListResponseDto;
}
