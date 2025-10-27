# STUDO API CALLS

## 1. USERS

### Beschrijving

- Nieuwe gebruiker aanmaken
- Profielfoto uploaden
- Alle gebruikers opvragen
- Specifieke gebruiker opvragen
- Alle studysets van gebruiker opvragen
- Specifieke studyset van gebruiker opvragen
- Statistieken van gebruiker opvragen
- Alle classrooms van gebruiker opvragen
- Specifieke classroom van gebruiker opvragen
- Gebruiker updaten
- Gebruiker verwijderen

### Calls

| **CALL**                                         | **UITLEG**                                      |
|--------------------------------------------------|-------------------------------------------------|
| `POST /api/user`                                 | Nieuwe gebruiker aanmaken                       |
| `POST /api/user/:id/profile-picture`             | Profielfoto uploaden                            |
| `GET /api/user`                                  | Alle gebruikers opvragen                        |
| `GET /api/user/:user_id`                         | Info van een specifieke gebruiker opvragen      |
| `GET /api/user/:user_id/studyset`                | Alle studysets van gebruiker opvragen           |
| `GET /api/user/:user_id/studyset/:set_id`        | Één specifieke studyset van gebruiker opvragen  |
| `GET /api/user/:user_id/stats`                   | Alle statistieken van gebruiker opvragen        |
| `GET /api/user/:user_id/classroom`               | Alle classrooms van gebruiker opvragen          |
| `GET /api/user/:user_id/classroom/:classroom_id` | Één specifieke classroom van gebruiker opvragen |
| `PUT /api/user/:user_id`                         | Gebruiker updaten                               |
| `DELETE /api/user/:user_id`                      | Gebruiker verwijderen                           |

---

## 2. STUDYSETS

### Beschrijving

- Alle studysets opvragen
- Een specifieke studyset opvragen
- Studysessions van specifieke studyset opvragen
- Een nieuwe studyset aanmaken
- Een studyset liken
- Een bestaande studyset updaten
- Een studyset naar andere folder verplaatsen
- Een studyset verwijderen

### Calls

| **CALL**                                 | **UITLEG**                              |
|------------------------------------------|-----------------------------------------|
| `GET /api/studyset`                      | Alle studysets opvragen                 |
| `GET /api/studyset/:set_id`              | Specifieke studyset opvragen            |
| `GET /api/studyset/:set_id/studysession` | Studysessions van studyset opvragen     |
| `POST /api/studyset`                     | Nieuwe studyset aanmaken                |
| `POST /api/studyset/:set_id/likes`       | Studyset liken                          |
| `PUT /api/studyset/:set_id`              | Bestaande studyset updaten              |
| `PUT /api/studyset/:set_id/folder`       | Studyset naar andere folder verplaatsen |
| `DELETE /api/studyset/:set_id`           | Specifieke studyset verwijderen         |

---

## 3. VISUALSETS

### Beschrijving

- Alle visualsets opvragen
- Een specifieke visualset opvragen
- Studysessions van specifieke visualset opvragen
- Een nieuwe visualset aanmaken
- Een visualset liken
- Een bestaande visualset updaten
- Een visualset naar andere folder verplaatsen
- Een visualset verwijderen

### Calls

| **CALL**                                  | **UITLEG**                               |
|-------------------------------------------|------------------------------------------|
| `GET /api/visualset`                      | Alle visualsets opvragen                 |
| `GET /api/visualset/:set_id`              | Specifieke visualset opvragen            |
| `GET /api/visualset/:set_id/studysession` | Studysessions van visualset opvragen     |
| `POST /api/visualset`                     | Nieuwe visualset aanmaken                |
| `POST /api/visualset/:set_id/likes`       | Visualset liken                          |
| `PUT /api/visualset/:set_id`              | Bestaande visualset updaten              |
| `PUT /api/visualset/:set_id/folder`       | Visualset naar andere folder verplaatsen |
| `DELETE /api/visualset/:set_id`           | Specifieke visualset verwijderen         |

