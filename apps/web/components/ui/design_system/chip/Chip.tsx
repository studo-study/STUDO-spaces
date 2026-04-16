import {ReactNode} from "react";

interface ChipProps {
    label: string;
    icon?: ReactNode;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    onPress?: () => void;
    textColor?: string;
    bgColor?: string;
}

const Chip = (props: ChipProps) => {
    const {label, icon, iconLeft, iconRight, onPress, bgColor, textColor} = props;
    return (<div onClick={onPress}
                 className={`w-fit cursor-pointer ${textColor ? textColor : "dark:text-white text-studodarkblue"} flex flex-row items-center gap-1 rounded-full ${bgColor ? bgColor : "bg-studogrey/30"}  hover:border-studoborder transition-all border border-studoborder/30 px-3 py-1`}>
        {iconLeft}
        <span className={"font-bold text-xs"}>{label}</span>
        {iconRight}
    </div>)
}

Chip.displayName = "Chip";
export default Chip;