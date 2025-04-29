import { render, screen,fireEvent, waitFor } from '@testing-library/react';
import AnalyticsPage from '../pages/AnalyticsPage';
import { vi } from 'vitest';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
const mockNavigate = vi.fn();
vi.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="mock-bar-chart">Mock Bar Chart</div>
  }));
// Mocking axios
vi.mock('axios');

// Mocking useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: ()  => mockNavigate, 
    };
  });

  describe('AnalyticsPage Component', () => {
    it('renders analytics page with correct content', () => {
      render(<AnalyticsPage />);
  
      expect(screen.getByText(/Admin Analytics Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Items Matched/i)).toBeInTheDocument();
      expect(screen.getByText(/Reports per Month/i)).toBeInTheDocument();
      expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();
    });


  it('handles back button click', () => {
    const navigate = vi.fn();
    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/admin-dashboard");
  });
});
