import { Divider, Grid, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import React, { memo, useMemo } from 'react';
import FormikTextField from './formik/FormikTextField';
// import useConfig from '../hooks/useConfig';

export interface GridProps {
  columns?: number;
  xs?: number;
  lg?: number;
  xl?: number;
  borderLeft?: boolean;
  sx?: SxProps<Theme>;
  children?: any;
}

function WrapInGrid({ columns, xs, lg, xl, borderLeft, sx, children }: GridProps) {
  // let config = useConfig();
  // console.log('input grid screen render');
  return (
    <Grid
      container
      // item={true}
      sx={{
        padding: '0px',
        marginBottom: '0px',
        alignContent: 'start',
        borderLeft: borderLeft === true ? '1px solid #e0e0e0' : '',
        // backgroundColor: config.navType == 'light' ? 'white' : 'rgb(33, 41, 70)',
        ...sx
      }}
    >
      {React.Children.map(children, (child, index) => {
        return child.type === Divider || child.type === Grid || child.type === WrapInGrid ? child : <Grid key={index}>{child}</Grid>;
      })}
    </Grid>
  );
}

export default memo(WrapInGrid);
