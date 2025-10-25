# API CALLS STUDO:

## 1. USERS:

### 1.1 BESCHRIJVING:

- Een gebruiker moet kunnen worden aangemaakt
- Een gebruiker moet zijn eigen data kunnen uitlezen op de profielpagina
- Een gebruiker moet zijn of haar account kunnen verwijderen
- Een gebruiker moet al zijn/haar classrooms kunnen bekijken
- Een gebruiker moet één specifieke classroom waar hij/zij inzit kunnen bekijken

<br>

### 1.2 CALLS:

| **CALL**                                    | **UITLEG**                                            |
|---------------------------------------------|-------------------------------------------------------|
| `POST /api/users`                         | Een nieuwe user kan worden aangemaakt                 |
| `GET /api/users/:id`                        | Statistieken en info van een specifieke user opvragen |
| `DELETE /api/users/:id`                     | Je account verwijderen                                |
| `GET /api/users/:id/classrooms/`            | Alle classrooms waar een user inzit opvragen          |
| `GET /api/users/:id/classrooms/:classroom_id` | Specifieke classroom waar een user inzit opvragen     |

<br>

## 2. STUDYSETS:

### 2.1 BESCHRIJVING: 
- Een gebruiker moet al zijn/haar studysets kunnen bekijken
- Een gebruiker moet een studyset kunnen bekijken
- Een gebruiker moet een nieuwe studyset kunnen aanmaken
- Een gebruiker moet een bestaande studyset kunnen aanpassen
- Een gebruiker moet een studyset kunnen verwijderen

<br>

### 2.2 CALLS:

|**CALL**| **UITLEG**   |
|---|--------------|
| `GET /api/studysets`     | Alle studysets van een user opvragen                  |
| `GET /api/studysets/:id` | Specifieke studyset van een user opvragen             |
| `POST /api/studysets/:id` | Nieuwe studyset van een user aanmaken                 |
| `PATCH /api/studysets/:id` | Bestaande studyset van een user aanpassen             |
| `DELETE /api/studysets/:id` | Specifieke studyset van een user verwijderen          |

## 3. CLASSROOMS:

### 3.1 BESCHRIJVING:

- Er kan een classroom worden aangemaakt
- Er kan gezocht worden naar één specifieke classroom
- Er kan een overzicht getoond worden van alle studysets binnen de classroom
- Er kan een specifieke studyset worden opgevraagd binnen de classroom
- Er kan een overzicht getoond worden van alle users binnen de classroom
- Er kan gezocht worden naar één specifieke classroom user

<br>

### 3.2 CALLS:

| **CALL**                                | **UITLEG**                                 |
|-----------------------------------------|--------------------------------------------|
| `POST /api/classrooms/`               | een nieuwe classroom kan worden aangemaakt |
| `GET /api/classrooms/:id`               | specifieke classroom opvragen              |
| `GET /api/classrooms/:id/sets`          | alle classroomsets opvragen                |
| `GET /api/classrooms/:id/sets/:set_id`  | specifieke set opvragen                    |
| `GET /api/classrooms/:id/users`         | alle classroomusers opvragen               |
| `GET /api/classrooms/:id/users/:user_id` | Specifieke classroom user opvragen         |

## 4. STUDYSESSIONS:

### 4.1 BESCHRIJVING:

- Alle statistieken van de gebruiker opvragen voor de profielpagina
- Specifieke statistieken voor op de overzichtspagina van een set opvragen
<br>

### 4.2 CALLS:

| **CALL**                                   | **UITLEG**                              |
|--------------------------------------------|-----------------------------------------|
| `GET /api/users/:id/studysessions`         | alle studysession statistieken opvragen |
| `GET /api/users/:id/studysessions/:set_id` | specifieke statistieken opvragen        |
