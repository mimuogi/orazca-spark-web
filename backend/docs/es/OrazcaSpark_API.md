# 📘 Orazca Spark API – Referencia Rápida

---

## 🔐 Autenticación

| Método | Endpoint               | Descripción                        | Requiere Token |
|--------|------------------------|------------------------------------|----------------|
| POST   | `/api/users/register`  | Registrar nuevo usuario            | ❌             |
| POST   | `/api/users/login`     | Iniciar sesión (devuelve JWT)     | ❌             |
| DELETE | `/api/users/me`        | Eliminar cuenta y datos asociados | ✅             |

---

## 👤 Usuarios

| Método | Endpoint              | Descripción                       | Requiere Token |
|--------|-----------------------|-----------------------------------|----------------|
| GET    | `/api/users/:id`      | Obtener info de un usuario        | ✅ (opcional)  |
| PUT    | `/api/users/me`       | Editar usuario autenticado        | ✅             |

---

## 🃏 Mazos

| Método | Endpoint             | Descripción                  | Requiere Token |
|--------|----------------------|------------------------------|----------------|
| POST   | `/api/decks`         | Crear nuevo mazo             | ✅             |
| GET    | `/api/decks`         | Listar todos los mazos       | ❌             |
| GET    | `/api/decks/:id`     | Obtener un mazo por ID       | ❌             |
| PUT    | `/api/decks/:id`     | Editar mazo propio           | ✅             |
| DELETE | `/api/decks/:id`     | Eliminar mazo propio         | ✅             |

---

## 📝 Posts

| Método | Endpoint              | Descripción                   | Requiere Token |
|--------|-----------------------|-------------------------------|----------------|
| POST   | `/api/posts`          | Crear nuevo post              | ✅             |
| GET    | `/api/posts`          | Listar todos los posts        | ❌             |
| GET    | `/api/posts/:id`      | Ver post por ID               | ❌             |
| PUT    | `/api/posts/:id`      | Editar post propio            | ✅             |
| DELETE | `/api/posts/:id`      | Eliminar post propio          | ✅             |

---

## 💬 Comentarios

| Método | Endpoint                                     | Descripción                  | Requiere Token |
|--------|----------------------------------------------|------------------------------|----------------|
| POST   | `/api/posts/:postId/comments`                | Comentar en un post          | ✅             |
| PUT    | `/api/posts/:postId/comments/:commentId`     | Editar comentario propio     | ✅             |
| DELETE | `/api/posts/:postId/comments/:commentId`     | Eliminar comentario propio   | ✅             |

---

## 👍 Reacciones

| Método | Endpoint                     | Descripción     | Requiere Token |
|--------|------------------------------|-----------------|----------------|
| POST   | `/api/posts/:postId/like`    | Dar like        | ✅             |
| POST   | `/api/posts/:postId/dislike` | Dar dislike     | ✅             |

---

## 🧩 Formatos de datos

### 🧑 Usuario

```json
{
  "username": "tester",
  "email": "tester@example.com",
  "password": "test123"
}
```

---

### 🃏 Mazo

```json
{
  "title": "Dinosaurios de Ixalan",
  "description": "Tribal verde-rojo",
  "format": "Commander",
  "mainboard": [{ "name": "Ghalta", "quantity": 1 }],
  "sideboard": [],
  "maybeboard": []
}
```

---

### 📝 Post

```json
{
  "title": "Ideas para mazos",
  "slug": "ideas-mazos",
  "contentMarkdown": "## Introducción",
  "tags": ["mazos", "ideas"]
}
```

---

### 💬 Comentario

```json
{
  "text": "Muy buen mazo, me gusta!"
}
```

---

## ✅ Respuestas típicas

| Acción              | Código | Respuesta (ejemplo)                       |
|---------------------|--------|-------------------------------------------|
| Registro correcto   | 201    | `{ "message": "Usuario creado correctamente" }` |
| Login correcto      | 200    | `{ "token": "...", "username": "..." }`   |
| Like/Dislike        | 200    | `{ "_id": "...", "likes": 3, ... }`       |
| Post eliminado      | 200    | `{ "message": "Post eliminado" }`         |
| Comentario inválido | 400    | `{ "error": "Comentario vacío" }`         |
| No autorizado       | 401    | `{ "error": "Token inválido" }`           |
| No encontrado       | 404    | `{ "error": "Post no encontrado" }`       |