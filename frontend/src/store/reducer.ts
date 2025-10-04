// third-party
import { combineReducers } from 'redux';

// project imports
import authSlice from './slices/auth';
import salesSlice from '../apps/sales/store/salesSlice';
import userSlice from './slices/user';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  auth: authSlice,
  sales: salesSlice,
  user: userSlice
});

export default reducer;