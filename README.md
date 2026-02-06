# KnowledgeShare

A platform where users share knowledge and get matched with experts who can help. Built for the **Personal Growth & Learning** track of the [Encode Club Comet Resolution V2 Hackathon](https://www.encodeclub.com/programmes/comet-resolution-v2-hackathon).

---

## Overview

KnowledgeShare connects learners who are stuck on a topic with experts who can guide them. Users create profiles, register for subjects (as learner or expert), report issues with context, and get matched via an LLM. Matched pairs can schedule meetings and chat in real time.

## Features

| Feature | Description |
|--------|-------------|
| **Profiles** | Bio, expertise, and interests |
| **Subjects** | Register as learner or expert per subject |
| **Issue reporting** | Describe your problem and what you’ve tried |
| **Expert matching** | AI ranks and matches experts (traced with [Opik](https://www.comet.com/docs/opik/)) |
| **Scheduling** | Book online or in-person meetings |
| **Chat** | Real-time messaging between learner and expert |

## Tech stack

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- **Prisma** + **SQLite**
- **NextAuth** (credentials, JWT)
- **OpenAI** (gpt-4o-mini) for expert matching
- **Opik** (TypeScript SDK + opik-openai) for LLM observability

## Getting started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/knowledgeshare.git
cd knowledgeshare
npm install
```

### 2. Environment variables

Copy the example env file and set required values:

```bash
cp .env.example .env
```

Edit `.env` and set at least:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_SECRET` | Yes | Session signing key. Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | App URL, e.g. `http://localhost:3000` |
| `DATABASE_URL` | Yes | SQLite default: `file:./dev.db` |
| `OPENAI_API_KEY` | Yes | [OpenAI API key](https://platform.openai.com/api-keys) for expert matching |
| `OPIK_API_KEY` | For tracing | [Opik Cloud](https://www.comet.com/api/my/settings/) — optional for local run |
| `OPIK_URL_OVERRIDE` | Optional | `https://www.comet.com/opik/api` for Opik Cloud |
| `OPIK_PROJECT_NAME` | Optional | Project name in Opik UI |
| `OPIK_WORKSPACE_NAME` | Optional | Opik workspace name |

### 3. Database setup

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with any email (no password; an account is created if needed).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed default subjects |
| `npm run db:studio` | Open Prisma Studio |

## Project structure

```
knowledgeshare/
├── prisma/
│   ├── schema.prisma    # Data model
│   └── seed.ts          # Default subjects
├── src/
│   ├── app/             # Next.js App Router (pages, API routes)
│   ├── components/      # React components
│   ├── lib/             # DB, auth, OpenAI/Opik client
│   └── types/           # TypeScript declarations
├── .env.example
├── LICENSE
└── README.md
```

## Hackathon alignment (Personal Growth & Learning)

- **Functionality** — Profile, subjects, issues, AI matching, chat, and scheduling are implemented end-to-end.
- **Real-world relevance** — Supports learners and experts in a structured, practical way.
- **Use of LLMs/Agents** — Expert matching uses an LLM to rank experts by fit; all calls are wrapped with Opik.
- **Evaluation & observability** — Opik integration: set `OPIK_API_KEY` to log traces to [Opik](https://www.comet.com/opik); see [Opik Encode Quickstart](https://colab.research.google.com/drive/14NRe_5sLXrXoqrOWXxrEz1qnY7mG_ul6).
- **Goal alignment** — Focuses on learning and growth through help and real-time interaction.

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add some feature'`.
4. Push: `git push origin feature/your-feature`.
5. Open a Pull Request.

## Pre-push checklist

- Run `npm install` (required for `opik` and `opik-openai`).
- Run `npm run build` and `npm run lint` — both must pass.
- Do not commit `.env` or `prisma/*.db` (they are in `.gitignore`).
- Set a strong `NEXTAUTH_SECRET` in production.

## License

[MIT](LICENSE)
# Knowledge_share_opik
