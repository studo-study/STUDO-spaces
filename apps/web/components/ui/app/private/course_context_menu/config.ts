export interface MenuConfig {
  pomodoro: boolean;
  learn_settings: boolean;
  chat: boolean;
  check_course: boolean;
  quick_actions: boolean;
  widgets: boolean;
}
export const context_course: Record<string, MenuConfig> = {
  learn: {
    pomodoro: true,
    learn_settings: true,
    chat: true,
    check_course: true,
    quick_actions: true,
    widgets: false,
  },
  "your-files": {
    pomodoro: false,
    learn_settings: false,
    chat: true,
    check_course: true,
    quick_actions: true,
    widgets: false,
  },
  studoset: {
    pomodoro: false,
    learn_settings: false,
    chat: true,
    check_course: true,
    quick_actions: true,
    widgets: false,
  },
  overview: {
    pomodoro: false,
    learn_settings: false,
    chat: true,
    check_course: false,
    quick_actions: false,
    widgets: true,
  },
  course: {
    pomodoro: false,
    learn_settings: false,
    chat: true,
    check_course: false,
    quick_actions: false,
    widgets: false,
  },
};

const emptyConfig: MenuConfig = {
  pomodoro: false,
  learn_settings: false,
  chat: false,
  check_course: false,
  quick_actions: false,
  widgets: false,
};

export const resolveMenuConfig = (pathname: string): MenuConfig => {
  const segments = pathname.split("/").filter(Boolean);
  const keys = Object.keys(context_course).sort(
    (a, b) => b.split("/").length - a.split("/").length,
  );
  for (const key of keys) {
    const keyParts = key.split("/");
    for (let i = 0; i + keyParts.length <= segments.length; i++) {
      if (keyParts.every((part, j) => segments[i + j] === part)) {
        return context_course[key];
      }
    }
  }
  return emptyConfig;
};
