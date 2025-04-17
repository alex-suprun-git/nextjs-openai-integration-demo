# NextJS OpenAI Integration Monorepo (WIP)

> **Status**: 🏗️ Work in Progress

This is a Turborepo-based monorepo setup for building AI-enhanced mood analysis applications using modern web technologies.
This monorepo contains two Next.js applications — `platform` and `public` — and shared packages managed with [Turborepo](https://turbo.build/). The project integrates tools like OpenAI, Clerk, Prisma, and Contentful to deliver a rich and interactive user experience.

https://github.com/user-attachments/assets/edafa667-9318-417d-b86d-11438f1aaf1c

## 📦 Apps & Packages Structure

```
apps/
  ├── platform/   # Authenticated, AI-enhanced journaling platform
  └── public/     # Public-facing PWA with content from Contentful

packages/
  └── ui/         # Shared UI components
```

## ✨ Features

- AI-powered mood analysis from journal entries
- Detailed mood statistics displayed in charts
- User authentication and management with Clerk
- Integration with Prisma for database management
- Integration with Contentful Headless CMS
- Progressive Web App (PWA) support
- Monorepo structure with shared UI components

## 🧰 Technologies

- **Next.js** (App Router, Turbopack)
- **Turborepo** — high-performance monorepo management
- **TypeScript** — strict typing
- **Tailwind CSS** — modern utility-first CSS
- **Clerk** — user authentication and management
- **Prisma** — ORM and DB schema
- **OpenAI / LangChain** — mood analysis via AI
- **Contentful** — headless CMS
- **Next-PWA** — for offline-first capabilities
- **Vitest & Cypress** — unit and E2E testing

## 📦 Scripts (root)

```bash
yarn dev         # Run all dev servers
yarn build       # Build all apps/packages
yarn lint        # Lint all apps/packages
```

Each app has its own set of scripts inside `apps/platform` and `apps/public`.

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/nextjs-openai-integration-demo.git
cd nextjs-openai-integration-demo
yarn install
yarn dev
```

## 📁 Environment Variables

Environment variables are managed via `.env` files and/or Vercel dashboard.
Refer to `turbo.json` for `globalEnv` configuration used during builds.

## 🧑‍💻 Author

Oleksii Suprun  
Email: oleksii.suprun.email@gmail.com

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
