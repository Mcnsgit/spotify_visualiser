// src/components/layout/Header/Header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Header from './Header';

const mockStore = configureStore([]);
const store = mockStore({
  user: { profile: { display_name: 'Test User', images: [{ url: 'test-url' }] } },
});

test('Header renders with user profile', () => {
  render(
    <Provider store={store}>
      <Header />
    </Provider>
  );

  expect(screen.getByText('Test User')).toBeInTheDocument();
  expect(screen.getByAltText('Test User')).toHaveAttribute('src', 'test-url');
});
