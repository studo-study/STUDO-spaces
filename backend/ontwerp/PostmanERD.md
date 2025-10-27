[User]
*id
email
password
displayName
img_url
join_date
streak_started
streak_count
streak_last_update
last_login
hearts
role

[Profile]
*id
email
displayName
img_url
joinDate
streak
joinNumber

[Studyset]
*id
title
subject
folder
global_term_language
global_definition_language
created_at
last_studied
last_updated
publicSet
hearts                    
+user_id
+folder_id

[Card]
*id
term
definition
created_at
updated_at
card_viewcount
card_totalviewcount
inQueue
mastered
times_relearned
+set_id
+owner_id

[Visualset]
*id
title
subject
created_at
last_studied
last_updated
publicSet
hearts
grid_x
grid_y
scale
+user_id
+folder_id

[Pin]
*id
definition
x
y
number
created_at
updated_at
pin_viewcount
pin_totalviewcount
+set_id
+owner_id

[SetLike]
*+user_id
*+set_id
created_at

[Folder]
+id
name
owner

[Classroom]
*id
name
owner
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

[StudySession]
*id
started_at
duration_min
second_last_login
last_login
ended_at
index
accuracy
average_response_time
longest_focus_streak
device_type
last_seen
+user_id
+set_id

User 1--* Studyset
User 1--* Visualset
User 1--* SetLike         
Studyset 1--* SetLike
Visualset 1--* SetLike
Studyset *--1 Folder
Visualset *--1 Folder
Studyset 1--* Card
Visualset 1--* Pin
User 1--* ClassroomUser
ClassroomUser *--1 Classroom
Studyset 1--* ClassroomSet
Visualset 1--* ClassroomSet

Classroom 1--* ClassroomSet

User 1--* StudySession
Studyset 1--* StudySession
Visualset 1--* StudySession