import withWidth from "../HOC/withWidth/withWidth";
import {Fragment, useEffect, useState} from "react";
import {default as SingleRestaurant} from '../Components/Restaurant/restaurant';
import axios from "../axios";

const Restaurant = props => {

    // get a restaurant and its reviews

    const [restaurant, setRestaurant] = useState({});
    const [reviews, setReviews] = useState([]);

    useEffect(()=>{
        axios.get('/restaurant/' + props.match.params.restaurantId)
            .then(res=>{
                setRestaurant(res.data);
            })
            .catch(err => {
                console.log(err);
            });

        axios.get('/reviews/' + props.match.params.restaurantId)
            .then(res=>{
                setReviews(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [props.match.params.restaurantId])

    return(
        <Fragment>
            <SingleRestaurant restaurant={restaurant} reviews={reviews} {...props} />
        </Fragment>
    )
}

export default withWidth(Restaurant);