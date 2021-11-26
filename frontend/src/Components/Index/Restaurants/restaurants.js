import {connect} from "react-redux";

import styles from './restaurants.module.scss';
import Restaurant from "../../../UI/Restaurant/restaurant";

const Restaurants = props => {
    return(
        <div className={styles.restaurants}>
            <h3>Some of our</h3>
            <h2>Famous Restaurants</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <br/>tempor incididunt consectetur adipiscing elit.</p>

            <div className={styles.allRestaurants}>
                {props.restaurants.slice(0,3).map(restaurant => {
                    return (<Restaurant key={restaurant._id} id={restaurant._id} name={restaurant.name} rating={restaurant.rating} totalReviews={restaurant.reviews.length} img={restaurant.imageUrl.replace('\\','/')} />)
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

export default connect(mapStateToProps)(Restaurants);