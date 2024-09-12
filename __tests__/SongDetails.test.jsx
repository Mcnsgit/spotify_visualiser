// src/components/main/Player/Details/SongDetails.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import SongDetails from './SongDetails';

test('SongDetails renders with track details', () => {
  const track = {
    name: 'Test Song',
    artists: [{ name: 'Test Artist' }],
    album: { images: [{ url: 'test-url' }] },
  };

  render(<SongDetails track={track} />);

  expect(screen.getByText('Test Song')).toBeInTheDocument();
  expect(screen.getByText('Test Artist')).toBeInTheDocument();
  expect(screen.getByAltText('Test Song')).toHaveAttribute('src', 'test-url');
});
