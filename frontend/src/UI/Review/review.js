import styles from './review.module.scss';
import {connect} from "react-redux";
import Modal from "../Modal/modal";
import {Fragment, useEffect, useRef, useState} from "react";
import axios from "../../axios";
import {fetchRestaurants} from "../../store/actions/restaurant";
import {withRouter} from "react-router";

const Review = props => {

    // get replies of restaurant

    const [reply, setReply] = useState({});

    useEffect(()=> {
        axios.get('/reply/' + props.id)
            .then(res => {
                setReply(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    // reply to review modal

    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState('');
    let comment = useRef(null);

    const replyToReview = () => {
        if(!(props.isAuth && props.role === 'Owner')) {
            setError('Not authorized.')
        }
        else if(comment.value.length < 5){
            setError('Reply must be at least 5 characters long.');
        }
        else {
            console.log(props.token);
            axios.post('/reply/' + props.id, {comment: comment.value},{headers: {Authorization: props.token}})
                .then(res => {
                    setError(res.data.message);
                    if(res.data.message === 'Reply added successfully!'){
                        props.onFetchRestaurants();
                        window.location.reload();
                    }
                })
                .catch(err => {
                    if(err.response){
                        setError(err.response.data.message);
                    }
                    else {
                        setError(err.toString());
                    }
                })
        }
    }

    //delete reply

    const deleteReply = (id) => {
        if(props.isAuth && props.role === 'Admin'){
            axios.delete('/reply/' + id, {headers: {Authorization: props.token}})
                .then(res => {
                    props.onFetchRestaurants();
                    window.location.reload();
                })
                .catch(err=> {
                    console.log(err.response);
                })
        }
    }

    //delete review

    const deleteReview = () => {
        if(props.isAuth && props.role === 'Admin'){
            axios.delete('/review/' + props.id, {headers: {Authorization: props.token}})
                .then(res => {
                    props.onFetchRestaurants()
                    props.history.replace('/restaurants');
                })
                .catch(err=> {
                    console.log(err.response);
                })
        }
    }

    let stars = props.stars ? parseInt(props.stars) : 0;

    return(
        <Fragment>
            <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
                <h2>Add Reply</h2>
                <input ref={el => comment = el} placeholder='Reply' type='text' />
                <h3 style={{color: error === 'Reply added successfully!' ? 'green' : 'red', fontSize: '14px'}}>{error}</h3>
                <button onClick={replyToReview}>Submit</button>
            </Modal>

            <div className={styles.review}>
                <div className={styles.top}>
                    <div className={styles.image}>
                        <img src={process.env.PUBLIC_URL + '/review.png'} alt='Review' />
                    </div>
                    <div className={styles.name}>
                        <h2>{props.name}</h2>
                        <p>Visited on: {props.date}</p>
                    </div>
                </div>
                <p className={styles.comment}>{props.comment}</p>
                <p className={styles.stars}>
                    {
                        [...Array(stars)].map(()=>(
                            <span key={Math.random()}><i className="fas fa-star" /></span>
                        ))
                    }

                    {
                        [...Array(5 - stars)].map(()=>(
                            <span key={Math.random()}><i className="far fa-star" /></span>
                        ))
                    }
                </p>



                {reply && !props.hideReplies ? (
                    <div className={styles.reply}>
                        <h3 style={{margin: '0 0 8px 0'}}>Owner's Response</h3>
                        <div className={styles.top}>
                            <div className={styles.image}>
                                <img src={process.env.PUBLIC_URL + '/admin.png'} alt='Review' />
                            </div>
                            <div className={styles.name}>
                                <h2>{reply.name}</h2>
                            </div>
                        </div>
                        <p style={{margin: '8px 0'}} className={styles.comment}>{reply.comment}</p>

                        {(props.isAuth && props.role === 'Admin') ? (
                            <div className={styles.bottomLinks}>
                                <p onClick={()=>deleteReply(reply._id)}>Delete</p>
                            </div>
                        ) : null}

                    </div>

                ) : null}

                {(props.isAuth && props.role === 'Owner' && !reply) ? (
                    <div className={styles.bottomLinks}>
                        <p onClick={()=>setModalOpen(true)}>Reply</p>
                    </div>
                ) : null}

                {(props.isAuth && props.role === 'Admin') ? (
                    <div className={styles.bottomLinks}>
                        <p onClick={deleteReview}>Delete</p>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Review));