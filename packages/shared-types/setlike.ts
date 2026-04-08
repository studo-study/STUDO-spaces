export interface CreateSetLike {
  set_id: string;
}

export interface SetLikeResponse {
  id: string;
  user_id: string;
  set_id: string;
  set_type: string;
  created_at: string;
}

export interface SetLikeResponseList {
  likes: SetLikeResponse[];
}
