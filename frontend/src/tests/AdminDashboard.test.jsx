import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import { vi } from 'vitest';
import {MemoryRouter} from 'react-router-dom';
const mockNavigate = vi.fn();
// Mocking useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: ()  => mockNavigate, // only mock what you need
    };
  });
  

describe('AdminDashboard Component', () => {
  it('renders admin dashboard with correct buttons', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view all reports/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view claim history/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view analytics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send announcement/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('navigates to correct paths when buttons are clicked', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /view all reports/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/reports");

    fireEvent.click(screen.getByRole('button', { name: /view claim history/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/claim-history");

    fireEvent.click(screen.getByRole('button', { name: /view analytics/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/analytics");

    fireEvent.click(screen.getByRole('button', { name: /send announcement/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/announcements");

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
