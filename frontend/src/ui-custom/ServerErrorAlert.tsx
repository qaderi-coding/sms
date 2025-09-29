import { forwardRef, useCallback, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { CustomContentProps, SnackbarContent, useSnackbar } from 'notistack';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { IValidationError } from '../store/types/Common';
import { Box } from '@mui/material';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 'calc(100vw - 40px)',
    '@media (min-width:600px)': {
      minWidth: '344px !important'
    }
  },
  card: {
    width: '100%'
  },
  typography: {
    color: '#000'
  },
  actionRoot: {
    padding: '8px 8px 8px 16px',
    justifyContent: 'space-between'
  },
  icons: {
    marginLeft: 'auto'
  },
  expand: {
    padding: '8px 8px',
    transform: 'rotate(0deg)',
    color: '#000',
    transition: 'all .2s'
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  paper: {
    backgroundColor: '#fff',
    padding: 16
  },
  checkIcon: {
    fontSize: 20,
    paddingRight: 4
  },
  button: {
    padding: 0,
    textTransform: 'none'
  }
}));

interface ServerErrorAlertProps extends CustomContentProps {
  code: string;
  message: string;
}

const ServerErrorAlert = forwardRef<HTMLDivElement, ServerErrorAlertProps>(({ id, code, message, ...props }, ref) => {
  const classes = useStyles();
  // const color = status == 400 ? '#FFB74D' : '#EF5350';
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);

  const handleDismiss = useCallback(() => {
    closeSnackbar();
  }, [id, closeSnackbar]);

  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Card className={classes.card} style={{ backgroundColor: '#FFB74D' }}>
        <CardActions classes={{ root: classes.actionRoot }}>
          <Typography variant="body2" className={classes.typography} style={{ color: 'white' }}>
            {message}
            {code}
          </Typography>
          <div className={classes.icons}>
            <IconButton size="small" className={classes.expand} onClick={handleDismiss}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </CardActions>
      </Card>
    </SnackbarContent>
  );
});

ServerErrorAlert.displayName = 'Alert';

export default ServerErrorAlert;
