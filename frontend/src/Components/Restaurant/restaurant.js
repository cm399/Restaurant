import styles from './restaurant.module.scss';
import fileStyle from '../../pages/fileInput.module.scss';
import {Fragment, useEffect, useRef, useState} from "react";
import Review from "../../UI/Review/review";
import Modal from "../../UI/Modal/modal";
import axios from "../../axios";
import {connect} from "react-redux";
import {fetchRestaurants} from "../../store/actions/restaurant";
import {Link} from "react-router-dom";
import FormData from "form-data";

const Restaurants = props => {

    //modal
    const [modalOpen, setModalOpen] = useState(false);
    const [stars, setStars] = useState(1);
    const [error, setError] = useState('');
    let feedback = useRef(null);

    const rateRestaurant = () => {
        if(!(props.isAuth && props.token)){
            setError('Not authorized.')
        }
        else if(stars < 1 || stars > 5){
            setError('Please select valid rating.')
        }
        else if(feedback.value.length < 5){
            setError('Review should be at least 5 characters long.')
        }
        else {
            axios.post('/review/' + props.match.params.restaurantId, {rating: stars, comment: feedback.value}, {headers: {Authorization: props.token}})
                .then(res => {
                    setError(res.data.message);
                    if(res.data.message === 'Review added successfully!'){
                        props.onFetchRestaurants();
                        window.location.reload();
                    }
                })
                .catch(err => {
                    setError(err.response.data.message);
                })
        }
    }

    //delete restaurant

    const deleteRestaurant = () => {
        if(props.isAuth && props.token && props.role === 'Admin'){
            axios.delete('/restaurant/' + props.match.params.restaurantId, {headers: {Authorization: props.token}})
                .then(res => {
                    if(res.data.message === 'Restaurant deleted successfully.'){
                        props.onFetchRestaurants();
                        props.history.replace('/restaurants');
                    }
                })
                .catch(err => {
                    console.log(err.response.data.message);
                })
        }
    }

    // edit restaurant modal

    const [editError, setEditError] = useState('');
    const [filename, setFilename] = useState('Select file');
    const [editModalOpen, setEditModalOpen] = useState(false);

    let nameInput = useRef(null);
    let imageInput = useRef(null);

    const editRestaurant = () => {
        if(nameInput.value.length < 5){
            setError('Name should be at least 5 characters long.');
        }
        else {
            const data = new FormData();
            data.set('name', nameInput.value);
            data.set('image', imageInput.files[0]);

            axios.put('/restaurant/' + props.match.params.restaurantId, data, {headers: {Authorization: props.token, 'Content-Type': `multipart/form-data; boundary=${data._boundary}`}})
                .then(res => {
                    setEditError(res.data.message);
                    if(res.data.message === 'Restaurant edited successfully!'){
                        props.onFetchRestaurants();
                        window.location.reload();
                    }
                })
                .catch(err => {
                    setEditError(err.response.data.message);
                })
        }
    }

    // get restaurant reviews

    const [reviews, setReviews] = useState([]);

    useEffect(()=>{
        axios.get('/reviews/' + props.match.params.restaurantId)
            .then(res => {
                setReviews(res.data);
            })
    }, []);

    // get percentage of each star rating

    const getReviews = rating => {
        let total = 0;
        reviews.forEach(review => {
            if(review.rating === rating){
                total += 1;
            }
        })
        return total === 0 ? 0 : ((total/reviews.length)*100).toFixed(0);
    }

    // set highest lowest and last

    let highest = null;
    let lowest = null;
    let last = {};

    const getHighestRated = () => {
        const last = reviews.sort(compare)[reviews.length-1];
        if(last){
            highest = last;
        }
    }

    const getLowestRated = () => {
        const first = reviews.sort(compare)[0];
        if(first){
            lowest = first;
        }
    }

    const compare = ( a, b ) => {
        if ( a.rating < b.rating ){
            return -1;
        }
        if ( a.rating > b.rating ){
            return 1;
        }
        return 0;
    }

    getHighestRated();
    getLowestRated();
    last = reviews.length !== 0 ? reviews.at(-1) : null;

    // set button for user, admin & owner

    let buttons;

    if(props.isAuth && props.role === 'User'){
        buttons = <button className={styles.rateUs} onClick={()=>setModalOpen(true)}>Rate Restaurant</button>
    }
    else if(props.isAuth && props.role === 'Admin'){
        buttons = (
            <div><button className={styles.rateUs} onClick={() => setEditModalOpen(true)}>Edit Restaurant</button>
            <button className={styles.rateUs} onClick={deleteRestaurant}>Delete Restaurant</button></div>
        )
    }

    return(
        <Fragment>
            <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} >
                <h2>Rate Our Restaurant</h2>
                <p>
                    {[...Array(5)].map((item, index) =>{
                        if(index < stars){
                            return (<span key={index} onClick={()=>setStars(index+1)}><i className="fas fa-star" /></span>);
                        }else {
                            return (<span key={index} onClick={()=>setStars(index+1)}><i className="far fa-star" /></span>);
                        }
                    })}
                </p>
                <textarea ref={el => feedback = el} placeholder='Leave your feedback' type='text' />
                <h3 className={fileStyle.error} style={{color: error === 'Review added successfully!' ? 'green' : 'red'}}>{error}</h3>
                <button onClick={rateRestaurant}>Submit</button>
            </Modal>

            <Modal modalOpen={editModalOpen} setModalOpen={setEditModalOpen} >
                <h2>Add Restaurant</h2>
                <input ref={el => nameInput = el} placeholder='Restaurant name' defaultValue={props.restaurant.name} type='text' />

                <label className={fileStyle.file}>
                    <input ref={el => imageInput = el} onChange={event => {setFilename(event.target.files[0].name)}} multiple={false} type="file" accept='.jpg,.jpeg,.png' required />
                    <span className={fileStyle.fileCustom} > {filename} </span>
                </label>

                <h3 className={fileStyle.error} style={{color: error === 'Restaurant edited successfully!' ? 'green' : 'red'}}>{editError}</h3>
                <button onClick={editRestaurant}>Submit</button>
            </Modal>

            <div style={{height: reviews.length === 0 ? '80vh' : null}} className={styles.top}>
                <div className={styles.left}>
                    <h1>{props.restaurant.name}</h1>
                    <p>Customer Reviews</p>
                    <h3 className={styles.review}>
                        <p className={styles.rate}><span><i className="fas fa-star" /></span>{reviews.length === 0 ? 'No Reviews' : (Math.round(props.restaurant.rating * 100) /100) + ' out of 5'}</p>
                        <p className={styles.total}>{reviews.length} Customer ratings</p>
                    </h3>

                    <div className={styles.star}>
                        <p>5 Star</p>
                        <div className={styles.bar} >
                            <div className={styles.layer} style={{width: getReviews(5) + '%'}} />
                        </div>
                        <p>{getReviews(5)}%</p>
                    </div>

                    <div className={styles.star}>
                        <p>4 Star</p>
                        <div className={styles.bar} >
                            <div className={styles.layer} style={{width: getReviews(4) + '%'}} />
                        </div>
                        <p>{getReviews(4)}%</p>
                    </div>

                    <div className={styles.star}>
                        <p>3 Star</p>
                        <div className={styles.bar} >
                            <div className={styles.layer} style={{width: getReviews(3) + '%'}} />
                        </div>
                        <p>{getReviews(3)}%</p>
                    </div>

                    <div className={styles.star}>
                        <p>2 Star</p>
                        <div className={styles.bar} >
                            <div className={styles.layer} style={{width: getReviews(2) + '%'}} />
                        </div>
                        <p>{getReviews(2)}%</p>
                    </div>

                    <div className={styles.star}>
                        <p>1 Star</p>
                        <div className={styles.bar} >
                            <div className={styles.layer} style={{width: getReviews(1) + '%'}} />
                        </div>
                        <p>{getReviews(1)}%</p>
                    </div>

                    {buttons}

                    {!props.isAuth ? (
                        <Link to='/signin'><button className={styles.rateUs}>Rate Restaurant</button></Link>
                    ): null}

                </div>
                <div className={styles.right}>
                    <img src={'http://localhost:8080/' + props.restaurant.imageUrl} alt='Food' />
                </div>
            </div>

            <div className={styles.bottom}>
                {highest ? (
                    <div className={styles.highest}>
                        <div className={styles.text}>
                            <h3>Highest Rated</h3>
                            <h2>Review</h2>
                        </div>
                        {highest.createdAt ? (<Review name={highest.name} id={highest._id} date={highest.createdAt.split('T')[0]} comment={highest.comment} stars={parseInt(highest.rating)} />) : null}
                    </div>
                ) : null}

                {lowest ? (
                    <div className={styles.lowest}>
                        <div className={styles.text}>
                            <h3>Lowest Rated</h3>
                            <h2>Review</h2>
                        </div>
                        {lowest.createdAt ? (<Review name={lowest.name} id={lowest._id} date={lowest.createdAt.split('T')[0]} comment={lowest.comment} stars={parseInt(lowest.rating)} />) : null}
                    </div>
                ) : null}

                {last ? (
                    <div className={styles.last}>
                        <div className={styles.text}>
                            <h3>Last</h3>
                            <h2>Review</h2>
                        </div>
                        {last.createdAt ? (<Review name={last.name} id={last._id} date={last.createdAt.split('T')[0]} comment={last.comment} stars={parseInt(last.rating)} />) : null}
                    </div>
                ) : null}

                {reviews.length !== 0 ? (
                    <Fragment>
                        <br />
                        <h2>All Reviews</h2>
                        <div className={styles.allReviews}>
                            {reviews.map(review => {
                                return review.createdAt ? <Review key={review._id} name={review.name} id={review._id} date={review.createdAt.split('T')[0]} comment={review.comment} stars={parseInt(review.rating)} /> : null;
                            })}
                        </div>
                    </Fragment>
                ) : null}

            </div>
        </Fragment>
    )
}

const mapStateToProps = state => {
    return{
        isAuth: state.auth.isAuthenticated,
        email: state.auth.email,
        role: state.auth.role,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onFetchRestaurants: () => dispatch(fetchRestaurants())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants);