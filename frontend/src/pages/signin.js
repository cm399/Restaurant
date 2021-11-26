import withWidth from "../HOC/withWidth/withWidth";
import {Fragment, useState} from "react";
import {default as SigninPage} from "../Components/Signin/signin";
import axios from "../axios";
import {connect} from "react-redux";
import * as actionTypes from "../store/actions/actionTypes";
import {withRouter} from "react-router";
import {fetchRestaurants} from "../store/actions/restaurant";

const Signin = props => {

    //signin modal

    const [error, setError] = useState('');

    const onSignin = (email, password, remember) => {
        if(email.length === 0 || password.length === 0){
            setError("Enter all the fields");
        }else {
            axios.post('/signin', {email: email, password: password})
                .then(res => {
                    if(res.data.message === 'Signin successful!'){
                        props.onSignin(res.data.email, res.data.role, res.data.userId, res.data.token, res.data.restaurants);

                        window.localStorage.setItem('email', res.data.email);
                        window.localStorage.setItem('role', res.data.role);
                        window.localStorage.setItem('userId', res.data.userId);
                        window.localStorage.setItem('token', res.data.token);
                        window.localStorage.setItem('restaurants', JSON.stringify(res.data.restaurants));

                        props.onFetchRestaurants();
                        props.history.replace('/restaurants/');

                    }
                    setError(res.data.message);
                })
                .catch(err => {
                    setError(err.response.data.message);
                })
        }
    }

    return(
        <Fragment>
            <SigninPage onSignin={onSignin} error={error} />
        </Fragment>
    )
}

const mapDispatchToProps = dispatch => {
    return{
        onFetchRestaurants: () => dispatch(fetchRestaurants()),
        onSignin: (email, role, id, token, restaurants) => dispatch({type: actionTypes.SUCCESS_SIGNIN, email: email, role: role, userId: id, token: token, restaurants: restaurants})
    }
}

export default connect(null, mapDispatchToProps)(withRouter(withWidth(Signin)));