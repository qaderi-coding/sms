import { Button, IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { IDictionary } from '../utils/types/IDictionary';
import { toRGBA } from '../utils/functions/toRGBA';
// import { Colorize } from '@mui/icons-material';
import { ForwardedRef, forwardRef, RefObject } from 'react';

interface Props extends IconButtonProps {
  // children: any;
  // color: 'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export const ActionButton = ({ children, title, color, disabled, onClick, sx }: Props, ref: ForwardedRef<any>) => {
  let colors = {
    default: '#364152',
    primary: '#2196f3',
    secondary: '#5e35b1',
    info: '#1e88e5',
    success: '#00e676',
    warning: '#ffe57f',
    error: '#f44336'
  } as IDictionary<string>;

  return (
    <Tooltip
      title={title}
      placement={'bottom'}
      componentsProps={{
        tooltip: {
          sx: {
            color: colors[color ? color : colors['default']],
            backgroundColor: toRGBA(colors[color ? color : colors['default']], 0.1),
            fontSize: '0.7rem',
            lineHeight: '0.8em',
            marginTop: '5px'
          }
        },
        arrow: {
          sx: {
            color: colors[color ? color : colors['default']],
            backgroundColor: toRGBA(colors[color ? color : colors['default']], 0.05)
          }
        }
      }}
    >
      <span>
        <IconButton
          ref={ref}
          onClick={onClick}
          disabled={disabled}
          size="small"
          sx={{
            borderRadius: '5px',
            width: '1.8rem',
            height: '1.8rem',
            marginRight: '0.1rem',
            marginLeft: '0.1rem',
            border: `1px solid ${toRGBA(colors[color ? color : colors['default']], 0.6)}`,
            '&:disabled': {
              border: `1px solid ${toRGBA(colors[color ? color : colors['default']], 0.2)}`
            },
            '&:disabled .MuiSvgIcon-root': {
              width: '20px',
              color: `${toRGBA(colors[color ? color : colors['default']], 0.3)}`
            },
            '&:hover:not(:disabled)': {
              borderColor: toRGBA(colors[color ? color : colors['default']], 0.8),
              backgroundColor: toRGBA(colors[color ? color : colors['default']], 0.25)
            },
            ...sx
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default forwardRef(ActionButton);
