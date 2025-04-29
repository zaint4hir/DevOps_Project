import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ViewClaimHistory from '../pages/ViewClaimHistory';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

describe('ViewClaimHistory Component', () => {
  const mockNavigate = vi.fn();
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders "no claim history" when no matches are found', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ViewClaimHistory />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No claim history available/i)).toBeInTheDocument();
    });
  });

  it('renders claim history table', async () => {
    const mockMatches = [
      {
        _id: 'match1',
        lostItemId: { title: 'Wallet' },
        foundItemId: { title: 'Black Wallet' },
        lostUserName: 'Alice',
        foundUserName: 'Bob',
        dateMatched: new Date().toISOString()
      }
    ];
    axios.get.mockResolvedValueOnce({ data: mockMatches });

    render(
      <MemoryRouter>
        <ViewClaimHistory />
      </MemoryRouter>
    );

    await waitFor(() => {
        const cells = screen.getAllByText(/Wallet/i);
        expect(cells.length).toBeGreaterThan(0);
        
      expect(screen.getByText(/Black Wallet/i)).toBeInTheDocument();
      expect(screen.getByText(/Alice/i)).toBeInTheDocument();
    });
  });

  it('navigates back to admin dashboard on button click', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ViewClaimHistory />
      </MemoryRouter>
    );

    const backButton = await screen.findByRole('button', { name: /Back to Dashboard/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
  });
});
