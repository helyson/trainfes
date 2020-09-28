# trainfes

> Software multitenant para telemedicina.
> Mongo(Docker), express, jsonwebtoken, NodeJs

## Content

1.  [Ambiente](#run-project)
2.  [Usuarios del sistema](#login)
3.  [Endpoints](#endpoints)
    - [Login de usuarios](#endpoint-login)
    - [Registros de usuarios](#endpoint-register)
    - [Organizacion](#endpoint-organization)
    - [Sesion](#endpoint-session)
    - [Planificacion](#endpoint-planning)

<a name="run-project"></a>

## Ambiente - Run Project

---> opcional <----

**Inicializar mongo con docker**

> command \$ > docker compose -d

Para verificar que el contenedor esta corriendo

> command \$ > docker ps

Una vez que el contenedor este corriendo

----> requerido <----

**crear semilla:**

> command \$ > npm run seed

Esto crea una bdd llamada **_trainFESDb_** que contiene un superadmin, un organización, un admin de organización, 2 pacientes, 4 sesiones de entrenamiento y que cada paciente cuente con al menos 2 planificaciones

**Correr proyecto:**

> command \$ > npm install

> command \$ > npm start

<a name="login"></a>

## Usuarios del sistema

Se indican los usuarios contenido en la semilla

```json

superAdmin:
{
    "rut": "7272601-4",
    "password": "root"
}

adminOrganization:
{
    "rut": "21389733-0",
    "password": "admin"
}

users:
[
    {
        "rut": "11677143-8",
        "password": "user1"
    },
    {
        "rut": "5996755-k",
        "password": "user2"
    }
]

```

<a name="endpoints"></a>

## API endpoints / examples

El puerto en donde corre el servicio es el 5000 `http://localhost:5000/api/v1/trainfes/...`

<a name="endpoint-login"></a>

## Login de usuarios

> historia de usuario **_1.- Como usuario quiero poder loguearme a la plataforma_**

#### **POST** `/api/v1/trainfes/login`.

_Inicia sesión de usuario_

el username corresponde al rut

```javascript
/* Body */
{ username: "7272601-4", password: "root"}

/* Response */
{
    "user": {
        "_id": "5f7213dde6655d0f2fe59fc6",
        "rut": "7272601-4",
        "name": "TrainFES",
        "phone": "361515665",
        "email": "trainfes@trainfes.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjcyMTNkZGU2NjU1ZDBmMmZlNTlmYzYiLCJyb2xlIjoicm9vdCIsImlhdCI6MTYwMTMxMTc2NH0.4y0DpirjOTs15Re3o2Q_1FetKPbKbkWdi9O9YSCj-KQ"
}
```

el token es requerido en el header _Authorization_ para el acceso a otros endpoints

<a name="endpoint-resgister"></a>

## Registro de usuarios

> Crear superadmin de plataforma multitenant

**_Requerimiente header Authorization, de usuario root_**

**example:**

```json
"Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjcyMTNkZGU2NjU1ZDBmMmZlNTlmYzYiLCJyb2xlIjoicm9vdCIsImlhdCI6MTYwMTMxMTc2NH0.4y0DpirjOTs15Re3o2Q_1FetKPbKbkWdi9O9YSCj-KQ"
```

**Validacion de atributo rut: Debe ser unico, es requerido, y debe ser valido**

#### **POST** `/api/v1/trainfes/register/root`.

```javascript
/* Body */
{
    "name": "rootExample",
    "email": "rootExample@gmail.com",
    "password" :"root",
    "rut":"8413279-9",
    "phone":"956565626"
}

/* Response */
{
    "user": {
        "name": "rootExample",
        "email": "rootExample@gmail.com",
        "role": "root",
        "rut": "8413279-9",
        "phone": "956565626"
    }
}
```

> Crear admin de organización

**_Requerimiente header Authorization, de usuario root_**

**example:**

```json
"Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjcyMTNkZGU2NjU1ZDBmMmZlNTlmYzYiLCJyb2xlIjoicm9vdCIsImlhdCI6MTYwMTMxMTc2NH0.4y0DpirjOTs15Re3o2Q_1FetKPbKbkWdi9O9YSCj-KQ"
```

#### **POST** `/api/v1/trainfes/register/admin/:id`

:id corresponde al id de organizacion (example: /api/v1/trainfes/register/admin/5f721f51a95c42125c376338)

```javascript
/* Body */
{
    "name": "adminExample",
    "email": "adminExample@gmail.com",
    "password" :"root",
    "rut":"8428587-0",
    "phone":"956565626"
}

/* Response */
{
   {
    "user": {
        "name": "adminExample ",
        "email": "adminExample@gmail.com",
        "role": "admin",
        "organization": "5f721f51a95c42125c376338",
        "rut": "8428587-0",
        "phone": "956565626"
    }
}
}
```

> Crear usuarios tipo paciente

> historia de usuario: 3.- Como usuario organización quiero crear usuarios tipo pacientes

**_Requerimiente header Authorization, de usuario admin de organizacion_**

**example:**

```json
"Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjcyMTNkZGU2NjU1ZDBmMmZlNTlmYzkiLCJvcmdhbml6YXRpb25JZCI6IjVmNzIxM2RkZTY2NTVkMGYyZmU1OWZjOCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYwMTMxMjA2Nn0.nZDsXMihAWuPeWJZdnq-w56ZBW3WrStl90jXro6MESk"
```

#### **POST** `/api/v1/trainfes/register/user`

```javascript
/* Body */
{
    "name": "userExample",
    "password" :"userpass",
    "rut":"5685517-3",
    "lastname": "apellido",
    "phone": "+56200000000",
    "email": "userExample@organizacion.com",
    "country": "chile",
    "city": "santiago",
    "region": "centro",
    "gender": "m",
    "birthday": "Mon Jan 01 1990 00:00:00 GMT-0300",
    "insurance": "banmedica"
}

/* Response */
{
    "user": {
        "name": "userExample apellido",
        "email": "userExample@organizacion.com",
        "organization": "5f7213dde6655d0f2fe59fc8",
        "rut": "5685517-3",
        "role": "user",
        "phone": "+56200000000",
        "birthday": "1990-01-01T03:00:00.000Z",
        "insurance": "banmedica",
        "gender": "m",
        "city": "santiago",
        "region": "centro"
    }
}
```

<a name="endpoint-organization"></a>

## Organizacion

> Crear organizaciones (Tenant)

> historia de usuario: 2. Como usuario superadmin TrainFES quiero crear organizaciones

**_Requerimiente header Authorization, de usuario root_**

**example:**

```json
"Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjcyMTNkZGU2NjU1ZDBmMmZlNTlmYzYiLCJyb2xlIjoicm9vdCIsImlhdCI6MTYwMTMxMTc2NH0.4y0DpirjOTs15Re3o2Q_1FetKPbKbkWdi9O9YSCj-KQ"
```

#### **POST** `/api/v1/trainfes/organization`.

```javascript
/* Body */
{
  "name": "Organizacion 2",
  "plan": "basic",
  "address": "Metropolitana santiago de chile",
  "phone": "+56955555555",
  "rut": "12345678-k"
}


/* Response */
{
    "organization": {
        "id": "5f721f51a95c42125c376338",
        "name": "Organizacion 2",
        "plan": "basic",
        "address": "Metropolitana santiago de chile",
        "phone": "+56955555555",
        "rut": "12345678-k"
    }
}
```

<a name="endpoint-session"></a>

## Sesion

> Crear una sesión de entrenamiento

> historia de usuario: 4.Como usuario organización quiero crear sesiones de entrenamiento

**_Requerimiente header Authorization, de usuario admin de organizacion_**

**example:**

```json
"Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjcyMTNkZGU2NjU1ZDBmMmZlNTlmYzkiLCJvcmdhbml6YXRpb25JZCI6IjVmNzIxM2RkZTY2NTVkMGYyZmU1OWZjOCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYwMTMxMjA2Nn0.nZDsXMihAWuPeWJZdnq-w56ZBW3WrStl90jXro6MESk"
```

**validacion de atributo parameters debe contener por lo menos repeat y series**

#### **POST** `/api/v1/trainfes/session`.

```javascript
/* Body */
{
    "name": "sesión de entrenamiento ejemplo",
    "description": "descripción de sesión ejemplo",
    "objective": "objetivo de sesión ejemplo",
    "type": "sensor",
    "parameters": {
        "series": 10,
        "repeat": 5,
        "contraction_time": 25,
        "rest_time": 30
    }
}


/* Response */
{
    "session": {
        "id": "5f7229166cf0db14148cc358",
        "name": "sesión de entrenamiento ejemplo",
        "description": "descripción de sesión ejemplo",
        "objective": "objetivo de sesión ejemplo",
        "type": "sensor",
        "parameters": {
            "series": 10,
            "repeat": 5,
            "contraction_time": 25,
            "rest_time": 30
        }
    }
}
```

<a name="endpoint-planning"></a>

## Planificación

> Crear una planificación para un paciente.

> historia de usuario: 6. Como usuario organización quiero crear planificaciones y asignarlas a pacientes mediante rut

**_Requerimiente header Authorization, de usuario admin organizacion_**

**example:**

```json
"Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjcyMTNkZGU2NjU1ZDBmMmZlNTlmYzkiLCJvcmdhbml6YXRpb25JZCI6IjVmNzIxM2RkZTY2NTVkMGYyZmU1OWZjOCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYwMTMxMjA2Nn0.nZDsXMihAWuPeWJZdnq-w56ZBW3WrStl90jXro6MESk"
```

#### **POST** `/api/v1/trainfes/planning?rut=11677143-8`.

```javascript
/* Body */
{
    "name": "planificacion sesiones de entrenamento de ejemplo user 1",
    "links": ["https://www.google.com", "https://docs.mongodb.com/"],
    "planningDate": "2020-10-01T03:00:00.000Z",
    "sessions": ["5f7229166cf0db14148cc358"]
}


/* Response */
{
    "planning": {
        "links": [
            "https://www.google.com",
            "https://docs.mongodb.com/"
        ],
        "sessions": [
            "5f7229166cf0db14148cc358"
        ],
        "tenantId": "Planning-5f72329a09d08c1bb11efcf2",
        "name":  "planificacion sesiones de entrenamento de ejemplo user 1",
        "planningDate": "2020-10-01T03:00:00.000Z"
    }
}
```

> historia de usuario: 7.- Como usuario paciente quiero ver todas mis planificaciones

**_Requerimiente header Authorization, de usuario paciente_**

**example:**

```json
"Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjcyMzI5YjA5ZDA4YzFiYjExZWZjZmIiLCJvcmdhbml6YXRpb25JZCI6IjVmNzIzMjlhMDlkMDhjMWJiMTFlZmNmMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjAxMzE5NzgzfQ.qCztLNRnMgmSWttZFeiHj-a6T9wfivEpq_xGMowe0To"
```

#### **Get** `/api/v1/trainfes/planning`

```javascript

/* Response */
{
    "plannings": [
        {
            "links": [
                "https://www.google.com",
                "https://docs.mongodb.com/"
            ],
            "sessions": [
                {
                    "tenantId": "Session-5f72329a09d08c1bb11efcf2",
                    "name": "sesión de entrenamiento 1",
                    "description": "descripción de sesión 1",
                    "objective": "objetivo de sesión 1",
                    "parameters": {
                        "series": 10,
                        "repeat": 5
                    }
                },
                {
                    "tenantId": "Session-5f72329a09d08c1bb11efcf2",
                    "name": "sesión de entrenamiento 2",
                    "description": "descripción de sesión 2",
                    "objective": "objetivo de sesión 2",
                    "parameters": {
                        "series": 10,
                        "repeat": 5,
                        "contraction_time": 25,
                        "rest_time": 30
                    }
                }
            ],
            "tenantId": "Planning-5f72329a09d08c1bb11efcf2",
            "name": "planificacion sesiones de entrenamento 1 y 2 user 1",
            "planningDate": "2020-10-02T03:00:00.000Z"
        },
        {
            "links": [
                "https://www.google.com",
                "https://docs.mongodb.com/"
            ],
            "sessions": [
                {
                    "tenantId": "Session-5f72329a09d08c1bb11efcf2",
                    "name": "sesión de entrenamiento 3",
                    "description": "descripción de sesión 3",
                    "objective": "objetivo de sesión 3",
                    "parameters": {
                        "series": 3,
                        "repeat": 8
                    }
                },
                {
                    "tenantId": "Session-5f72329a09d08c1bb11efcf2",
                    "name": "sesión de entrenamiento 4",
                    "description": "descripción de sesión 4",
                    "objective": "objetivo de sesión 4",
                    "parameters": {
                        "series": 5,
                        "repeat": 9
                    }
                }
            ],
            "tenantId": "Planning-5f72329a09d08c1bb11efcf2",
            "name": "planificacion sesiones de entrenamento 3 y 4 user 1",
            "planningDate": "2020-10-03T03:00:00.000Z"
        },
    ]
}
```


> historia de usuario: 8.- Como usuario paciente quiero ver mis ejercicios para cualquier día

**_Requerimiente header Authorization, de usuario paciente_**

**example:**

```json
"Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjcyMzI5YjA5ZDA4YzFiYjExZWZjZmIiLCJvcmdhbml6YXRpb25JZCI6IjVmNzIzMjlhMDlkMDhjMWJiMTFlZmNmMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjAxMzE5NzgzfQ.qCztLNRnMgmSWttZFeiHj-a6T9wfivEpq_xGMowe0To"
```

#### **Get** `/api/v1/trainfes/planning/sessions?date="2020-10-02"`

```javascript

/* Response */
{
    "exercises": [
        {
            "planificationName": "planificacion sesiones de entrenamento 1 y 2 user 1",
            "date": "2020-10-02T03:00:00.000Z",
            "sessions": [
                {
                    "tenantId": "Session-5f72329a09d08c1bb11efcf2",
                    "name": "sesión de entrenamiento 1",
                    "description": "descripción de sesión 1",
                    "objective": "objetivo de sesión 1",
                    "parameters": {
                        "series": 10,
                        "repeat": 5
                    }
                },
                {
                    "tenantId": "Session-5f72329a09d08c1bb11efcf2",
                    "name": "sesión de entrenamiento 2",
                    "description": "descripción de sesión 2",
                    "objective": "objetivo de sesión 2",
                    "parameters": {
                        "series": 10,
                        "repeat": 5,
                        "contraction_time": 25,
                        "rest_time": 30
                    }
                }
            ]
        }
    ]
}
```

@hely.son :D!!