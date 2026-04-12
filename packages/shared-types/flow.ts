export interface CreateFlowBoard {
    title: string;
    icon: string;
    description: string;
    year: string;
    semester?: string;
    school?: string;
    school_id?: string;
}

export interface UpdateFLowBoard {
    title?: string;
    icon?: string;
    description?: string;
    year?: string;
    semester?: string;
    school?: string;
    school_id?: string;
}

export interface FlowBoardResponse {
    id: string;
    owner_id: string;
    owner_name: string;
    owner_pfp: string;
    title: string;
    icon: string;
    creator_id: string;
    year: string;
    semester: string;
    school: string;
    school_id: string;
    courses:FlowCourseResponse[],
}

export interface FlowBoardOverview {
    id: string;
    owner_id: string;
    owner_name: string;
    owner_pfp: string;
    title: string;
    icon: string;
    creator_id: string;
    year: string;
    semester: string;
    school: string;
    school_id: string;
}

export interface CreateFlowCourse {
    board_id: string;
    title: string;
    icon: string;
    description?: string;
    added_by: string;
}

export interface UpdateFlowCourse {
    title?: string;
    icon?: string;
    description?: string;
}

export interface FlowCourseResponse {
    id: string;
    board_id: string;
    added_by_display_name: string;
    added_by_id: string;
    title: string;
    icon: string;
    description: string;
    rows: FlowRowResponse[];
}

export interface CreateFlowRow {
    course_id: string;
    title: string;
    description?: string;
    priority?: string;
    course_link?: string;
    summary_link?: string;
    status: string;
    due_date?: string;
    studoset_id?: string;
    visualset_id?: string;

}

export interface UpdateFlowRow {
    title?: string;
    description?: string;
    priority?: string;
    course_link?: string;
    summary_link?: string;
    status?: string;
    due_date?: string;
    studoset_id?: string;
    visualset_id?: string;
}

export interface FlowRowResponse {
    id: string;
    course_id: string;
    title: string;
    description: string;
    priority: string;
    course_link?: string;
    summary_link?: string;
    status: string;
    due_date: string;
    studoset_id: string;
    visualset_id: string;
}