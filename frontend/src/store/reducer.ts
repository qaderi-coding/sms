// third-party
import { combineReducers } from 'redux';

// project imports
import authSlice from './slices/auth';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  auth: authSlice
});

export default reducer;