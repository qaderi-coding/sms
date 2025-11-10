import { Grid, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import React, { memo } from 'react';

export interface WrapInGridProps {
  columns?: number; // number of columns to split children
  xs?: number; // responsive width for xs
  sm?: number; // responsive width for sm
  md?: number; // responsive width for md
  lg?: number; // responsive width for lg
  xl?: number; // responsive width for xl
  spacing?: number; // spacing between grid items
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

const WrapInGrid = ({ columns = 1, xs, sm, md, lg, xl, spacing = 2, sx, children }: WrapInGridProps) => {
  // Calculate default Grid size based on columns
  const gridSize = Math.floor(12 / columns);

  return (
    <Grid container spacing={spacing} sx={sx}>
      {React.Children.map(children, (child, index) => (
        <Grid
          key={index}
          size={{
            xs: xs ?? gridSize,
            sm: sm ?? gridSize,
            md: md ?? gridSize,
            lg: lg ?? gridSize,
            xl: xl ?? gridSize
          }}
        >
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(WrapInGrid);
