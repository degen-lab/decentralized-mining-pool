import { render, screen } from '@testing-library/react';
import MainPage from './components/MainPage';
import React from 'react';

test('renders learn react link', () => {
  render(<MainPage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
