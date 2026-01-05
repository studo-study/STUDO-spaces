import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SetResponse {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de set',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Heart Diagram',
    description: 'Titel van de set',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: 'Biology',
    description: 'Onderwerp van de set',
  })
  @Expose()
  subject: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Laatste keer gestudeerd',
    required: false,
  })
  @Expose()
  last_studied: string | undefined;

  @ApiProperty({
    example: 'Emile Duyck',
    description: 'Naam van de eigenaar',
  })
  @Expose()
  owner: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profielfoto URL van de eigenaar',
  })
  @Expose()
  img_url: string;

  @ApiProperty({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de eigenaar',
  })
  @Expose()
  owner_id: string;

  @ApiProperty({
    example: true,
    description: 'Of de set geverifieerd is',
  })
  @Expose()
  verified: boolean;

  @ApiProperty({
    example: 42,
    description: 'Aantal likes',
  })
  @Expose()
  likes: number;

  @ApiProperty({
    example: 25,
    description: 'Aantal items in de set',
  })
  @Expose()
  items: number;

  @ApiProperty({
    example: 'studyset',
    description: 'Type van de set (studoset of ((visualset)))',
  })
  @Expose()
  type: string;
}

export class ProfileResponse {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van het profiel',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Emile Duyck',
    description: 'Weergavenaam van het profiel',
  })
  @Expose()
  displayName: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profielfoto URL',
  })
  @Expose()
  img_url: string;

  @ApiProperty({
    example: true,
    description: 'Of dit een Studo profiel is',
  })
  @Expose()
  studoProfile: boolean;

  @ApiProperty({
    example: 'student',
    description: 'Type profiel (student, teacher, etc.)',
  })
  @Expose()
  profileType: string;

  @ApiProperty({
    example: 'profile',
    description: 'Type van het zoekresultaat',
  })
  @Expose()
  type: string;
}

export class ClassroomResponse {
  @ApiProperty({
    example: '1f0cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de classroom',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Advanced Biology 2024',
    description: 'Naam van de classroom',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Prof. Johnson',
    description: 'Naam van de eigenaar',
  })
  @Expose()
  owner: string;

  @ApiProperty({
    example: '2f1cad9e-a4cc-68a0-9a80-792df80a3e75',
    description: 'UUID van de eigenaar',
  })
  @Expose()
  owner_id: string;

  @ApiProperty({
    example: 'classroom',
    description: 'Type van het zoekresultaat',
  })
  @Expose()
  type: string;

  @ApiProperty({
    example: true,
    description: 'Of de classroom geverifieerd is',
  })
  @Expose()
  verified: boolean;
}

class SetResultData {
  @ApiProperty({
    example: 'set',
    description: 'Type van de resultaten',
  })
  @Expose()
  type: 'set';

  @ApiProperty({
    type: [SetResponse],
    description: 'Array van set resultaten',
  })
  @Expose()
  data: SetResponse[];
}

class ProfileResultData {
  @ApiProperty({
    example: 'profile',
    description: 'Type van de resultaten',
  })
  @Expose()
  type: 'profile';

  @ApiProperty({
    type: [ProfileResponse],
    description: 'Array van profiel resultaten',
  })
  @Expose()
  data: ProfileResponse[];
}

class ClassroomResultData {
  @ApiProperty({
    example: 'classroom',
    description: 'Type van de resultaten',
  })
  @Expose()
  type: 'classroom';

  @ApiProperty({
    type: [ClassroomResponse],
    description: 'Array van classroom resultaten',
  })
  @Expose()
  data: ClassroomResponse[];
}

export class SearchResultsDto {
  @ApiProperty({
    type: 'array',
    description: 'Zoekresultaten gegroepeerd per type',
    example: [
      { type: 'set', data: [] },
      { type: 'profile', data: [] },
      { type: 'classroom', data: [] },
    ],
  })
  @Expose()
  data: [SetResultData, ProfileResultData, ClassroomResultData];
}
