import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { vi } from 'vitest';

// Mock window.location.href
vi.stubGlobal('window', {
  ...window,
  location: { href: '' },
});

describe('Dashboard Component', () => {
  it('renders dashboard with correct buttons', () => {
    render(<Dashboard />);

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /report lost item/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /report found item/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search lost items/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search found items/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view announcements/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('navigates to correct paths when buttons are clicked', () => {
    render(<Dashboard />);

    const reportLostButton = screen.getByRole('button', { name: /report lost item/i });
    const reportFoundButton = screen.getByRole('button', { name: /report found item/i });
    const searchLostButton = screen.getByRole('button', { name: /search lost items/i });
    const searchFoundButton = screen.getByRole('button', { name: /search found items/i });
    const viewAnnouncementsButton = screen.getByRole('button', { name: /view announcements/i });
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(reportLostButton);
    expect(window.location.href).toBe('/report-lost');

    fireEvent.click(reportFoundButton);
    expect(window.location.href).toBe('/report-found');

    fireEvent.click(searchLostButton);
    expect(window.location.href).toBe('/search-lost');

    fireEvent.click(searchFoundButton);
    expect(window.location.href).toBe('/search-found');

    fireEvent.click(viewAnnouncementsButton);
    expect(window.location.href).toBe('/user/announcements');

    fireEvent.click(logoutButton);
    expect(window.location.href).toBe('/login');
  });
});
