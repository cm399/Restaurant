import * as actionTypes from '../actions/actionTypes';

const initialState = {
    restaurants: [],
    error: null,
    loading: false
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.FETCH_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_RESTAURANTS_SUCCESS:
            return {
                ...state,
                restaurants: action.restaurants,
                loading: false,
                error: null
            }
        case actionTypes.FETCH_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default:
            return state;
    }
}

export default reducer;