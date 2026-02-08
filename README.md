# KnowledgeShare

> **Connect, Learn, and Grow.**
> A platform bridging the gap between learners and experts for real-time knowledge sharing.

![KnowledgeShare Banner](https://via.placeholder.com/1200x400?text=KnowledgeShare+Platform)

## 🚀 Overview

**KnowledgeShare** is a full-stack web application built to foster personal growth by connecting individuals stuck on specific topics with experts who can guide them. Whether you're mastering a new coding language, navigating career changes, or exploring a hobby, KnowledgeShare facilitates meaningful mentorship through AI-powered matching.

Built for the **Comet Resolution V2 Hackathon** (Personal Growth & Learning Track), this project leverages **OpenAI** for intelligent expert ranking and **Opik** for deep observability into AI interactions.

---

## ✨ Key Features

- **👥 Dual Roles:** Seamlessly switch between being a **Learner** (seeking help) and an **Expert** (offering mentorship) on a per-subject basis.
- **🤖 AI-Powered Matching:** Intelligent ranking system powered by **GPT-4o-mini** that analyzes issue descriptions to find the most relevant experts.
- **📊 Observability with Opik:** Full transparency into the matching logic with **Opik** traces, ensuring high-quality AI performance.
- **💬 Real-Time Chat:** integrated messaging system for instant communication between matched pairs.
- **📅 Scheduling:** Easy booking system for online or in-person mentorship sessions.
- **🔒 Secure Authentication:** Robust user management via **NextAuth.js**.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **AI & LLMs:** [OpenAI API](https://openai.com/) (GPT-4o-mini)
- **Observability:** [Opik](https://www.comet.com/opik) (Tracing & Evaluation)

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** 18+
- **npm** (or yarn/pnpm)

### 1. Clone the Repository

```bash
git clone https://github.com/AJTECH001/knowledgeshare.git
cd knowledgeshare
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory and add the following variables:

```bash
cp .env.example .env
```

**Required Variables:**

| Variable | Description |
| :--- | :--- |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` for local development |
| `DATABASE_URL` | Connection string (default: `file:./dev.db`) |
| `OPENAI_API_KEY` | Your OpenAI API Key for matching logic |
| `OPIK_API_KEY` | Your Opik API Key for observability |

### 3. Setup Database

Initialize the database and seed it with default subjects:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app in action!

---

## 🧪 Testing & Observability

To see **Opik** in action:
1. Ensure `OPIK_API_KEY` is set in your `.env`.
2. Post an issue and trigger the "Find Experts" action.
3. Check your [Opik Project Dashboard](https://www.comet.com/opik) to view traces of the matching process.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Jamiu Damilola Alade for Encode Club Hackathon
</p>
