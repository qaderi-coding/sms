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

interface ContentAlertProps extends CustomContentProps {
  response?: {
    errors?: any[];
    type?: string;
    title?: string;
    status?: string;
    traceId?: string;
  };
  request?: any;
  status?: number;
}

const ContentAlert = forwardRef<HTMLDivElement, ContentAlertProps>(({ id, status, request, response, ...props }, ref) => {
  const classes = useStyles();
  const color = status == 400 ? '#FFB74D' : '#EF5350';
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = useCallback(() => {
    setExpanded((oldExpanded) => !oldExpanded);
  }, []);

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  function isMappingValidationError() {
    return status === 400 && response?.traceId;
  }

  function isFluentValidationError() {
    return status == 400 && !response?.traceId;
  }

  function isInternalServerError() {
    return status == 500;
  }

  const prettyPrint = function (values: object | undefined) {
    let jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/gm;
    let replacer = function (match: any, pIndent: any, pKey: any, pVal: any, pEnd: any) {
      let key = '<span class="json-key" style="color: brown">',
        val = '<span class="json-value" style="color: navy">',
        str = '<span class="json-string" style="color: olive">',
        r = pIndent || '';
      if (pKey) r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
      if (pVal) r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
      return r + (pEnd || '');
    };

    return JSON.stringify(values, null, 3)
      .replace(/&/g, '&amp;')
      .replace(/\\"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(jsonLine, replacer);
  };

  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Card className={classes.card} style={{ backgroundColor: color }}>
        <CardActions classes={{ root: classes.actionRoot }}>
          <Typography variant="body2" className={classes.typography} style={{ color: 'white' }}>
            {props.message}
          </Typography>
          <div className={classes.icons}>
            <IconButton
              aria-label="Show more"
              size="small"
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={handleExpandClick}
            >
              <ExpandMoreIcon />
            </IconButton>
            <IconButton size="small" className={classes.expand} onClick={handleDismiss}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper id={'contentAlert'} className={classes.paper}>
            <Box
              style={{
                overflow: 'scroll',
                maxHeight: 'calc(100vh - 150px)'
              }}
            >
              {isFluentValidationError() &&
                response?.errors?.map((error, index) => (
                  <Typography key={index} gutterBottom variant="body2" style={{ color: '#000', display: 'block' }}>
                    <b>{error.code}</b>: [ {error.property} ] {error.description}
                  </Typography>
                ))}
              {isMappingValidationError() && (
                <>
                  <Typography variant="body1" style={{ color: 'orange', display: 'block' }}>
                    <b>Response Data</b>
                  </Typography>
                  <pre>
                    <div dangerouslySetInnerHTML={{ __html: prettyPrint(response) }}></div>
                  </pre>
                </>
              )}
              {isInternalServerError() && <pre>{response as any}</pre>}
              <Typography variant="body1" style={{ color: 'gray', display: 'block' }}>
                <b>Request Data</b>
              </Typography>
              <pre>{request ? <div dangerouslySetInnerHTML={{ __html: prettyPrint(JSON.parse(request)) }}></div> : 'Empty'}</pre>
            </Box>
          </Paper>
        </Collapse>
      </Card>
    </SnackbarContent>
  );
});

ContentAlert.displayName = 'Alert';

export default ContentAlert;
