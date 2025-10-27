export class createPinDto {
  definition: string;
  x: string;
  y: string;
  number: number;
}

export class UpdatePinDto {
  definition?: string;
  x?: string;
  y?: string;
  number?: number;
  updated_at?: string;
}

export class PinResponseDto {
  id: string;
  definition: string;
  x: string;
  y: string;
  number: number;
  created_at: string;
  updated_at: string;
  pin_viewcount: number;
  pin_totalviewcount: number;
  set_id: string;
  owner_id: string;
}

export class PinResponseListDto {
  pins: PinResponseDto[];
}
