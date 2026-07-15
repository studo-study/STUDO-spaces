import { COLORS, COURSES, parseFlowIcon } from "./IconPicker";

interface FlowIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export default function FlowIcon({
  icon,
  size = 20,
  className = "w-10 h-10 rounded-xl",
}: FlowIconProps) {
  const { color: colorName, icon: iconName } = parseFlowIcon(icon);
  const color = COLORS.find((c) => c.name === colorName) ?? COLORS[0];
  const Icon = COURSES[iconName] ?? COURSES["bookopen"];

  return (
    <div
      className={`${className} ${color.bg} ${color.text} flex items-center justify-center`}
    >
      <Icon size={size} />
    </div>
  );
}
