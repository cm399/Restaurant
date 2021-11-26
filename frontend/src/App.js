import {Route, Switch} from "react-router";
import Navbar from "./UI/Navbar/navbar";
import Footer from "./UI/Footer/footer";
import {connect} from "react-redux";
import {useEffect} from "react";

import Index from "./pages/index";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Restaurants from "./pages/restaurants";
import Restaurant from "./pages/restaurant";
import {fetchRestaurants} from "./store/actions/restaurant";
import Users from "./pages/users";
import * as actionTypes from "./store/actions/actionTypes";
import Pending from "./pages/pending";
import NotFound from "./pages/notFound";

const App = props => {

    useEffect(() => {

        if(window.localStorage.getItem('email') && window.localStorage.getItem('role') && window.localStorage.getItem('userId') && window.localStorage.getItem('token') && window.localStorage.getItem('restaurants')){
            props.onSignin(window.localStorage.getItem('email'), window.localStorage.getItem('role'), window.localStorage.getItem('userId'), window.localStorage.getItem('token'), JSON.parse(window.localStorage.getItem('restaurants')));
        }

        props.onFetchRestaurants()
    }, []);

    return (
        <div>
            <Navbar isAuth={props.isAuth} />

            <Switch>
                <Route path='/' exact>
                    <Index />
                </Route>

                <Route path='/signup' exact component={Signup} />

                <Route path='/signin' exact component={Signin} />

                <Route path='/restaurants' exact>
                    <Restaurants />
                </Route>

                <Route path='/restaurants/:restaurantId' exact component={Restaurant} />

                <Route path='/users' exact>
                    {(props.isAuth && props.role === 'Admin') ? (
                        <Users />
                    ): <NotFound />}
                </Route>

                <Route path='/pending' exact>
                    {(props.isAuth && props.role === 'Owner') ? (
                        <Pending />
                    ): <NotFound />}
                </Route>

                <Route path='' component={NotFound} />
            </Switch>

            <Footer />

        </div>
    );
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
        onFetchRestaurants: () => dispatch(fetchRestaurants()),
        onSignin: (email, role, id, token, restaurants) => dispatch({type: actionTypes.SUCCESS_SIGNIN, email: email, role: role, userId: id, token: token, restaurants: restaurants})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);