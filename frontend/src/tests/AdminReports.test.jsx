import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminReports from '../pages/AdminReports';
import { vi } from 'vitest';
import axios from 'axios';
import {MemoryRouter}  from 'react-router-dom';
const mockNavigate = vi.fn();
// Mocking axios
vi.mock('axios');

// Mocking useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: ()  => mockNavigate, // only mock what you need
    };
  });
  

describe('AdminReports Component', () => {
  it('renders admin reports page with correct content', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // Mock response for lost items
    axios.get.mockResolvedValueOnce({ data: [] }); // Mock response for found items

    render(
      <MemoryRouter>
        <AdminReports />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /admin reports/i })).toBeInTheDocument();
      expect(screen.getByText(/no lost items reported/i)).toBeInTheDocument();
      expect(screen.getByText(/no found items reported/i)).toBeInTheDocument();
    });
  });

  it('handles back button click', () => {
    const navigate = vi.fn();
    render(
      <MemoryRouter>
        <AdminReports />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin-dashboard");
  });

  it('handles delete item click', async () => {
    axios.delete.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: [{ _id: '1', title: 'Lost Item 1' }] });
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <AdminReports />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(/delete/i));
    });

    expect(axios.delete).toHaveBeenCalledWith('http://localhost:5000/api/lost-items/1');
  });
});
