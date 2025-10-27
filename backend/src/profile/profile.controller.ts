import { Controller, Get, Param } from '@nestjs/common';
import { ProfileResponseDto } from './profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  //OPVRAGEN VAN PROFILE-DATA
  //opvragen van alle profielen
  @Get()
  getAll() {
    return this.profileService.getAll();
  }

  //opvragen van specifiek profiel
  @Get(':profile_id')
  getProfileById(@Param('profile_id') profile_id: string): ProfileResponseDto {
    return this.profileService.getById(profile_id);
  }
}
