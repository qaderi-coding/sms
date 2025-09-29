//material-ui
import { styled } from '@mui/material/styles';

// third-party
import { SnackbarProvider } from 'notistack';

// project import
import { useSelector } from 'store';

// assets
import { IconAlertCircle, IconCircleCheck, IconInfoCircle, IconSquareRoundedX } from '@tabler/icons-react';
import ContentAlert from '../../ui-custom/ContentAlert';
import ServerErrorAlert from 'ui-custom/ServerErrorAlert';

declare module 'notistack' {
  interface VariantOverrides {
    alertDialog: {
      response?: any;
      request?: any;
      status?: number;
    };
    serverErrorDialog: {
      response?: any;
      request?: any;
      status?: number;
    };
  }
}

// custom styles
const StyledSnackbarProvider = styled(SnackbarProvider)(
  /*<CustomSnackbarProviderProps>*/ ({ theme }) => ({
    '&.notistack-MuiContent-default': {
      backgroundColor: theme.palette.primary.main
    },
    '&.notistack-MuiContent-error': {
      backgroundColor: theme.palette.error.main
    },
    '&.notistack-MuiContent-success': {
      backgroundColor: theme.palette.success.main
    },
    '&.notistack-MuiContent-info': {
      backgroundColor: theme.palette.info.main
    },
    '&.notistack-MuiContent-warning': {
      backgroundColor: theme.palette.warning.main
    }
  })
);

// ===========================|| SNACKBAR - NOTISTACK ||=========================== //

const Notistack = ({ children }: any) => {
  // const snackbar = useSelector((state) => state.snackbar);
  const iconSX = { marginRight: 8, fontSize: '1.15rem' };

  return (
    <StyledSnackbarProvider
      // maxSnack={snackbar.maxStack}
      // dense={snackbar.dense}
      // iconVariant={
      //     snackbar.iconVariant === 'useemojis'
      //         ? {
      //               success: <IconCircleCheck style={iconSX} />,
      //               error: <IconSquareRoundedX style={iconSX} />,
      //               warning: <IconInfoCircle style={iconSX} />,
      //               info: <IconAlertCircle style={iconSX} />,
      //               alertDialog: <IconInfoCircle style={iconSX} />
      //           }
      //         : undefined
      // }
      Components={{
        alertDialog: ContentAlert,
        serverErrorDialog: ServerErrorAlert
      }}
      // hideIconVariant={snackbar.iconVariant === 'hide' ? true : false}
    >
      {children};
    </StyledSnackbarProvider>
  );
};

export default Notistack;
