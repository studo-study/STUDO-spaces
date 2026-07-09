export interface CreateSetLike {
  setId: string;
}

export interface SetLikeResponse {
  id: string;
  userId: string;
  setId: string;
  setType: string;
  createdAt: string;
}

export interface SetLikeResponseList {
  likes: SetLikeResponse[];
}
