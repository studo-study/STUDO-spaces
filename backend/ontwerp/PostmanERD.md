[User]
*id
email
password
displayName
join_date
streak_started
streak_count
streak_last_update
last_login
hearts
role

[Set]
*id
title
subject
folder
global_term_language
global_definition_language
created_at
last_studied
last_updated
public
hearts                    
+user_id
+folder_id

[SetLike]
*+user_id
*+set_id
created_at

[Card]
*id
term
definition
created_at
updated_at
card_viewcount
+set_id

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
+user_id
+set_id

User 1--* Set
User 1--* SetLike         
Set 1--* SetLike          
Set 1--* Folder
Set 1--* Card
User 1--* ClassroomUser
ClassroomUser *--1 Classroom
Set 1--* ClassroomSet
Classroom 1--* ClassroomSet
User 1--* StudySession
Set 1--* StudySession