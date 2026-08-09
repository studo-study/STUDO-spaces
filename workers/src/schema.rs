// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "account_status"))]
    pub struct AccountStatus;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "app_theme"))]
    pub struct AppTheme;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "course_document_status"))]
    pub struct CourseDocumentStatus;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "course_roles"))]
    pub struct CourseRoles;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "document_tag"))]
    pub struct DocumentTag;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "online_status"))]
    pub struct OnlineStatus;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "row_priority"))]
    pub struct RowPriority;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "row_status"))]
    pub struct RowStatus;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "row_type"))]
    pub struct RowType;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "set_type"))]
    pub struct SetType;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "vector"))]
    pub struct Vector;

    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "widget_type"))]
    pub struct WidgetType;
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::CourseRoles;

    board_users (board_id, user_id) {
        board_id -> Uuid,
        user_id -> Uuid,
        role -> CourseRoles,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    boards (id) {
        id -> Uuid,
        title -> Varchar,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        icon -> Varchar,
        public_board -> Nullable<Bool>,
        academy_year -> Nullable<Int4>,
        exam_date -> Nullable<Date>,
        institute -> Nullable<Varchar>,
    }
}

diesel::table! {
    cards (id) {
        id -> Uuid,
        #[max_length = 512]
        term -> Varchar,
        #[max_length = 512]
        definition -> Varchar,
        number -> Int4,
        #[max_length = 24]
        created_at -> Varchar,
        #[max_length = 24]
        updated_at -> Varchar,
        set_id -> Uuid,
        owner_id -> Uuid,
        #[max_length = 8]
        term_content_type -> Varchar,
        #[max_length = 32]
        code_language -> Varchar,
        suggestion_image_id -> Nullable<Uuid>,
        course_document_chunk_id -> Nullable<Uuid>,
    }
}

diesel::table! {
    chat (id) {
        id -> Uuid,
        user_id -> Uuid,
        title -> Varchar,
        creation_date -> Varchar,
        pinned -> Bool,
    }
}

diesel::table! {
    chat_message (id) {
        id -> Uuid,
        chat_id -> Uuid,
        sven_message -> Bool,
        sort_index -> Int4,
        #[max_length = 1000]
        content -> Varchar,
        created_at -> Varchar,
    }
}

diesel::table! {
    chat_message_payload (id) {
        id -> Uuid,
        message_id -> Uuid,
        studoset_id -> Nullable<Uuid>,
        card_id -> Nullable<Uuid>,
        title -> Varchar,
    }
}

diesel::table! {
    classroomactivity (id) {
        id -> Uuid,
        classroom_id -> Uuid,
        user_id -> Uuid,
        #[max_length = 64]
        displayName -> Varchar,
        #[max_length = 250]
        img_url -> Varchar,
        #[max_length = 64]
        last_seen -> Varchar,
        set_id -> Uuid,
        #[max_length = 24]
        set_type -> Varchar,
        #[max_length = 64]
        title -> Varchar,
    }
}

diesel::table! {
    classrooms (id) {
        id -> Uuid,
        #[max_length = 64]
        name -> Varchar,
        owner_id -> Uuid,
        #[sql_name = "type"]
        #[max_length = 40]
        type_ -> Varchar,
        #[max_length = 24]
        created_at -> Varchar,
        verified -> Bool,
        #[max_length = 50]
        school -> Varchar,
    }
}

diesel::table! {
    classroomsets (set_id, classroom_id) {
        set_id -> Uuid,
        #[max_length = 20]
        set_type -> Varchar,
        #[max_length = 100]
        added_by -> Varchar,
        classroom_id -> Uuid,
    }
}

diesel::table! {
    classroomusers (user_id, classroom_id) {
        user_id -> Uuid,
        classroom_id -> Uuid,
        #[max_length = 7]
        role -> Varchar,
        #[max_length = 24]
        joined_at -> Varchar,
        position -> Int4,
    }
}

diesel::table! {
    course (id) {
        id -> Uuid,
        board_id -> Nullable<Uuid>,
        title -> Varchar,
        icon -> Varchar,
        public_course -> Nullable<Bool>,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        academy_year -> Nullable<Int4>,
        exam_date -> Nullable<Date>,
        institute -> Nullable<Varchar>,
        description -> Nullable<Varchar>,
    }
}

