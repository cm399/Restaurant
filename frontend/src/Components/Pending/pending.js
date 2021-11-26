import styles from './pending.module.scss';
import axios from "../../axios";
import {useEffect, useState} from "react";
import {connect} from "react-redux";
import Review from "../../UI/Review/review";

const Pending = props => {

    // get all pending reviews

    const [pendingReviews, setPendingReviews] = useState([]);

    useEffect(() => {

        props.ownerRestaurants.forEach(restaurant => {
            axios.get('/reviews/' + restaurant)
                .then(res => {
                    setPendingReviews(prevReviews => {
                        return prevReviews.concat(res.data);
                    })
                })
        })
    }, [props.ownerRestaurants]);

    return(
        <div className={styles.pending}>
            <h1>Pending Reviews</h1>
            <div className={styles.allReviews}>
                {pendingReviews.map(review => {
                    if(!review.reply){
                        return review.createdAt ? <Review key={review._id} name={review.name} id={review._id} date={review.createdAt.split('T')[0]} comment={review.comment} stars={parseInt(review.rating)} /> : null;
                    }
                })}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return{
        isAuth: state.auth.isAuthenticated,
        email: state.auth.email,
        role: state.auth.role,
        token: state.auth.token,
        ownerRestaurants: state.auth.ownerRestaurants,
        restaurants: state.restaurants.restaurants
    }
}

export default connect(mapStateToProps)(Pending);