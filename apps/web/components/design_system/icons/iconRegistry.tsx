import { FiStar, FiFolder, FiBriefcase, FiBook, FiCode } from 'react-icons/fi';
import { IconType } from 'react-icons';
import {CiViewTable} from "react-icons/ci";

const ICON_MAP: Record<string, IconType> = {
    star: FiStar,
    folder: FiFolder,
    briefcase: FiBriefcase,
    book: FiBook,
    code: FiCode,
};

export function getFlowIcon(iconName: string): IconType {
    return ICON_MAP[iconName] ?? CiViewTable; // fallback
}