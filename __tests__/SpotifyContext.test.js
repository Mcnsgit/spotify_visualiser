// src/context/SpotifyContext.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SpotifyProvider } from './SpotifyContext';

const TestComponent = () => {
  throw new Error('Test Error');
};

test('ErrorBoundary catches errors and displays fallback UI', () => {
  render(
    <SpotifyProvider>
      <TestComponent />
    </SpotifyProvider>
  );

  expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
});
