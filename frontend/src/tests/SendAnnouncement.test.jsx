import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SendAnnouncement from '../pages/SendAnnouncement';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('SendAnnouncement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form correctly', async () => {
    await act(async () => {
      renderWithRouter(<SendAnnouncement />);
    });

    expect(screen.getByRole('heading', { name: /send system announcement/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send announcement/i })).toBeInTheDocument();
  });

  it('submits form and navigates on success', async () => {
    axios.post.mockResolvedValueOnce({});

    // Mock alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await act(async () => {
      renderWithRouter(<SendAnnouncement />);
    });

    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'Server Maintenance' } });
    fireEvent.change(screen.getByPlaceholderText(/message/i), { target: { value: 'System will be down at 10 PM.' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /send announcement/i }));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/announcements',
        { title: 'Server Maintenance', message: 'System will be down at 10 PM.' }
      );
      expect(alertMock).toHaveBeenCalledWith('Announcement sent!');
      expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
    });

    alertMock.mockRestore();
  });

  it('shows error alert on failed submission', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await act(async () => {
      renderWithRouter(<SendAnnouncement />);
    });

    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'Error Test' } });
    fireEvent.change(screen.getByPlaceholderText(/message/i), { target: { value: 'This should fail.' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /send announcement/i }));
    });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Failed to send announcement');
    });

    alertMock.mockRestore();
  });
});
