import Editor from '@/components/Editor';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { FC } from 'react';

const getEntry = async (id: string) => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
  });
  return entry;
};

const EntryPage: FC<{ params: { id: string } }> = async ({ params }) => {
  const entry = await getEntry(params.id);
  const analysisData = [
    { name: 'Summary', value: '' },
    { name: 'Subject', value: '' },
    { name: 'Mood', value: '' },
    { name: 'Negative', value: false },
  ];

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        <Editor entry={entry} />
      </div>
      <div className="border-l border-black/10">
        <div className="bg-blue-300 px-6 py-10">
          <h2 className="text-2xl font-bold">Analysis</h2>
        </div>
        <ul>
          {analysisData.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between py-3 px-3 border-b-2 border-black/10"
            >
              <h3 className="font-semibold">{item.name}</h3>
              <span>{item.value.toString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default EntryPage;
