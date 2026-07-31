export interface CreatePin {
  definition: string;
  x: number;
  y: number;
  number: number;
  imgUrl: string;
}

export interface UpdatePin {
  id: string;
  definition?: string;
  x?: number;
  y?: number;
  number?: number;
  updatedAt?: string;
}

export interface PinResponse {
  id: string;
  definition: string;
  x: number;
  y: number;
  number: number;
  createdAt: string;
  updatedAt: string;
  imageId: string;
  setId: string;
  ownerId: string;
}

export interface PinResponseList {
  pins: PinResponse[];
}
