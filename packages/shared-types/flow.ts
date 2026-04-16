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
    year: string | null;
    semester: string | null;
    school: string | null;
    school_id: string | null;
    total_done: number;
    total_in_progress: number;
    total_length: number;
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
    year: string | null;
    semester: string | null;
    school: string | null;
    school_id: string | null;
    progress: number;
    total_length: number;
}

export interface CreateFlowCourse {
    board_id: string;
    title: string;
    icon: string;
    description?: string;
    resource?: string;
    exam_date?: string;
    lesson_days?: string;
}

export interface UpdateFlowCourse {
    title?: string;
    icon?: string;
    description?: string;
    exam_date?: string;
    lesson_days?: string;
}

export interface FlowCourseResponse {
    id: string;
    board_id: string;
    added_by_display_name: string;
    added_by_id: string;
    title: string;
    icon: string;
    description: string;
    total_done: number;
    total_in_progress: number;
    total_length: number;
    resource: string;
    exam_date: string;
    lesson_days: string;
}

export interface FullFlowCourseResponse extends FlowCourseResponse {
    rows: FlowRowResponse[];
}

export interface CreateFlowRow {
    course_id: string;
    title: string;
    order_index?: number;
    description?: string;
    priority?: Priority;
    status: Status;
    due_date?: string;
    studoset_id?: string;
    visualset_id?: string;
    resources?: CreateFlowResource[];
}


export interface UpdateFlowRow {
    title?: string;
    order_index?: number;
    description?: string;
    priority?: Priority;
    status?: Status;
    due_date?: string;
    studoset_id?: string;
    visualset_id?: string;
}

export interface FlowRowResponse {
    id: string;
    course_id: string;
    title: string;
    order_index: number;
    description: string;
    priority: string;
    course_link?: string;
    summary_link?: string;
    status: string;
    due_date: string;
    studoset_id: string;
    visualset_id: string;
    resources: FlowResourceResponse[];
}

export interface CreateFlowResource {
    title: string;
    link: string;
    link_type?: string;
    resource_type?: ResourceType;
}

export interface UpdateFlowResource {
    title?: string;
    link?: string;
    link_type?: string;
    resource_type?: ResourceType;
}

export interface FlowResourceResponse {
    id: string;
    title: string;
    link: string;
    link_type?: string;
    resource_type?: ResourceType;
}

export type ResourceType = 'course' | 'notes' | 'summary' | 'abstract' | 'sample_exam' | 'task';
export type Priority = 'no_priority' | 'low' | 'medium' | 'high';
export type Status = 'not_started' | 'doing' | 'done';