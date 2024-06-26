const createUrl = (path: string) => window.location.origin + path;

export const createNewEntry = async () => {
  const url = createUrl('/api/journal');

  const res = await fetch(
    new Request(url, {
      method: 'POST',
    }),
  );

  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
};

export const updateEntry = async (id: string, content: any) => {
  const url = createUrl(`/api/journal/${id}`);

  const rest = await fetch(
    new Request(url, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    }),
  );

  if (rest.ok) {
    const data = await rest.json();
    return data.data;
  }
};
