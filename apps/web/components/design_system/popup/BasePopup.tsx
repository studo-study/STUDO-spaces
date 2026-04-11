import {stopPropagation} from "@dnd-kit/core/dist/sensors/events";

interface BasePopupProps extends React.HTMLProps<HTMLDivElement> {
    popupRef: React.RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    width: string;
    className?: string;
}

const BasePopup = (props: BasePopupProps) => {
    const {popupRef, isOpen, children, width, height, className} = props;
    return (<div ref={popupRef}
                 onClick={event => event.stopPropagation()}
                 className={`
                 
                      z-[9999] truncate rounded-2xl 
                      ${width ? `w-${width}` : "w-1/4"}
                      ${height ? `h-${height}` : "min-h-135"}
                      ${className && className}
                      
        bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
        border border-white/50 dark:border-white/10 overflow-visible
        shadow-xl shadow-black/10 dark:shadow-black/30
      transition-all duration-300 ease-out origin-top flex-col gap-3 justify-between items-center
      ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}>
        {children}
    </div>)
}

BasePopup.displayName = "BasePopup";
export default BasePopup;