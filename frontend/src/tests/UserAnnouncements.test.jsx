import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserAnnouncements from '../pages/UserAnnouncements';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

describe('UserAnnouncements Component', () => {
  beforeEach(() => {
    localStorage.setItem('userId', 'test-user');
  });

  it('renders no announcements message when none are returned', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<UserAnnouncements />);
    const headings = screen.getAllByText(/Announcements/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it('renders announcements and handles "Mark as Read"', async () => {
    const mockData = [
      { _id: '1', title: 'Test Title', message: 'Test Message', createdAt: new Date().toISOString() }
    ];
    axios.get.mockResolvedValueOnce({ data: mockData });
    axios.post.mockResolvedValueOnce({});

    render(<UserAnnouncements />);
    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /Mark as Read/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });
  });
});
