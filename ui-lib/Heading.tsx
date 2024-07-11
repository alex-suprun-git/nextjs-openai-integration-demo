import React from 'react';

function Heading({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-12 text-5xl font-bold text-white">{children}</h1>;
}

export default Heading;
