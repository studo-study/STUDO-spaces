[User]
*id
email
password
displayname
img_url
join_date
streak_started
streak_count
streak_last_update
last_login
role

[Profile]
*id
email
displayName
img_url
join_date
streak
joinNumber

[Studyset]
*id
title
course
folder
global_term_language
global_definition_language
created_at
last_updated
public_set
+user_id
+folder_id

[CardItem]
*id
term
definition
number
created_at
updated_at
+set_id
+owner_id

[Visualset]
*id
title
course
created_at
last_updated
public_set
+user_id
+folder_id

[Image]
*id
title
url
grid_x
grid_y
scale_x
set_id

[Identify]
*id
definition
x
y
number
created_at
updated_at
+image_id
+set_id
+owner_id

[SetLike]
*+user_id
set_id
set_type
created_at

[Folder]
+id
name
owner_id

[Classroom]
*id
name
owner_id
type
created_at
verified

[ClassroomUser]
*+user_id
*+classroom_id
role

[ClassroomSet]
*+set_id
*+classroom_id

[ClassroomActivity]
*id
+classroom_id
+user_id
displayName
img_url
+set_id
set_type
title
last_seen

[StudySession]
*id
started_at
duration_min
ended_at
set_index
accuracy
average_response_time
longest_focus_streak
last_seen
last_studied
+user_id
+set_id
+set_type

[SessionPin]
*id
number
pin_viewcount
pin_total_viewcount
inQueue
mastered
times_relearned
pin_id
session_id
owner_id

[SessionCard]
*id
number
card_viewcount
card_total_viewcount
inQueue
mastered
times_relearned
card_id
session_id
owner_id

[Flowboard]
*id
+owner_id
title
icon
created_at
updated_at
year
semester
school_name
school_id

[Flowcourse]
*id
+board_id
+added_by
title
icon
description

[Flowrow]
*id
+flowcourse_id
title
description
priority
course_link
summary_link
status
due_date
+studoset_id
+visualset_id

User 1--* Studyset
User 1--* Visualset
User 1--1 Profile
Studyset 1--* SetLike
Visualset 1--* SetLike
Studyset *--1 Folder
Visualset *--1 Folder
Studyset 1--* CardItem
Visualset 1--* Image
Image 1--* Identify
User 1--* ClassroomUser
ClassroomUser *--1 Classroom
User 1--* ClassroomActivity
ClassroomActivity *--1 Classroom
Studyset 1--* ClassroomSet
Visualset 1--* ClassroomSet
Studyset 1--* ClassroomActivity
Visualset 1--* ClassroomActivity
Classroom 1--* ClassroomSet
User 1--* StudySession
Studyset 1--* StudySession
Visualset 1--* StudySession
StudySession 1--* SessionPin
StudySession 1--* SessionCard
Identify 1--* SessionPin
CardItem 1--* SessionCard
User 1--* Flowboard
Flowboard 1--* Flowcourse
User 1--* Flowcourse
Flowcourse 1--* Flowrow
Studyset 1--* Flowrow
Visualset 1--* Flowrow