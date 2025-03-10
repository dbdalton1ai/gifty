import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GiftList from '../GiftList';
import { deleteGiftIdea, getGiftIdeas } from '@/services/giftService';

jest.mock('@/services/giftService', () => ({
  getGiftIdeas: jest.fn(),
  deleteGiftIdea: jest.fn(),
}));

describe('GiftList', () => {
  const mockGifts = [
    {
      id: '1',
      title: 'Gift 1',
      description: 'Description 1',
      priceEstimate: 10.99,
      url: 'https://example.com/1',
    },
    {
      id: '2',
      title: 'Gift 2',
      description: 'Description 2',
      priceEstimate: 20.99,
      url: 'https://example.com/2',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getGiftIdeas as jest.Mock).mockResolvedValue(mockGifts);
  });

  it('renders gift list correctly', async () => {
    render(<GiftList recipientId="test-id" />);

    await waitFor(() => {
      expect(screen.getByText('Gift 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('$10.99')).toBeInTheDocument();
      expect(screen.getByText('Gift 2')).toBeInTheDocument();
    });
  });

  it('handles gift deletion', async () => {
    (deleteGiftIdea as jest.Mock).mockResolvedValueOnce(undefined);

    render(<GiftList recipientId="test-id" />);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(2);
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteGiftIdea).toHaveBeenCalledWith('1');
      // Should refetch the list after deletion
      expect(getGiftIdeas).toHaveBeenCalledTimes(2);
    });
  });

  it('handles empty gift list', async () => {
    (getGiftIdeas as jest.Mock).mockResolvedValueOnce([]);

    render(<GiftList recipientId="test-id" />);

    await waitFor(() => {
      expect(screen.getByText(/no gifts found/i)).toBeInTheDocument();
    });
  });

  it('handles error when fetching gifts', async () => {
    const mockError = new Error('Failed to fetch gifts');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (getGiftIdeas as jest.Mock).mockRejectedValueOnce(mockError);

    render(<GiftList recipientId="test-id" />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching gifts:', mockError);
      expect(screen.getByText(/error loading gifts/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('handles error when deleting a gift', async () => {
    const mockError = new Error('Failed to delete gift');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (deleteGiftIdea as jest.Mock).mockRejectedValueOnce(mockError);

    render(<GiftList recipientId="test-id" />);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(2);
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting gift:', mockError);
    });

    consoleSpy.mockRestore();
  });

  it('displays gift URLs as links when provided', async () => {
    render(<GiftList recipientId="test-id" />);

    await waitFor(() => {
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', 'https://example.com/1');
      expect(links[1]).toHaveAttribute('href', 'https://example.com/2');
    });
  });
});