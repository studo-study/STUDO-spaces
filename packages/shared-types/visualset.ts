import type { CreatePin, UpdatePin, PinResponseList } from "./pin";
import type { SetLikeResponseList } from "./setlike";
import type { StudysessionResponse } from "./studysession";
import type { ClassroomResponse } from "./classroom";

export interface VisualsetResponse {
  id: string;
  title: string;
  studoset: boolean;
  created_at: string;
  last_updated: string;
  public_set: boolean;
  user_id: string;
  displayName: string;
  img_url: string;
  pin_count?: number;
  last_studied?: string | null;
  progress?: number;
}

export interface PublicVisualsetResponse {
  id: string;
  title: string;
  created_at: string;
  last_updated: string;
  user_id: string;
  displayName: string;
}

export interface CreateImage {
  title: string;
  url: string;
  index: number;
  grid_x: number;
  grid_y: number;
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
  grid_x: number;
  grid_y: number;
  scale: string;
  set_id: string;
}

export interface ImageResponse {
  id: string;
  title: string;
  url: string;
  index: number;
  grid_x: number;
  grid_y: number;
  scale: string;
  set_id: string;
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
  public_set?: boolean;
  images?: UpdateImage[];
  pins?: UpdatePin[];
}

export interface CreateVisualsetWithFiles {
  title: string;
  images_metadata: string;
  pins_data: string;
}

export interface ImageMetadata {
  title: string;
  index: number;
  grid_x: number;
  grid_y: number;
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
