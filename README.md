#  DevHub LMS — Освітня платформа

> Fullstack веб-додаток: Learning Management System / Кабінет розробника.
> Практична демонстрація **21 інженерної теми**.

##  Архітектура

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   React 18   │────▶│  Express.js  │────▶│  Deno Service    │
│  TypeScript  │     │   (MVC API)  │     │  (Certificates)  │
│  Router v6   │     │  Socket.io   │     │  Port: 8000      │
│  Port: 3000  │     │  Port: 5000  │     └──────────────────┘
└──────────────┘     │      │       │
                     │  ┌───┴───┐   │
                     │  │       │   │
                     └──┤  DBs  ├───┘
                        │       │
                   ┌────┴──┐ ┌──┴────┐
                   │Postgres│ │MongoDB│
                   │ :5432  │ │:27017 │
                   └────────┘ └───────┘
```

##  Швидкий старт

### Docker Compose (рекомендовано)
```bash
docker-compose up --build
```

### Локальна розробка (без Docker)
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev

# Deno Service
cd deno-service && deno run --allow-net --allow-env --allow-read main.ts

# Seed data
cd backend && npm run seed
```

## 📋 Покриття 21 інженерної теми

| # | Тема | Реалізація |
|---|------|------------|
| 1 | Class Components | `/archive` — LectureCard з lifecycle-методами |
| 2 | Анімації | Framer Motion переходи та hover-ефекти карток |
| 3 | ES6+ | Async/await, destructuring, optional chaining всюди |
| 4 | Router v5 vs v6 | `/router-guide` — інтерактивне порівняння |
| 5 | Redux → Hooks | CartContext + useReducer |
| 6 | Тести | Jest unit, snapshot, Cypress E2E |
| 7 | Error Handling | ErrorBoundary + Express error middleware |
| 8 | Deno | Мікросервіс генерації сертифікатів |
| 9 | React State | QuizPage — інтерактивний тест |
| 10 | Custom Hooks | useAuth, useFetch |
| 11 | Node.js | HTTP server, fs, crypto |
| 12 | Express.js | REST API з CORS, helmet, morgan |
| 13 | Шаблонізатори | EJS email-шаблони (`/admin/email-preview`) |
| 14 | MVC Pattern | models/ controllers/ routes/ views/ |
| 15 | Оптимізація | React.memo, useMemo, lazy loading |
| 16 | SQL + Sequelize | PostgreSQL — Users, Orders, Transactions |
| 17 | NoSQL + Mongoose | MongoDB — Courses, ActivityLogs, ChatMessages |
| 18 | JWT Auth | bcrypt + jsonwebtoken + express-validator |
| 19 | Пагінація | Server-side skip/limit у каталозі |
| 20 | Stripe | Імітація checkout session та callback |
| 21 | Socket.io | Real-time чат підтримки (`/support`) |

##  Структура проєкту

```
reactproj/
├── docker-compose.yml
├── backend/          # Express.js API (MVC)
├── frontend/         # React + Vite + TypeScript
└── deno-service/     # Deno certificate microservice
```

##  Тестування

```bash
# Unit тести (reducer)
cd frontend && npm test

# E2E тести
cd frontend && npx cypress run

# Backend тести
cd backend && npm test
```
