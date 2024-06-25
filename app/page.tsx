import { FC } from 'react';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

const Home: FC = async () => {
  const { userId } = await auth();

  let href = userId ? '/journal' : '/new-user';

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl mb-6">
          NextJS | TypeScript | Tailwind | Prisma | OpenAI integration demo
        </h1>
        <p className="text-2xl mb-8 leading-normal text-white/60">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium incidunt sed earum et
          dolorum temporibus quod, fugit consequuntur similique, quo, expedita nobis. Dolore,
          inventore? Quos fugit aspernatur dolor accusamus ratione.
        </p>
        <div>
          <Link href={href}>
            <button className="bg-blue-600 px-4 py-4 rounded-lg text-xl">Get started</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Home;
