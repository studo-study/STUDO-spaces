const SEARCH_DATA = [
  {
    type: "set",
    data: [
      {
        id: "a1e8d0e4-4c1b-4df7-9b11-6c8b7a92c341",
        title: "Linear Algebra Basics",
        subject: "Mathematics",
        last_studied: "2025-10-28T14:22:00Z",
        type: "studyset",
        owner: "Charles Degraeuwe",
        img_url: "https://randomuser.me/api/portraits/men/32.jpg", // man
        owner_id: "profile-charles-001",
        verified: false,
        likes: 12,
        items: 25,
      },
      {
        id: "b2f9e1d5-5d2c-4e8a-8c22-7d9c8b93d452",
        title: "English Grammar & Vocabulary",
        subject: "English",
        last_studied: "2025-10-27T16:45:00Z",
        type: "studyset",
        owner: "Emma de Vries",
        img_url: "https://randomuser.me/api/portraits/women/15.jpg", // vrouw
        owner_id: "a41d8a3c-203f-4414-bb1d-0bcebf5b6e77",
        verified: false,
        likes: 8,
        items: 32,
      },
      {
        id: "c3g0f2e6-6e3d-4f9b-9d33-8e0d9c04e563",
        title: "Advanced Calculus",
        subject: "Mathematics",
        last_studied: "2025-10-29T11:30:00Z",
        type: "studyset",
        owner: "Lucas Janssen",
        img_url: "https://randomuser.me/api/portraits/men/28.jpg", // man
        owner_id: "3c13dbb1-0cc4-4ee3-a945-1f871b1a60d3",
        verified: false,
        likes: 15,
        items: 40,
      },
      {
        id: "52a6a93e-18dc-45e7-9543-71a1d8de3f22",
        title: "Human Anatomy Diagram Pack",
        subject: "Biology",
        last_studied: "2025-10-20T09:05:00Z",
        type: "visualset",
        owner: "Ella Van Oost",
        img_url: "https://randomuser.me/api/portraits/women/45.jpg", // vrouw
        owner_id: "profile-ella-002",
        verified: false,
        likes: 5,
        items: 4,
      },
      {
        id: "b72c0df4-1cf5-4902-b087-3c43f3a4f902",
        title: "History of World War II",
        subject: "History",
        last_studied: "2025-10-30T17:11:00Z",
        type: "studyset",
        owner: "STUDO History",
        img_url: "https://randomuser.me/api/portraits/men/76.jpg", // oudere man, past bij "official"
        owner_id: "studo-history-official",
        verified: true,
        likes: 42,
        items: 68,
      },
    ],
  },
  {
    type: "profile",
    data: [
      {
        id: "a41d8a3c-203f-4414-bb1d-0bcebf5b6e77",
        displayName: "Emma de Vries",
        img_url: "https://randomuser.me/api/portraits/women/15.jpg",
        banner_url:
          "https://images.unsplash.com/photo-1503264116251-35a269479413",
        studoProfile: false,
        role: "student",
        type: "profile",
      },
      {
        id: "3c13dbb1-0cc4-4ee3-a945-1f871b1a60d3",
        displayName: "Lucas Janssen",
        img_url: "https://randomuser.me/api/portraits/men/28.jpg",
        banner_url:
          "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
        studoProfile: false,
        role: "student",
        type: "profile",
      },
      {
        id: "profile-ella-002",
        displayName: "Ella Van Oost",
        img_url: "https://randomuser.me/api/portraits/women/45.jpg",
        banner_url:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        studoProfile: false,
        role: "teacher",
        type: "profile",
      },
      {
        id: "profile-charles-001",
        displayName: "Charles Degraeuwe",
        img_url: "https://randomuser.me/api/portraits/men/32.jpg",
        banner_url:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        studoProfile: false,
        role: "student",
        type: "profile",
      },
      {
        id: "studo-history-official",
        displayName: "STUDO History",
        img_url: "https://randomuser.me/api/portraits/men/76.jpg",
        banner_url:
          "https://images.unsplash.com/photo-1519389950476-1fb5e3c6d9a1",
        studoProfile: true,
        role: "STUDO courses",
        type: "profile",
      },
    ],
  },
  {
    type: "classroom",
    data: [
      {
        id: "f8b2e79a-ffef-4b0b-bdf4-40308a7f4a1c",
        name: "AP Computer Science 101",
        owner: "Charles Degraeuwe",
        owner_id: "profile-charles-001",
        type: "classroom",
        verified: true,
      },
      {
        id: "61d10e9c-4fa7-45cd-9827-07c2c657dcf0",
        name: "Biology Study Group",
        owner: "Ella Van Oost",
        owner_id: "profile-ella-002",
        type: "classroom",
        verified: false,
      },
    ],
  },
];

export default SEARCH_DATA;
