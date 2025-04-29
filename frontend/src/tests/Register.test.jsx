import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/Register';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Register Component', () => {
  test('registers a new user and navigates to login', async () => {
    axios.post.mockResolvedValueOnce({ data: { msg: 'User registered successfully!' } });

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        role: 'user',
      });
    });
  });

  test('displays error alert on failed registration', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    axios.post.mockRejectedValueOnce({ response: { data: { msg: 'User already exists' } } });

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('User already exists');
    });

    alertMock.mockRestore();
  });
});
