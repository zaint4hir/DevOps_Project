// src/components/Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import axios from 'axios';

vi.mock('axios'); // <-- Mock axios

beforeEach(() => {
  localStorage.clear(); // Clear storage between tests
});

test('renders login form and updates inputs', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');

  fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  expect(emailInput.value).toBe('user@example.com');
  expect(passwordInput.value).toBe('password123');
});

test('logs in user and redirects (mocked axios)', async () => {
  axios.post.mockResolvedValue({
    data: {
      token: 'fake-jwt-token',
      user: {
        id: '123',
        role: 'user',
      },
    },
  });

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'user@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: 'password123' },
  });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));


  await waitFor(() => {
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    expect(localStorage.getItem('userId')).toBe('123');
    expect(localStorage.getItem('role')).toBe('user');
  });
});
