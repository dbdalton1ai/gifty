import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders button with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('bg-purple-600');
  });

  it('applies custom className when provided', () => {
    render(<Button className="custom-class">Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-purple-600');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders as different HTML elements when type is specified', () => {
    render(<Button type="submit">Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('applies hover and focus states correctly', () => {
    render(<Button>Hover me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-purple-700');
    expect(button).toHaveClass('focus:ring-purple-500');
  });

  it('forwards additional props to button element', () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom Button">
        Click me
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom Button');
  });

  it('applies loading state correctly', () => {
    render(<Button isLoading>Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});