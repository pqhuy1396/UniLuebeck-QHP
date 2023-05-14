import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';

// Import the data from data.json
import data from '../Layout/Json/data.json';

// Define the initial state
const initialState = {
  data: data,
};

// Define the reducer function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(reducer);

// Define action types
const SET_DATA = 'SET_DATA';

// Define action creators
export const setData = (data) => ({
  type: SET_DATA,
  payload: data,
});

// Export the Redux store wrapped with the Provider component
export const ReduxProvider = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);