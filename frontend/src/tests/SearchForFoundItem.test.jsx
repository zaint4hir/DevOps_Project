// tests/SearchForFoundItem.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SearchForFoundItem from '../pages/SearchForFoundItem';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

const mockFoundItems = [
  {
    _id: '1',
    title: 'Blue Umbrella',
    description: 'A blue umbrella with white stripes',
    location: 'Central Park',
    dateFound: '2025-04-01T00:00:00.000Z',
    image: 'umbrella.jpg',
  },
  {
    _id: '2',
    title: 'Red Scarf',
    description: 'A red scarf made of wool',
    location: 'Downtown Library',
    dateFound: '2025-04-05T00:00:00.000Z',
    image: 'scarf.jpg',
  },
];

describe('SearchForFoundItem Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockFoundItems });
  });

  test('renders found items dropdown and selects an item', async () => {
    render(
      <BrowserRouter>
        <SearchForFoundItem />
      </BrowserRouter>
    );

    // Wait for the dropdown options to be populated
    const selectElement = await screen.findByRole('combobox');

    // Check if the first item is in the dropdown
    expect(screen.getByText(/Blue Umbrella - Central Park/i)).toBeInTheDocument();

    // Simulate selecting the second item
    fireEvent.change(selectElement, { target: { value: '2' } });

    // Wait for the selected item's details to appear
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Red Scarf/i, level: 4 })).toBeInTheDocument();    
        expect(screen.getByText(/A red scarf made of wool/i)).toBeInTheDocument();

    });
  });

  test('displays error message on fetch failure', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    render(
      <BrowserRouter>
        <SearchForFoundItem />
      </BrowserRouter>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/There was an error fetching found items./i)).toBeInTheDocument();
    });
  });
});
