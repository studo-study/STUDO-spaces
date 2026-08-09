export interface MenuConfig {
  pomodoro: boolean;
  learn_settings: boolean;
  chat: boolean;
  check_course: boolean;
  quick_actions: boolean;
  widgets: boolean;
  doc_settings: boolean;
}
export const context_course: Record<string, MenuConfig> = {
  learn: {
    pomodoro: true,
    learn_settings: true,
    chat: true,
    check_course: true,
    quick_actions: true,
    widgets: false,
    doc_settings: false,
  },
  "your-files": {
    pomodoro: false,
    learn_settings: false,
    chat: true,
    check_course: true,
    quick_actions: true,
    widgets: false,
    doc_settings: false,
  },
  studoset: {
    pomodoro: false,
    learn_settings: false,
    chat: true,
    check_course: true,
    quick_actions: true,
    widgets: false,
    doc_settings: false,
  },
  overview: {
    pomodoro: false,
    learn_settings: false,
    chat: true,
    check_course: false,
    quick_actions: false,
    widgets: true,
    doc_settings: false,
  },
  course: {
    pomodoro: false,
    learn_settings: false,
    chat: true,
    check_course: false,
    quick_actions: false,
    widgets: false,
    doc_settings: false,
  },
  documents: {
    pomodoro: false,
    learn_settings: false,
    chat: true,
    check_course: false,
    quick_actions: false,
    widgets: false,
    doc_settings: true,
  },
};

const emptyConfig: MenuConfig = {
  pomodoro: false,
  learn_settings: false,
  chat: false,
  check_course: false,
  quick_actions: false,
  widgets: false,
  doc_settings: true,
};

export const resolveMenuConfig = (pathname: string): MenuConfig => {
  const segments = pathname.split("/").filter(Boolean);

  let best: { config: MenuConfig; offset: number; length: number } | null =
    null;

  for (const key of Object.keys(context_course)) {
    const keyParts = key.split("/");
    for (let i = 0; i + keyParts.length <= segments.length; i++) {
      if (!keyParts.every((part, j) => segments[i + j] === part)) continue;
      if (
        !best ||
        i > best.offset ||
        (i === best.offset && keyParts.length > best.length)
      ) {
        best = {
          config: context_course[key],
          offset: i,
          length: keyParts.length,
        };
      }
    }
  }

  return best?.config ?? emptyConfig;
};
