import PropTypes from 'prop-types';

// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function SubCard({ children, content = true, contentSX = {}, darkTitle, sx = {}, ...others }) {
  return (
    <Card
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        ':hover': {
          boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
        },
        ...sx
      }}
      {...others}
    >
      {/* card content */}
      {content && <CardContent sx={contentSX}>{children}</CardContent>}
      {!content && children}
    </Card>
  );
}

SubCard.propTypes = {
  children: PropTypes.node,
  content: PropTypes.bool,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  sx: PropTypes.object,
  others: PropTypes.any
};