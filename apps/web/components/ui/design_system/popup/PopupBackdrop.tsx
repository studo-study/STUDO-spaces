interface PopupBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const PopupBackdrop = (props: PopupBackdropProps) => {
  const { isOpen, setIsOpen, children } = props;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className={`fixed inset-0 flex items-baseline justify-center pt-80 w-full bg-black/50 h-full z-[9999] 
        ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      {children}
    </div>
  );
};

PopupBackdrop.displayName = "PopupBackdrop";
export default PopupBackdrop;
