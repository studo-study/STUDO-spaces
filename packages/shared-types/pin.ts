export interface CreatePin {
  definition: string;
  x: number;
  y: number;
  number: number;
  img_url: string;
}

export interface UpdatePin {
  id: string;
  definition?: string;
  x?: number;
  y?: number;
  number?: number;
  updated_at?: string;
}

export interface PinResponse {
  id: string;
  definition: string;
  x: number;
  y: number;
  number: number;
  created_at: string;
  updated_at: string;
  image_id: string;
  set_id: string;
  owner_id: string;
}

export interface PinResponseList {
  pins: PinResponse[];
}
