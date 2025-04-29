import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportLost from '../pages/ReportLost';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('ReportLost Component', () => {
  beforeEach(() => {
    localStorage.setItem('userId', 'test-user-id');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('submits lost item form correctly', async () => {
    axios.post.mockResolvedValueOnce({});

    renderWithRouter(<ReportLost />);

    fireEvent.change(screen.getByPlaceholderText('Item Title'), {
        target: { value: 'Umbrella' },
      });
      
      fireEvent.change(screen.getByPlaceholderText('Description'), {
        target: { value: 'Black umbrella with wooden handle' },
      });
      
      fireEvent.change(screen.getByPlaceholderText("Last Seen Location"), {
        target: { value: 'Library' },
      });
      
      fireEvent.change(screen.getByLabelText('Date Lost'), {
        target: { value: '2024-04-01' },
      });
      
      

    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByPlaceholderText("imageplace"), { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/lost-items/report',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    });
  });
});
