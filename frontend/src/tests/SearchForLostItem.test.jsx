import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SearchForLostItem from '../pages/SearchForLostItem';
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

describe('SearchForLostItem Component', () => {
  const mockLostItems = [
    {
      _id: '1',
      title: 'Lost Wallet',
      description: 'Black leather wallet',
      location: 'Library',
      dateLost: '2024-04-15T00:00:00.000Z',
      image: 'wallet.jpg'
    }
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockLostItems });
  });

  it('renders search form correctly', async () => {
    await act(async () => {
      renderWithRouter(<SearchForLostItem />);
    });

    expect(screen.getByRole('heading', { name: /search for lost items/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by title, description, or location/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
  });

  it('fetches and displays lost items on mount', async () => {
    await act(async () => {
      renderWithRouter(<SearchForLostItem />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/lost-items/');
      expect(screen.getAllByRole('option').length).toBe(2); // 1 item + default option
    });
  });

  it('filters items when searching', async () => {
    const filteredItems = [mockLostItems[0]];
    axios.get.mockResolvedValueOnce({ data: mockLostItems }) // Initial load
          .mockResolvedValueOnce({ data: filteredItems }); // Search response

    await act(async () => {
      renderWithRouter(<SearchForLostItem />);
    });

    const searchInput = screen.getByPlaceholderText(/search by title, description, or location/i);
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'wallet' } });
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/lost-items/search?q=wallet');
      expect(screen.getAllByRole('option').length).toBe(2); // 1 item + default option
    });
  });

  it('displays selected item details', async () => {
    await act(async () => {
      renderWithRouter(<SearchForLostItem />);
    });

    const select = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(select, { target: { value: '1' } });
    });

    expect(screen.getByText(/item details:/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /lost wallet/i, level: 4 })).toBeInTheDocument();

  });

  it('navigates back when back button is clicked', async () => {
    await act(async () => {
      renderWithRouter(<SearchForLostItem />);
    });

    const backButton = screen.getByRole('button', { name: /back to dashboard/i });
    await act(async () => {
      fireEvent.click(backButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('shows error message when fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    await act(async () => {
      renderWithRouter(<SearchForLostItem />);
    });

    await waitFor(() => {
      expect(screen.getByText(/there was an error fetching lost items/i)).toBeInTheDocument();
    });
  });
});