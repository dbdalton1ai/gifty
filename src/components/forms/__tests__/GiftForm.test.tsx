import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GiftForm from '../GiftForm';
import { addGiftIdea } from '@/services/giftService';

// Mock the giftService
jest.mock('@/services/giftService', () => ({
  addGiftIdea: jest.fn(),
}));

describe('GiftForm', () => {
  const mockOnSuccess = jest.fn();
  const mockRecipientId = 'test-recipient-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<GiftForm recipientId={mockRecipientId} onSuccess={mockOnSuccess} />);
    
    expect(screen.getByLabelText(/gift title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price estimate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add gift idea/i })).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const mockGiftData = {
      title: 'Test Gift',
      description: 'Test Description',
      priceEstimate: '10.99',
      url: 'https://example.com',
    };

    (addGiftIdea as jest.Mock).mockResolvedValueOnce({});

    render(<GiftForm recipientId={mockRecipientId} onSuccess={mockOnSuccess} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/gift title/i), {
      target: { value: mockGiftData.title },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: mockGiftData.description },
    });
    fireEvent.change(screen.getByLabelText(/price estimate/i), {
      target: { value: mockGiftData.priceEstimate },
    });
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: mockGiftData.url },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(addGiftIdea).toHaveBeenCalledWith({
        ...mockGiftData,
        priceEstimate: parseFloat(mockGiftData.priceEstimate),
        recipientId: mockRecipientId,
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    // Check if form was reset
    expect(screen.getByLabelText(/gift title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByLabelText(/price estimate/i)).toHaveValue('');
    expect(screen.getByLabelText(/url/i)).toHaveValue('');
  });

  it('handles form submission without optional fields', async () => {
    const mockGiftData = {
      title: 'Test Gift',
      description: 'Test Description',
      priceEstimate: '',
      url: '',
    };

    (addGiftIdea as jest.Mock).mockResolvedValueOnce({});

    render(<GiftForm recipientId={mockRecipientId} onSuccess={mockOnSuccess} />);

    // Fill out only required fields
    fireEvent.change(screen.getByLabelText(/gift title/i), {
      target: { value: mockGiftData.title },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: mockGiftData.description },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(addGiftIdea).toHaveBeenCalledWith({
        ...mockGiftData,
        priceEstimate: undefined,
        recipientId: mockRecipientId,
      });
    });
  });

  it('handles submission error gracefully', async () => {
    const mockError = new Error('Failed to add gift');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (addGiftIdea as jest.Mock).mockRejectedValueOnce(mockError);

    render(<GiftForm recipientId={mockRecipientId} onSuccess={mockOnSuccess} />);

    // Fill out minimal required fields
    fireEvent.change(screen.getByLabelText(/gift title/i), {
      target: { value: 'Test Gift' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Description' },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error adding gift:', mockError);
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});