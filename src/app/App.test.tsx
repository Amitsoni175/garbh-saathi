import { render, screen } from '@testing-library/react';
import App from './App';

describe('App placeholder', () => {
  it('renders the welcome greeting', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ram Ram ji');
  });
});
