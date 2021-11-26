import {Link} from "react-router-dom";
import styles from './navbar.module.scss';
import withWidth from '../../HOC/withWidth/withWidth';
import {connect} from "react-redux";
import {withRouter} from "react-router";
import * as actionTypes from "../../store/actions/actionTypes";
import {useState} from "react";

const Navbar = props => {

    const [nav, setNav] = useState(false);

    return(
        <div className={styles.navbar}>
            <h1><Link to='/'>Restro</Link></h1>

            <span style={{position: nav ? 'fixed' : 'static'}} className={styles.bars} onClick={()=>setNav(prevState => !prevState)}> <i className="fas fa-bars" /> </span>

            <ul style={{left: nav ? '0' : '-100%'}}>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/restaurants'>Restaurants</Link>
                </li>

                {(props.isAuth && props.role === 'Owner') ? (
                    <li>
                        <Link to='/pending'>Pending Replies</Link>
                    </li>
                ): null}

                {(props.isAuth && props.role === 'Admin') ? (
                    <li>
                        <Link to='/users'>Users</Link>
                    </li>
                ): null}

                <li>
                    <Link to='/'>Contact</Link>
                </li>

                <li className={styles.auth}>
                    {props.isAuth ? (
                        <p onClick={()=>{
                            props.onSignout();
                            props.history.replace('/signin');
                        }}>Signout</p>
                    ) : (
                        <Link to='/signin'>Signin</Link>
                    )}
                </li>
            </ul>

        </div>
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
        onSignout: () => dispatch({type: actionTypes.SUCCESS_SIGNOUT})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withWidth(Navbar)));