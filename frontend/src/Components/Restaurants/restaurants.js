import styles from './restaurants.module.scss';
import Restaurant from "../../UI/Restaurant/restaurant";
import {Fragment} from "react";
import {connect} from "react-redux";

const Restaurants = props => {

    return(
        <Fragment>
            {props.restaurants.length === 0 ? <p style={{margin:'2rem 0 0 0', textAlign: 'center'}}>No Restaurants</p> : null}
            <div className={styles.restaurants}>
                {props.restaurants.map(restaurant => {
                    return (<Restaurant key={restaurant._id} id={restaurant._id} name={restaurant.name} rating={restaurant.rating} totalReviews={restaurant.reviews.length} img={restaurant.imageUrl.replace('\\','/')} />)
                })}
            </div>
        </Fragment>
    )
}

const mapStateToProps = state => {
    return{
        restaurants: state.restaurants.restaurants,
        error: state.restaurants.error,
    }
}

export default connect(mapStateToProps)(Restaurants);