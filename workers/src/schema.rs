diesel::table! {
    use diesel::sql_types::*;
    use pgvector::sql_types::Vector;

    courses (id) {
        id -> Uuid,
        board_id -> Uuid,
        title -> VarChar,
        description -> Nullable<Varchar>,
        icon -> VarChar,
        public_course -> Nullable<Bool>,
        created_at -> Nullable<Timestamptz>,
        updated_at -> Nullable<Timestamptz>,
        academy_year -> Nullable<Int4>,
        exam_date -> Nullable<Date>,
        institute -> Nullable<VarChar>
    }
}

diesel::table! {
    use diesel::sql_types::*;

    course_context (id) {
        id -> Uuid,
        course_id -> Uuid,
        model -> Nullable<VarChar>,
        document_count -> Nullable<VarChar>,
        context -> Nullable<Text>
    }
}

diesel::table! {
    use diesel::sql_types::*;

    course_users (id) {
        id -> Uuid,
        course_id -> Uuid,
        role -> VarChar,
        created_at -> Nullable<Timestamptz>,
        updated_at -> Nullable<Timestamptz>,
    }
}

diesel::table! {
    use diesel::sql_types::*;

    course_workspaces (id) {
        id -> Uuid,
        courseId -> Uuid,
    }

}

diesel::table! {
    use diesel::sql_types::*;

    course_widgets (id) {
        id -> Uuid,
        workspace_id -> Uuid,
        x -> Int4,
        y -> Int4,
    }
}
