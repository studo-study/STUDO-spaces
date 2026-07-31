export interface SetSearchResult {
  id: string;
  title: string;
  subject: string;
  owner: string;
  imgUrl: string;
  ownerId: string;
  verified: boolean;
  likes: number;
  items: number;
  type: string;
}

export interface ProfileSearchResult {
  id: string;
  displayName: string;
  imgUrl: string;
  type: string;
}

export interface ClassroomSearchResult {
  id: string;
  name: string;
  owner: string;
  ownerId: string;
  type: string;
  verified: boolean;
}

export interface StudoProfileSearchResult {
  id: string;
  displayName: string;
  imgUrl: string;
  bannerUrl: string;
}

export interface SearchResults {
  data: [
    { type: "set"; data: SetSearchResult[] },
    { type: "profile"; data: ProfileSearchResult[] },
    { type: "classroom"; data: ClassroomSearchResult[] },
    { data: StudoProfileSearchResult[] },
  ];
}

export interface PublicSearchResults {
  data: [
    { type: "set"; data: SetSearchResult[] },
    { type: "profile"; data: ProfileSearchResult[] },
    { type: "classroom"; data: ClassroomSearchResult[] },
    { data: StudoProfileSearchResult[] },
  ];
}
