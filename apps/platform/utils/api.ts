export const createUrl = (path: string) => window.location.origin + path;

export const updateUserPromptUsage = async (promptContentLength: number) => {
  const res = await fetch(
    new Request('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptContentLength }),
    }),
  );

  if (!res.ok) {
    return new Error(res.statusText);
  }

  const data = await res.json();
  return data.data;
};

export const createNewEntry = async (content: string) => {
  const res = await fetch(
    new Request('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }),
  );

  if (!res.ok) {
    return new Error(res.statusText);
  }

  const data = await res.json();
  return data.data;
};

// @Deprecated
export const updateEntry = async (id: string, content: string) => {
  const res = await fetch(
    new Request(`/api/journal/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }),
  );

  if (!res.ok) {
    return new Error(res.statusText);
  }

  const data = await res.json();
  return data.data;
};

export const deleteEntry = async (id: string) => {
  const res = await fetch(
    new Request(`/api/journal/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  if (!res.ok) {
    return new Error(res.statusText);
  }

  return;
};

export const askQuestion = async (question: string) => {
  const res = await fetch(
    new Request('/api/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    }),
  );

  if (!res.ok) {
    return new Error(res.statusText);
  }

  const data = await res.json();
  return data;
};
