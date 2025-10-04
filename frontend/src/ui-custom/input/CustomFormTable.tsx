import { Box, styled, SxProps, Table, TableBody, TableCell, TableHead, TableRow, Theme } from '@mui/material';
import React, { JSX } from 'react';
import { CSSSelectorObjectOrCssVariables } from '@mui/system';
// import useConfig from '../../hooks/useConfig';

interface Props {
  headers?: (string | JSX.Element)[];
  children?: any;
  sx?: CSSSelectorObjectOrCssVariables<Theme>;
}

const CustomFormTable = ({ headers, sx, children }: Props) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Table sx={{ ...sx }}>
        <TableHead>
          <TableRow>
            {headers?.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </Box>
  );
};

interface WrapInCellProps {
  sx?: SxProps<Theme>;
  children?: any;
}

export function WrapInCell({ sx, children }: WrapInCellProps) {
  return <TableCell sx={{ padding: '0px', ...sx }}>{children}</TableCell>;
}

export const HeaderActionCellStyled = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  verticalAlign: 'center',
  alignItems: 'center'
}));

export default CustomFormTable;
