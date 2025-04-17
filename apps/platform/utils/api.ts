export const createUrl = (path: string) => window.location.origin + path;

export const updateUserPromptUsage = async (promptContentLength: number) => {
  const url = createUrl('/api/user');

  const rest = await fetch(
    new Request(url, {
      method: 'PATCH',
      body: JSON.stringify({ promptContentLength }),
    }),
  );

  if (rest.ok) {
    const data = await rest.json();
    return data.data;
  }
};

export const createNewEntry = async (content: string) => {
  const url = createUrl('/api/journal');

  const res = await fetch(
    new Request(url, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  );

  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
};

export const updateEntry = async (id: string, content: string) => {
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

export const deleteEntry = async (id: string) => {
  const url = createUrl(`/api/journal/${id}`);

  const res = await fetch(
    new Request(url, {
      method: 'DELETE',
    }),
  );

  if (res.ok) {
    return;
  }
};

export const askQuestion = async (question: string) => {
  const url = createUrl('/api/question');

  const res = await fetch(
    new Request(url, {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
  );

  if (res.ok) {
    const data = await res.json();
    return data;
  }
};
