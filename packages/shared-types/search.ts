export interface SetSearchResult {
  id: string;
  title: string;
  subject: string;
  owner: string;
  img_url: string;
  owner_id: string;
  verified: boolean;
  likes: number;
  items: number;
  type: string;
}

export interface ProfileSearchResult {
  id: string;
  displayName: string;
  img_url: string;
  type: string;
}

export interface ClassroomSearchResult {
  id: string;
  name: string;
  owner: string;
  owner_id: string;
  type: string;
  verified: boolean;
}

export interface StudoProfileSearchResult {
  id: string;
  displayName: string;
  img_url: string;
  banner_url: string;
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
