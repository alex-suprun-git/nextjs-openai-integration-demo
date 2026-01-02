# NextJS OpenAI Integration Monorepo (WIP)

> **Status**: 🏗️ Work in Progress

This is a Turborepo-based monorepo setup for building AI-enhanced mood analysis applications using modern web technologies.
This monorepo contains two Next.js applications — `platform` and `public` — and shared packages managed with [Turborepo](https://turbo.build/). The project integrates tools like OpenAI, Prisma, and Contentful to deliver a rich and interactive user experience.

## 📦 Apps & Packages Structure

```
apps/
  ├── platform/   # Authenticated, AI-enhanced journaling platform
  └── public/     # Public-facing PWA with content from Contentful

packages/
  ├── global-analytics/  # Analytics utilities
  ├── global-ui/         # Shared UI components
  ├── global-utils/      # Common utilities
  ├── eslint-config/     # Shared ESLint configurations
  └── typescript-config/ # Shared TypeScript configurations
```

## ✨ Features

- **AI-powered mood analysis** from journal entries using Vercel AI SDK with structured outputs
- **Semantic Q&A** over journal entries using LangChain's RAG capabilities
- Detailed mood statistics displayed in interactive charts
- Integration with Prisma for database management
- Integration with Contentful Headless CMS
- Progressive Web App (PWA) support
- Monorepo structure with shared UI components
- Error tracking and monitoring with Sentry
- Internationalization (i18n) support

## 🧰 Technologies

- **Next.js** (App Router, Turbopack)
- **Turborepo** — high-performance monorepo management
- **TypeScript** — strict typing
- **Tailwind CSS** — modern utility-first CSS
- **Prisma** — ORM and DB schema
- **Vercel AI SDK** — structured AI generation with type-safe outputs
- **LangChain** — RAG (Retrieval Augmented Generation) and vector embeddings
- **Contentful** — headless CMS
- **Next-PWA** — for offline-first capabilities
- **Vitest & Cypress** — unit and E2E testing
- **Sentry** — error tracking and monitoring
- **i18n** — internationalization

## 📦 Scripts (root)

```bash
yarn dev         # Run all dev servers
yarn build       # Build all apps/packages
yarn lint        # Lint all apps/packages
yarn test        # Run all tests
```

Each app has its own set of scripts inside `apps/platform` and `apps/public`.

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/nextjs-openai-integration-demo.git
cd nextjs-openai-integration-demo
yarn install
yarn dev
```

## 🧩 Contributing

- **Keep commits small and focused**: Prefer scoped changes (docs, refactors, fixes) to make reviews easy.
- **Run checks before pushing**:

```bash
yarn lint
yarn test
```

If you’re working on a single app, you can also run scripts from `apps/platform` or `apps/public`.

## 🤖 AI Architecture

This project uses a **hybrid AI approach**:

- **Vercel AI SDK** (`generateObject`) — For structured journal entry analysis with Zod schemas
  - Mood detection
  - Sentiment scoring
  - Summary generation
  - Color representation
- **LangChain** — For advanced RAG operations
  - Vector embeddings (OpenAIEmbeddings)
  - Semantic search over journal entries
  - Q&A refinement chains
  - In-memory vector store

This separation provides the best of both worlds: simple, type-safe structured generation with Vercel AI SDK, and powerful semantic search with LangChain.

## 📁 Environment Variables

Environment variables are managed via `.env` files and/or Vercel dashboard.
Refer to `turbo.json` for `globalEnv` configuration used during builds:

- Contentful CMS configuration
- OpenAI API key (`OPENAI_API_KEY`)
- Database connection
- Cron job secrets

## 🧑‍💻 Author

Alex Suprun  
Email: alex.suprun.email@gmail.com

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
