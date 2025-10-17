import React from 'react';

export default function CardContainer({ children }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', marginTop: '1rem', flexDirection: 'row' }}>
      {children}
    </div>
  );
}
