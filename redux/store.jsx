import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { Provider, useSelector } from 'react-redux';
import thunk from 'redux-thunk';

// Import the data from data.json
import data from '../Layout/Json/data.json';

// Define the initial state
const initialState = {
  data: data,
  selectedLocations: [],
};

// Define the reducer function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return { ...state, data: action.payload };
    case SET_SELECTED_LOCATIONS:
      return { ...state, selectedLocations: action.payload };
      case SET_CURRENT_LOCATION:
        return { ...state, currentLocation: action.payload };
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(reducer , applyMiddleware(thunk));

// Define action types
const SET_DATA = 'SET_DATA';
const SET_SELECTED_LOCATIONS = 'SET_SELECTED_LOCATIONS';
const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';
// Define action creators
export const setData = (data) => ({
  type: SET_DATA,
  payload: data,
});

export const setSelectedLocations = (locations) => ({
  type: SET_SELECTED_LOCATIONS,
  payload: locations,
});
export const setCurrentLocation = (location) => (dispatch) => {

  dispatch({
    type: SET_CURRENT_LOCATION,
    payload: location,
  });
};

// Export the Redux store wrapped with the Provider component
export const ReduxProvider = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);
