import {Link} from "react-router-dom";

import styles from './restaurant.module.scss';
import {connect} from "react-redux";
const Restaurant = props => {

    // if owner doesnt own the restaurant, return null

    if(props.role === 'Owner' && !props.ownerRestaurants.includes(props.id)){
        return null;
    }

    //generate stars

    let flooredRate = Math.floor(props.rating);

    let stars = <div className={styles.stars}>
        {
            [...Array(flooredRate)].map((item, index)=>(
                <div key={index} className={styles.star} style={{backgroundImage: 'url("' + process.env.PUBLIC_URL + '/star.png")'}} />
            ))
        }

        {
            [...Array(5 - flooredRate)].map((item, index)=> {
                if(index === 0){
                    return (<div key={index} className={styles.star} style={{backgroundImage: 'url("' + process.env.PUBLIC_URL + '/star-empty.png")'}} >
                        <div className={styles.star} style={{width: ((props.rating.toFixed(2).toString()).split(".")[1]) + '%',backgroundImage: 'url("' + process.env.PUBLIC_URL + '/star.png")'}} />
                    </div>)
                }
                return (<div key={index} className={styles.star} style={{backgroundImage: 'url("' + process.env.PUBLIC_URL + '/star-empty.png")'}} />)
            })
        }
    </div>

    // return restaurant

    return(
        <Link to={'/restaurants/' + props.id}>
            <div className={styles.restaurant} style={{backgroundImage: 'url(http://localhost:8080/' + props.img + ')'}}>
                <div className={styles.layer} />
                <div className={styles.text}>
                    <h1>{props.name}</h1>
                    {props.totalReviews === 0 ? (
                        <p><span>No Reviews</span></p>
                    ): stars}
                </div>
            </div>
        </Link>
    )
}

const mapStateToProps = state => {
    return{
        isAuth: state.auth.isAuthenticated,
        email: state.auth.email,
        role: state.auth.role,
        token: state.auth.token,
        ownerRestaurants: state.auth.ownerRestaurants
    }
}

export default connect(mapStateToProps)(Restaurant);