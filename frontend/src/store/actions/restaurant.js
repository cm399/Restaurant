import * as actionTypes from "./actionTypes";
import axios from "../../axios";

const compare = (a, b) => {
  if (a.rating < b.rating) {
    return -1;
  }
  if (a.rating > b.rating) {
    return 1;
  }
  return 0;
};

export const fetchRestaurants = () => {
  return (dispatch) => {
    dispatch({ type: actionTypes.FETCH_START });
    axios
      .get("/restaurants")
      .then((response) => {
        const restaurants = response.data;

        dispatch({
          type: actionTypes.FETCH_RESTAURANTS_SUCCESS,
          restaurants: restaurants.sort(compare).reverse(),
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.FETCH_ERROR,
          error: error,
        });
      });
  };
};
