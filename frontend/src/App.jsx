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

export default function App() {
  return (
    <ReduxProvider store={store}>
      <JWTProvider>
        <ThemeCustomization>
          <ScrollTop>
            <RouterProvider router={router} />
          </ScrollTop>
        </ThemeCustomization>
      </JWTProvider>
    </ReduxProvider>
  );
}
