import { ContextMenu } from "radix-ui";

interface SimpleMenuProps {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  width?: string | number;
  clickOutside?: () => void;
  isOpenProp?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

const SimpleContextMenu: React.FC<SimpleMenuProps> = (props) => {
  const { trigger, children, clickOutside } = props;
  return (
    <ContextMenu.Root onOpenChange={clickOutside}>
      <ContextMenu.Trigger asChild>{trigger}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content onClick={(ev) => ev.stopPropagation()}>
          <div>{children}</div>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

SimpleContextMenu.displayName = "SimpleContextMenu";
export default SimpleContextMenu;
