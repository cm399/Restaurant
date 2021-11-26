import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isAuthenticated: false,
    userId: null,
    email: null,
    role: 'User',
    token: null,
    ownerRestaurants: []
};

const reducer = (state = initialState, action) => {

    switch (action.type){
        case actionTypes.SUCCESS_SIGNIN:
            return {
                isAuthenticated: true,
                userId: action.userId,
                email: action.email,
                role: action.role,
                token: action.token,
                ownerRestaurants: action.restaurants
            }
        case actionTypes.SUCCESS_SIGNOUT:

            window.localStorage.removeItem('email');
            window.localStorage.removeItem('role');
            window.localStorage.removeItem('userId');
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('restaurants');

            return {
                isAuthenticated: false,
                userId: null,
                email: null,
                role: 'User',
                token: null,
                ownerRestaurants: []
            }
        default:
            return state;
    }
}

export default reducer;