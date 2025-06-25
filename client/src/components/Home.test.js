import { render, screen } from '@testing-library/react';
import Home from './Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

test('renders home page', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
  expect(await screen.findByText(/Your Creative Work/i)).toBeInTheDocument();
});

test('renders loading skeletons when data is loading', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
  expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
});