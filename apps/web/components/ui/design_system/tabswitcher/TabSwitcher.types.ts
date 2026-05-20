interface Tab<T extends string = string> {
  key: T;
  label: string;
  icon?: React.ReactNode;
}

export interface TabSwitcherProps<T extends string = string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (key: T) => void;
  size?: "sm" | "md" | "lg" | "xl";
}
