const EntryCard = ({ entry }: { entry: any }) => {
  const creationDate = new Date(entry.createdAt).toDateString();
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">{creationDate}</div>
      <div className="px-4 py-5 sm:px-6">{entry.content}</div>
    </div>
  );
};
export default EntryCard;