---

## 4. CLASSROOMS

### Beschrijving

- Alle classrooms opvragen
- Een specifieke classroom opvragen
- Alle studysets van een classroom opvragen
- Alle gebruikers van een classroom opvragen
- Een nieuwe classroom aanmaken
- Een studyset toevoegen aan classroom
- Een gebruiker toevoegen aan classroom
- Een classroom updaten
- Een classroom verwijderen
- Een gebruiker verwijderen uit classroom
- Een studyset verwijderen uit classroom

### Calls

| **CALL**                                           | **UITLEG**                                |
|----------------------------------------------------|-------------------------------------------|
| `GET /api/classroom`                               | Alle classrooms opvragen                  |
| `GET /api/classroom/:classroom_id`                 | Specifieke classroom opvragen             |
| `GET /api/classroom/:classroom_id/sets`            | Alle studysets binnen classroom opvragen  |
| `GET /api/classroom/:classroom_id/users`           | Alle gebruikers binnen classroom opvragen |
| `POST /api/classroom`                              | Nieuwe classroom aanmaken                 |
| `POST /api/classroom/:classroom_id/sets`           | Studyset toevoegen aan classroom          |
| `POST /api/classroom/:classroom_id/users`          | Gebruiker toevoegen aan classroom         |
| `PUT /api/classroom/:classroom_id`                 | Classroom updaten                         |
| `DELETE /api/classroom/:classroom_id`              | Classroom verwijderen                     |
| `DELETE /api/classroom/:classroom_id/users/:id`    | Gebruiker verwijderen uit classroom       |
| `DELETE /api/classroom/:classroom_id/sets/:set_id` | Studyset verwijderen uit classroom        |

---

## 5. STUDYSESSIONS

### Beschrijving

- Alle studysessions opvragen
- Een specifieke studysession opvragen
- Een studysession updaten
- Een studysession verwijderen

### Calls

| **CALL**                               | **UITLEG**                       |
|----------------------------------------|----------------------------------|
| `GET /api/studysession`                | Alle studysessions opvragen      |
| `GET /api/studysession/:session_id`    | Specifieke studysession opvragen |
| `PATCH /api/studysession/:session_id`  | Studysession updaten             |
| `DELETE /api/studysession/:session_id` | Studysession verwijderen         |

---

## 6. FOLDERS

### Beschrijving

- Alle folders opvragen
- Één specifieke folder opvragen
- Een folder verwijderen

### Calls

| **CALL**                        | **UITLEG**                 |
|---------------------------------|----------------------------|
| `GET /api/folder`               | Alle folders opvragen      |
| `GET /api/folder/:folder_id`    | Specifieke folder opvragen |
| `DELETE /api/folder/:folder_id` | Folder verwijderen         |

---

## 7. PROFILE

### Beschrijving

> Deze controller is gekoppeld aan de `user`, en dient vooral voor profieldata die visueel getoond wordt in de app.  
> En die wordt doorgaans automatisch geüpdatet met user-data.
> Deze gaat nooit direct worden geupdate, altijd tesamen met de user.

### Calls

| **CALL**               | **UITLEG**                           |
|------------------------|--------------------------------------|
| `GET /api/profile`     | Alle profielen opvragen              |
| `GET /api/profile/:id` | Profiel van specifieke user opvragen |

---

## Opmerkingen

- Alle routes zijn geprefixed met `/api/`
- Consistente RESTful structuur per entiteit (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- **Visualset** en **Studyset** hebben vrijwel identieke functionaliteit
- **Folder switching** gebeurt via de studyset/visualset endpoints met `PUT /:set_id/folder`
- **Likes** worden toegevoegd via `POST /:set_id/likes` op studyset/visualset
- **Classroom users/sets** worden beheerd via de classroom endpoints
- **Profile** en **User** controllers zijn conceptueel gekoppeld (Profile haalt visuele data van User)