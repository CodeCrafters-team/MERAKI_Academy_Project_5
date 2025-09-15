'use client';

import React from 'react';

const ErrorPage: React.FC<{ error?: Error }> = ({ error }) => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ height: '100vh', padding: '2rem', gap: '1.5rem' }}
    >
      <h1>Oops! Something went wrong.</h1>

      {error && (
        <p style={{ color: 'red', maxWidth: '500px' }}>
          {error.message}
        </p>
      )}

      <button
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default ErrorPage;
