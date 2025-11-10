import { RouterProvider } from 'react-router-dom';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { store } from 'store';
import { JWTProvider } from 'contexts/JWTContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
});
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <JWTProvider>
          <ThemeCustomization>
            <ScrollTop>
              <RouterProvider router={router} />
            </ScrollTop>
          </ThemeCustomization>
        </JWTProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}
