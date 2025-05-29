# 📘 Orazca Spark API – Quick Reference

---

## 🔐 Authentication

| Method | Endpoint               | Description                          | Requires Token |
|--------|------------------------|--------------------------------------|----------------|
| POST   | `/api/users/register`  | Register a new user                  | ❌             |
| POST   | `/api/users/login`     | Log in (returns JWT token)           | ❌             |
| DELETE | `/api/users/me`        | Delete account and all user content | ✅             |

---

## 👤 Users

| Method | Endpoint              | Description                      | Requires Token |
|--------|-----------------------|----------------------------------|----------------|
| GET    | `/api/users/:id`      | Get user profile info            | ✅ (optional)  |
| PUT    | `/api/users/me`       | Update own profile               | ✅             |

---

## 🃏 Decks

| Method | Endpoint             | Description                 | Requires Token |
|--------|----------------------|-----------------------------|----------------|
| POST   | `/api/decks`         | Create a new deck           | ✅             |
| GET    | `/api/decks`         | List all decks              | ❌             |
| GET    | `/api/decks/:id`     | Get deck by ID              | ❌             |
| PUT    | `/api/decks/:id`     | Update own deck             | ✅             |
| DELETE | `/api/decks/:id`     | Delete own deck             | ✅             |

---

## 📝 Posts

| Method | Endpoint              | Description                   | Requires Token |
|--------|-----------------------|-------------------------------|----------------|
| POST   | `/api/posts`          | Create a new post             | ✅             |
| GET    | `/api/posts`          | List all posts                | ❌             |
| GET    | `/api/posts/:id`      | Get post by ID                | ❌             |
| PUT    | `/api/posts/:id`      | Update own post               | ✅             |
| DELETE | `/api/posts/:id`      | Delete own post               | ✅             |

---

## 💬 Comments

| Method | Endpoint                                     | Description                  | Requires Token |
|--------|----------------------------------------------|------------------------------|----------------|
| POST   | `/api/posts/:postId/comments`                | Comment on a post            | ✅             |
| PUT    | `/api/posts/:postId/comments/:commentId`     | Edit own comment             | ✅             |
| DELETE | `/api/posts/:postId/comments/:commentId`     | Delete own comment           | ✅             |

---

## 👍 Reactions

| Method | Endpoint                     | Description     | Requires Token |
|--------|------------------------------|-----------------|----------------|
| POST   | `/api/posts/:postId/like`    | Like a post     | ✅             |
| POST   | `/api/posts/:postId/dislike` | Dislike a post  | ✅             |

---

## 🧩 Data Formats

### 🧑 User

```json
{
  "username": "tester",
  "email": "tester@example.com",
  "password": "test123"
}
```

---

### 🃏 Deck

```json
{
  "title": "Ixalan Dinosaurs",
  "description": "Red-green tribal ramp deck",
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
  "title": "Deck Ideas",
  "slug": "deck-ideas",
  "contentMarkdown": "## Introduction",
  "tags": ["decks", "ideas"]
}
```

---

### 💬 Comment

```json
{
  "text": "Great deck, I like it!"
}
```

---

## ✅ Common Responses

| Action               | Code | Response (example)                              |
|----------------------|------|-------------------------------------------------|
| Successful register  | 201  | `{ "message": "User created successfully" }`   |
| Successful login     | 200  | `{ "token": "...", "username": "..." }`        |
| Like/Dislike         | 200  | `{ "_id": "...", "likes": 3, ... }`            |
| Post deleted         | 200  | `{ "message": "Post deleted" }`                |
| Invalid comment      | 400  | `{ "error": "Empty comment" }`                 |
| Unauthorized         | 401  | `{ "error": "Invalid token" }`                 |
| Not found            | 404  | `{ "error": "Post not found" }`                |