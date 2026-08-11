<div align="center">

<br />

# Plugr

### shadcn/ui for Express backend features.

Drop complete, production-ready features into any existing Express project — with a single command.

<br />

[![npm](https://img.shields.io/npm/v/getplugr?color=black&style=flat-square)](https://www.npmjs.com/package/getplugr)
[![npm downloads](https://img.shields.io/npm/dm/getplugr?color=black&style=flat-square)](https://www.npmjs.com/package/getplugr)
[![GitHub stars](https://img.shields.io/github/stars/shravan/plugr?color=black&style=flat-square)](https://github.com/shravan/plugr)
[![license](https://img.shields.io/github/license/shravan/plugr?color=black&style=flat-square)](./LICENSE)

<br />

```bash
npx getplugr add auth
npx getplugr add email
```

<br />

</div>

---

## The Problem

Every Express project needs the same things — authentication, email, file uploads. Every time you start fresh you either copy from an old project, follow a tutorial, or build from scratch.

Plugr solves this. One command drops a complete, working feature directly into your existing project. You own the code — no library lock-in, no hidden abstractions.

---

## Available Features

### `plugr add auth`

Drops a complete authentication system into your `src/` folder.

**Supports:**
- TypeScript or JavaScript
- JWT or Better Auth
- MongoDB

**Files added (JWT):**
```
src/
  models/user.model.ts
  middleware/auth.middleware.ts
  controllers/auth.controller.ts
  routes/auth.routes.ts
  config/jwt.ts
```

**Files added (Better Auth):**
```
src/
  config/auth.ts
  config/db.ts
  middleware/auth.middleware.ts
```

---

### `plugr add email`

Drops a complete email service into your `src/` folder.

**Supports:**
- TypeScript or JavaScript
- Nodemailer or Brevo

**Files added:**
```
src/
  services/email.service.ts
  emailTemplates/welcome.ts
```

---

## Getting Started

Navigate to your existing Express project:

```bash
npx getplugr add auth
```

Answer the prompts, get the files, install the suggested packages, wire up the route. Done in under a minute.

---

## Project Structure

```
plugr/
  cli/        → npm package published as getplugr
  web/        → website (coming soon)
```

---

## Local Development

```bash
git clone https://github.com/shrava7572/plugr
cd plugr/cli
npm install
npm run build

# test locally inside any express project
node /path/to/plugr/cli/dist/index.js add auth
```

---

## Roadmap

- [x] `plugr add auth` — JWT + Better Auth
- [x] `plugr add email` — Nodemailer + Brevo
- [ ] `plugr add upload` — Cloudinary / local storage
- [ ] `plugr add ratelimit` — rate limiting middleware
- [ ] `plugr add payments` — Stripe integration
- [ ] Website — browse templates visually
- [ ] Community templates — share your own stack

---

## Contributing

Contributions are welcome. To add a new feature template:

1. Fork the repo
2. Create your template files under `cli/templates/<feature>/`
3. Add the prompt and generator in `cli/src/features/<feature>/`
4. Open a pull request

---

## License

MIT — use it however you want.

---

<div align="center">

Made by [Shravan Choudhary](https://github.com/shravan7572) — [npm](https://www.npmjs.com/package/getplugr) · [LinkedIn](https://linkedin.com/in/shravan)

</div>