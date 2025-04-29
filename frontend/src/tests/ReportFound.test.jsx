import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportFound from '../pages/ReportFound';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('ReportFound Component', () => {
  beforeEach(() => {
    localStorage.setItem('userId', 'test-user-id');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('submits found item form correctly', async () => {
    axios.post.mockResolvedValueOnce({});

    renderWithRouter(<ReportFound />);

    fireEvent.change(screen.getByPlaceholderText('Item Title'), {
        target: { value: 'Umbrella' },
      });
      
      fireEvent.change(screen.getByPlaceholderText('Description'), {
        target: { value: 'Black umbrella with wooden handle' },
      });
      
      fireEvent.change(screen.getByPlaceholderText("Found At Location"), {
        target: { value: 'Library' },
      });
      
      fireEvent.change(screen.getByLabelText('Date Found'), {
        target: { value: '2024-04-01' },
      });

    const file = new File(['dummy'], 'image.png', { type: 'image/png' });
    fireEvent.change(screen.getByPlaceholderText("imageplace"), { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/found-items/report',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    });
  });
});
