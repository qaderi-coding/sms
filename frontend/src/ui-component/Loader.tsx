// material-ui
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

// styles
const LoaderWrapper = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Reduced opacity for a lighter overlay
    zIndex: 1301,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none' // Disables interaction with elements behind it
});

const CustomLinearProgress = styled(LinearProgress)({
    width: '100%',
    position: 'absolute',
    top: 0
});

// ==============================|| LOADER ||============================== //

const Loader = () => (
    <LoaderWrapper>
        <CustomLinearProgress color="primary" />
    </LoaderWrapper>
);

export default Loader;
