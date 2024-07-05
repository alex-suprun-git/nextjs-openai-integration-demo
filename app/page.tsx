import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

const Home = async () => {
  const { userId } = await auth();

  let href = userId ? '/journal' : '/new-user';

  return (
    <div className="bg-slate-550 flex min-h-svh items-center justify-center p-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-5xl font-black leading-relaxed sm:text-6xl sm:leading-[1.25]">
          AI-Powered Mood Analysis
        </h1>
        <p className="mb-8 text-xl leading-relaxed text-white/60 sm:text-2xl sm:leading-[1.65]">
          This demo application, built with NextJS, TypeScript, Tailwind, Clerk, Prisma, and OpenAI,
          allows users to analyze their mood based on journal entries. The AI interprets users’
          thoughts and generates mood statistics, displayed in detailed charts.
        </p>
        <div>
          <Link href={href}>
            <button className="rounded-lg bg-blue-600 px-4 py-4 text-xl">Get started</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Home;
