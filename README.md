# 🗺️ Orazca Spark

**Orazca Spark** is a personal web project and blog focused on the card game _Magic: The Gathering_, built with a modern full-stack setup.

The project features:

- 🧠 A backend API with Node.js, Express, and MongoDB
- 🌐 A frontend built in React
- 📝 Markdown-based posts and deck sharing
- 👍 Likes, comments, user authentication

---

## 📁 Project structure

```
orazca-spark/
├── backend/        # Express + MongoDB API
│   ├── app.js
│   ├── routes/
│   ├── models/
│   ├── docs/
│   └── ...
├── frontend/       # React client
│   ├── src/
│   └── ...
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Clone the project

```bash
git clone 
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
node app.js
# or with watch mode:
node --watch app.js
```

Test with:

```bash
curl http://localhost:5000/api
```

Run tests:

```bash
chmod +x test_orazca_api_01.sh
./test_orazca_api.sh
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Features

- User registration/login with JWT
- Create, edit, delete posts (with Markdown support and preview)
- Comment system with live editing/deletion
- Like/dislike logic (no duplicate voting)
- Deck building with Mainboard / Sideboard / Maybeboard
- API documentation in Markdown (multilingual)

---

## 📘 Documentation

API documentation is located in:

- `backend/docs/en/OrazcaSpark_API_EN.md`
- `backend/docs/es/OrazcaSpark_API_ES.md` _(optional)_

Accessible at the root endpoint:  
`GET /api` → shows README content in Markdown

---

## 🧙 About

Created with ❤️ by @mimuogi as a personal MTG project to learn, share and build community tools.

Future plans include:

- Deck search
- User profiles
- Deck tools
- Hypergeometric Calculator
- Mana base analysis
- Online store

---

## 📜 License

MIT License.
