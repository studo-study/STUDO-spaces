import type { CreatePin, UpdatePin, PinResponseList } from "./pin";
import type { SetLikeResponseList } from "./setlike";
import type { StudysessionResponse } from "./studysession";
import type { ClassroomResponse } from "./classroom";

export interface VisualsetResponse {
  id: string;
  title: string;
  studoset: boolean;
  createdAt: string;
  lastUpdated: string;
  publicSet: boolean;
  userId: string;
  displayName: string;
  imgUrl: string;
  pinCount?: number;
  lastStudied?: string | null;
  progress?: number;
}

export interface PublicVisualsetResponse {
  id: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
  userId: string;
  displayName: string;
}

export interface CreateImage {
  title: string;
  url: string;
  index: number;
  gridX: number;
  gridY: number;
  scale: string;
}

export interface UpdateImage extends CreateImage {
  id: string;
}

export interface Image {
  id: string;
  title: string;
  url: string;
  index: number;
  gridX: number;
  gridY: number;
  scale: string;
  setId: string;
}

export interface ImageResponse {
  id: string;
  title: string;
  url: string;
  index: number;
  gridX: number;
  gridY: number;
  scale: string;
  setId: string;
  pins: PinResponseList;
}

export interface FullVisualsetResponse extends VisualsetResponse {
  images: ImageResponse[];
  likes: SetLikeResponseList;
  session: StudysessionResponse;
  classrooms: ClassroomResponse[];
}

export interface VisualsetResponseList {
  visualsets: VisualsetResponse[];
}

export interface CreateVisualset {
  title: string;
  images: CreateImage[];
  pins: CreatePin[];
}

export interface UpdateVisualset {
  title?: string;
  publicSet?: boolean;
  images?: UpdateImage[];
  pins?: UpdatePin[];
}

export interface CreateVisualsetWithFiles {
  title: string;
  imagesMetadata: string;
  pinsData: string;
}

export interface ImageMetadata {
  title: string;
  index: number;
  gridX: number;
  gridY: number;
  scale: string;
}

export interface ImageImportResponse {
  id: string;
  index: number;
  term: string;
  definition: string;
  image: string;
  isDouble: boolean;
}
