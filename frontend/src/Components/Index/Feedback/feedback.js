import styles from './feedback.module.scss';
import Review from "../../../UI/Review/review";
import {connect} from "react-redux";
import {useEffect, useState} from "react";
import axios from "../../../axios";

const Feedback = props => {

    // get all reviews, and use 3 of them in index page

    const [reviews, setReviews] = useState([]);

    useEffect(() => {

        props.restaurants.forEach(restaurant => {
            axios.get('/reviews/' + restaurant._id)
                .then(res => {
                    setReviews(prevReviews => {
                        return prevReviews.concat(res.data);
                    })
                })
        })
    }, [props.restaurants]);

    return(
        <div className={styles.feedback}>
            <h3>Feedback from</h3>
            <h2>Happy Customers</h2>
            <div className={styles.reviews}>

                {reviews.slice(0,3).map(review => {
                    return review.createdAt ? <Review key={review._id} hideReplies name={review.name} id={review._id} date={review.createdAt.split('T')[0]} comment={review.comment} stars={parseInt(review.rating)} /> : null;
                })}

            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return{
        restaurants: state.restaurants.restaurants,
        error: state.restaurants.error
    }
}

export default connect(mapStateToProps)(Feedback);