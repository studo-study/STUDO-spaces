interface Tab<T extends string = string> {
  key: T;
  label: string;
  icon?: React.ReactNode;
  onclick?: () => void;
  /** When set, the tab renders as a navigation link (locale-aware). */
  href?: string;
}

export interface SegmentedControlsProps<T extends string = string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (key: T) => void;
  size?: "sm" | "md" | "lg" | "xl";
  stretch?: boolean;
}