diesel::table! {
    course_context (id) {
        id -> Uuid,
        model -> Nullable<Varchar>,
        document_count -> Nullable<Varchar>,
        context -> Nullable<Text>,
        course_id -> Nullable<Uuid>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::Vector;

    course_document_chunks (id) {
        id -> Uuid,
        document_id -> Uuid,
        page_start -> Nullable<Int4>,
        page_end -> Nullable<Int4>,
        chunk_index -> Int4,
        text -> Text,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        embedding_model -> Nullable<Varchar>,
        embedding -> Nullable<Vector>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::CourseDocumentStatus;
    use super::sql_types::DocumentTag;

    course_documents (id) {
        id -> Uuid,
        course_id -> Uuid,
        uploader_id -> Uuid,
        title -> Varchar,
        author -> Nullable<Varchar>,
        publishing_date -> Nullable<Date>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        page_count -> Nullable<Int4>,
        word_count -> Nullable<Int4>,
        status -> CourseDocumentStatus,
        storage_key -> Varchar,
        mime_type -> Varchar,
        file_size -> Nullable<Int4>,
        checksum -> Nullable<Int4>,
        document_tag -> DocumentTag,
        last_opened -> Timestamp,
    }
}

diesel::table! {
    course_resources (id) {
        id -> Uuid,
        row_id -> Uuid,
        link -> Varchar,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::RowStatus;
    use super::sql_types::RowPriority;
    use super::sql_types::RowType;

    course_rows (id) {
        id -> Uuid,
        table_id -> Uuid,
        row_index -> Int4,
        created_by -> Nullable<Uuid>,
        status -> Nullable<RowStatus>,
        priority -> Nullable<RowPriority>,
        description -> Nullable<Text>,
        #[sql_name = "type"]
        type_ -> Nullable<RowType>,
        title -> Nullable<Varchar>,
        due_date -> Nullable<Date>,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::SetType;

    course_sets (set_id, course_id) {
        set_id -> Uuid,
        set_type -> SetType,
        added_by -> Uuid,
        course_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    course_tables (id) {
        id -> Uuid,
        course_id -> Uuid,
        title -> Varchar,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        description -> Nullable<Varchar>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::CourseRoles;

    course_users (user_id, course_id) {
        user_id -> Uuid,
        course_id -> Uuid,
        role -> CourseRoles,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::WidgetType;

    course_widgets (id) {
        id -> Uuid,
        workspace_id -> Uuid,
        #[sql_name = "type"]
        type_ -> WidgetType,
        x -> Int4,
        y -> Int4,
        w -> Int4,
        h -> Int4,
        config -> Jsonb,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    course_workspaces (id) {
        id -> Uuid,
        course_id -> Uuid,
    }
}

diesel::table! {
    images (id) {
        id -> Uuid,
        #[max_length = 100]
        title -> Varchar,
        index -> Int4,
        #[max_length = 250]
        url -> Varchar,
        grid_x -> Int4,
        grid_y -> Int4,
        #[max_length = 64]
        scale -> Varchar,
        set_id -> Uuid,
    }
}

diesel::table! {
    pins (id) {
        id -> Uuid,
        #[max_length = 128]
        definition -> Varchar,
        x -> Int4,
        y -> Int4,
        number -> Int4,
        #[max_length = 24]
        created_at -> Varchar,
        #[max_length = 24]
        updated_at -> Varchar,
        image_id -> Uuid,
        set_id -> Uuid,
        owner_id -> Uuid,
    }
}

diesel::table! {
    popular_sets (id) {
        id -> Uuid,
        studyset_id -> Nullable<Uuid>,
        visualset_id -> Nullable<Uuid>,
        rank -> Int4,
        snapshot_id -> Int4,
    }
}

diesel::table! {
    profiles (user_id) {
        user_id -> Uuid,
        #[max_length = 100]
        displayname -> Varchar,
        #[max_length = 250]
        img_url -> Varchar,
        #[max_length = 250]
        banner_url -> Nullable<Varchar>,
        join_date -> Timestamp,
        join_number -> Int4,
        streak -> Int4,
        verified -> Bool,
        tags -> Array<Nullable<Varchar>>,
    }
}

diesel::table! {
    reports (report_id) {
        report_id -> Uuid,
        filled_by -> Uuid,
        #[max_length = 50]
        report_type -> Varchar,
        description -> Nullable<Text>,
        target_id -> Uuid,
        #[max_length = 20]
        target_type -> Varchar,
        reported_user_id -> Nullable<Uuid>,
        #[max_length = 20]
        status -> Varchar,
        priority -> Varchar,
        created_at -> Timestamp,
        resolved_at -> Nullable<Timestamp>,
        reviewed_by -> Nullable<Uuid>,
        moderator_note -> Nullable<Text>,
        assignee_id -> Nullable<Uuid>,
        assignee_displayName -> Nullable<Varchar>,
        number -> Int4,
    }
}

diesel::table! {
    sessioncards (id) {
        id -> Uuid,
        number -> Int4,
        card_viewcount -> Int4,
        card_total_viewcount -> Int4,
        inQueue -> Bool,
        mastered -> Bool,
        times_relearned -> Int4,
        card_id -> Uuid,
        session_id -> Uuid,
        owner_id -> Uuid,
        flagged -> Bool,
        total_attempts -> Int4,
        total_correct -> Int4,
        response_sum_ms -> Int4,
    }
}

diesel::table! {
    sessionpins (id) {
        id -> Uuid,
        number -> Int4,
        pin_viewcount -> Int4,
        pin_total_viewcount -> Int4,
        inQueue -> Bool,
        mastered -> Bool,
        times_relearned -> Int4,
        pin_id -> Uuid,
        session_id -> Uuid,
        owner_id -> Uuid,
        flagged -> Bool,
        total_attempts -> Int4,
        total_correct -> Int4,
    }
}

diesel::table! {
    setlikes (id) {
        id -> Uuid,
        user_id -> Uuid,
        set_id -> Uuid,
        #[max_length = 20]
        set_type -> Varchar,
        #[max_length = 24]
        created_at -> Varchar,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::AppTheme;
    use super::sql_types::AccountStatus;
    use super::sql_types::OnlineStatus;

    settings (id) {
        id -> Uuid,
        user_id -> Uuid,
        dev_mode -> Bool,
        debug_mode -> Bool,
        show_reprocessing -> Bool,
        visible_streak -> Bool,
        share_group_progress -> Bool,
        allow_group_invites -> Bool,
        auto_group_participation -> Bool,
        theme -> AppTheme,
        email_notifications -> Bool,
        in_app_notifications -> Bool,
        progress_notifications -> Bool,
        streak_reminders -> Bool,
        account_status -> AccountStatus,
        online_status -> OnlineStatus,
    }
}

diesel::table! {
    studoprofilecommunities (classroom_id, studoprofile_id) {
        classroom_id -> Uuid,
        #[max_length = 20]
        class_type -> Varchar,
        studoprofile_id -> Uuid,
    }
}

diesel::table! {
    studoprofiles (user_id) {
        user_id -> Uuid,
        #[max_length = 100]
        displayname -> Varchar,
        #[max_length = 250]
        img_url -> Varchar,
        #[max_length = 250]
        banner_url -> Varchar,
        tags -> Array<Nullable<Varchar>>,
    }
}

diesel::table! {
    studotracks (id) {
        id -> Uuid,
        studoprofile_id -> Uuid,
        #[max_length = 100]
        displayname -> Varchar,
        #[max_length = 50]
        icon_name -> Varchar,
        #[max_length = 50]
        grade -> Varchar,
    }
}

diesel::table! {
    studysessions (id) {
        id -> Uuid,
        user_id -> Uuid,
        set_id -> Uuid,
        #[max_length = 30]
        set_type -> Varchar,
        #[max_length = 24]
        started_at -> Varchar,
        duration_min -> Int4,
        #[max_length = 24]
        ended_at -> Varchar,
        set_index -> Int4,
        accuracy -> Int4,
        average_response_time -> Int4,
        longest_focus_streak -> Int4,
        #[max_length = 64]
        last_seen -> Varchar,
        last_studied -> Varchar,
        total_attempts -> Int4,
        total_correct -> Int4,
        completions -> Int4,
    }
}

diesel::table! {
    studysets (id) {
        id -> Uuid,
        #[max_length = 200]
        title -> Varchar,
        studoset -> Bool,
        #[max_length = 2]
        global_term_language -> Varchar,
        #[max_length = 2]
        global_definition_language -> Varchar,
        #[max_length = 24]
        created_at -> Varchar,
        #[max_length = 24]
        last_updated -> Varchar,
        publicSet -> Bool,
        #[max_length = 100]
        displayname -> Varchar,
        #[max_length = 250]
        img_url -> Varchar,
        user_id -> Uuid,
        generated -> Bool,
    }
}

diesel::table! {
    suggestion_images (id) {
        id -> Uuid,
        pexels_id -> Varchar,
        display_url -> Varchar,
        source -> Varchar,
        photographer -> Varchar,
        source_page_url -> Varchar,
    }
}

diesel::table! {
    suggestion_terms_cards (card_id, image_id) {
        card_id -> Uuid,
        image_id -> Uuid,
        selected_count -> Int4,
    }
}

diesel::table! {
    tracksets (id) {
        #[max_length = 20]
        set_type -> Varchar,
        track_id -> Uuid,
        id -> Uuid,
    }
}

diesel::table! {
    users (id) {
        id -> Uuid,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 255]
        password_hash -> Varchar,
        #[max_length = 100]
        displayname -> Varchar,
        #[max_length = 250]
        img_url -> Varchar,
        join_date -> Timestamp,
        join_number -> Int4,
        total_sets -> Int4,
        streak_started -> Nullable<Timestamp>,
        streak_count -> Nullable<Int4>,
        streak_last_update -> Nullable<Timestamp>,
        last_login -> Timestamp,
        roles -> Jsonb,
        #[max_length = 24]
        public_role -> Varchar,
        verified -> Bool,
        banned -> Bool,
        last_online -> Nullable<Timestamp>,
    }
}

diesel::table! {
    visualsets (id) {
        id -> Uuid,
        #[max_length = 200]
        title -> Varchar,
        studoset -> Bool,
        #[max_length = 24]
        created_at -> Varchar,
        #[max_length = 24]
        last_updated -> Varchar,
        publicSet -> Bool,
        user_id -> Uuid,
        #[max_length = 100]
        displayname -> Varchar,
        #[max_length = 250]
        img_url -> Varchar,
    }
}

diesel::joinable!(board_users -> boards (board_id));
diesel::joinable!(board_users -> users (user_id));
diesel::joinable!(cards -> course_document_chunks (course_document_chunk_id));
diesel::joinable!(cards -> studysets (set_id));
diesel::joinable!(cards -> users (owner_id));
diesel::joinable!(chat -> users (user_id));
diesel::joinable!(chat_message -> chat (chat_id));
diesel::joinable!(chat_message_payload -> cards (card_id));
diesel::joinable!(chat_message_payload -> chat_message (message_id));
diesel::joinable!(chat_message_payload -> studysets (studoset_id));
diesel::joinable!(classroomactivity -> classrooms (classroom_id));
diesel::joinable!(classroomactivity -> users (user_id));
diesel::joinable!(classrooms -> users (owner_id));
diesel::joinable!(classroomsets -> classrooms (classroom_id));
diesel::joinable!(classroomusers -> classrooms (classroom_id));
diesel::joinable!(classroomusers -> users (user_id));
diesel::joinable!(course -> boards (board_id));
diesel::joinable!(course_context -> course (course_id));
diesel::joinable!(course_document_chunks -> course_documents (document_id));
diesel::joinable!(course_documents -> course (course_id));
diesel::joinable!(course_documents -> users (uploader_id));
diesel::joinable!(course_resources -> course_rows (row_id));
diesel::joinable!(course_rows -> course_tables (table_id));
diesel::joinable!(course_rows -> users (created_by));
diesel::joinable!(course_sets -> course (course_id));
diesel::joinable!(course_sets -> users (added_by));
diesel::joinable!(course_tables -> course (course_id));
diesel::joinable!(course_users -> course (course_id));
diesel::joinable!(course_users -> users (user_id));
diesel::joinable!(course_widgets -> course_workspaces (workspace_id));
diesel::joinable!(course_workspaces -> course (course_id));
diesel::joinable!(images -> visualsets (set_id));
diesel::joinable!(pins -> images (image_id));
diesel::joinable!(pins -> users (owner_id));
diesel::joinable!(pins -> visualsets (set_id));
diesel::joinable!(popular_sets -> studysets (studyset_id));
diesel::joinable!(popular_sets -> visualsets (visualset_id));
diesel::joinable!(profiles -> users (user_id));
diesel::joinable!(sessioncards -> cards (card_id));
diesel::joinable!(sessioncards -> studysessions (session_id));
diesel::joinable!(sessioncards -> users (owner_id));
diesel::joinable!(sessionpins -> pins (pin_id));
diesel::joinable!(sessionpins -> studysessions (session_id));
diesel::joinable!(sessionpins -> users (owner_id));
diesel::joinable!(setlikes -> users (user_id));
diesel::joinable!(settings -> users (user_id));
diesel::joinable!(studoprofilecommunities -> classrooms (classroom_id));
diesel::joinable!(studoprofilecommunities -> studoprofiles (studoprofile_id));
diesel::joinable!(studoprofiles -> users (user_id));
diesel::joinable!(studotracks -> studoprofiles (studoprofile_id));
diesel::joinable!(studysessions -> users (user_id));
diesel::joinable!(studysets -> users (user_id));
diesel::joinable!(suggestion_terms_cards -> cards (card_id));
diesel::joinable!(suggestion_terms_cards -> suggestion_images (image_id));
diesel::joinable!(tracksets -> studotracks (track_id));
diesel::joinable!(visualsets -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    board_users,
    boards,
    cards,
    chat,
    chat_message,
    chat_message_payload,
    classroomactivity,
    classrooms,
    classroomsets,
    classroomusers,
    course,
    course_context,
    course_document_chunks,
    course_documents,
    course_resources,
    course_rows,
    course_sets,
    course_tables,
    course_users,
    course_widgets,
    course_workspaces,
    images,
    pins,
    popular_sets,
    profiles,
    reports,
    sessioncards,
    sessionpins,
    setlikes,
    settings,
    studoprofilecommunities,
    studoprofiles,
    studotracks,
    studysessions,
    studysets,
    suggestion_images,
    suggestion_terms_cards,
    tracksets,
    users,
    visualsets,
);
