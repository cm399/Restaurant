import withWidth from "../HOC/withWidth/withWidth";
import {Fragment, useState} from "react";
import {default as SignupPage} from "../Components/Signup/signup";
import axios from "../axios";
import {connect} from "react-redux";
import * as actionTypes from "../store/actions/actionTypes";
import {withRouter} from "react-router";
import {fetchRestaurants} from "../store/actions/restaurant";

const Signup = (props) => {

    //signup modal

    const [error, setError] = useState('');

    const onSignup = (name, email, password, checked) => {

        if(!checked){
            setError('Accept terms & condition')
        }
        else if(name.length === 0){
            setError("Name can't be empty");
        }
        else if(!validateEmail(email)){
            setError("Enter a valid email");
        }
        else if(password.length < 5){
            setError("Password must be 5 characters long!");
        }
        else {
            axios.post('/signup', {name: name, email: email, password: password})
                .then(res => {
                    setError(res.data.message);
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
                            console.log(err);
                            setError(err.response.data.message);
                        })
                })
                .catch(err => {
                    setError(err.response.data.message);
                })
        }
    }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    return(
        <Fragment>
            <SignupPage onSignup={onSignup} error={error} />
        </Fragment>
    )
}

const mapDispatchToProps = dispatch => {
    return{
        onFetchRestaurants: () => dispatch(fetchRestaurants()),
        onSignin: (email, role, id, token, restaurants) => dispatch({type: actionTypes.SUCCESS_SIGNIN, email: email, role: role, userId: id, token: token, restaurants: restaurants})
    }
}

export default connect(null, mapDispatchToProps)(withRouter(withWidth(Signup)));
