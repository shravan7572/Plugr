<div align="center">

# Plugr

**Drop complete, working features into your existing Express project.**

[![npm version](https://img.shields.io/npm/v/getplugr?color=black&style=flat-square)](https://www.npmjs.com/package/getplugr)
[![npm downloads](https://img.shields.io/npm/dm/getplugr?color=black&style=flat-square)](https://www.npmjs.com/package/getplugr)
[![license](https://img.shields.io/npm/l/getplugr?color=black&style=flat-square)](https://github.com/shravan/plugr/blob/main/LICENSE)

```bash
npx getplugr add auth
npx getplugr add email
```

</div>

---

## What is Plugr?

Plugr is a CLI tool that drops production-ready, fully working feature code into your existing Express project. Think of it as shadcn/ui — but for backend features.

No library to configure. No abstraction to fight. You get the actual code, dropped straight into your `src/` folder. Edit it, extend it, own it.

---

## Features

| Command | What it drops |
|---|---|
| `npx getplugr add auth` | Complete auth system — model, middleware, controller, routes |
| `npx getplugr add email` | Email service — Nodemailer or Brevo, ready to use |

---

## Quick Start

Navigate to your existing Express project and run:

```bash
npx getplugr add auth
```

Answer two questions:

```
? Choose language     › TypeScript / JavaScript
? Choose auth type    › JWT / Better Auth
```

Files are generated in your `src/` folder instantly.

---

## What Gets Added

### `auth` — JWT

```
src/
  models/
    user.model.ts
  middleware/
    auth.middleware.ts
  controllers/
    auth.controller.ts
  routes/
    auth.routes.ts
  config/
    jwt.ts
```

Then wire it up in your `index.ts`:

```ts
import authRoutes from "./routes/auth.routes.js"
app.use("/api/auth", authRoutes)
```

Install the required packages:

```bash
pnpm add bcrypt jsonwebtoken zod mongoose
pnpm add -D @types/bcrypt @types/jsonwebtoken @types/express
```

---

### `auth` — Better Auth

```
src/
  config/
    auth.ts
    db.ts
  middleware/
    auth.middleware.ts
```

Wire it up:

```ts
import { toNodeHandler } from "better-auth/node"
import { auth } from "./config/auth.js"

app.all("/api/auth/{*path}", toNodeHandler(auth))
```

Install:

```bash
pnpm add better-auth mongodb
```

---

### `email` — Nodemailer / Brevo

```
src/
  services/
    email.service.ts
  emailTemplates/
    welcome.ts
```

Use it anywhere:

```ts
import { sendEmail } from "./services/email.service.js"
await sendEmail({ to: "user@example.com", subject: "Welcome!", html: welcomeTemplate() })
```

---

## Requirements

- Node.js 18+
- An existing Express project with a `package.json`

---

## Author

Made by [Shravan Choudhary](https://github.com/shravan)