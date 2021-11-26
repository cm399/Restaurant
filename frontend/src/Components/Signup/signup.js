import {Link} from "react-router-dom";
import styles from './signup.module.scss';
import {useRef} from "react";

const Signup = props => {

    let name = useRef(null);
    let email = useRef(null);
    let password = useRef(null);
    let checkbox = useRef(null);

    return(
        <div className={styles.signup}>
            <div className={styles.box} >
                <h2>Welcome to Restro!</h2>
                <h3>Signup to continue.</h3>

                <div className={styles.input}>
                    <span> <i className="fas fa-user-alt" /> </span>
                    <input ref={el => name = el} type='text' name='name' placeholder='Full Name'/>
                </div>
                <div className={styles.input}>
                    <span> <i className="fas fa-envelope" /> </span>
                    <input ref={el => email = el} type='email' name='email' placeholder='Email'/>
                </div>
                <div className={styles.input}>
                    <span> <i className="fas fa-key" /> </span>
                    <input ref={el => password = el} type='password' name='password' placeholder='Password'/>
                </div>
                <div className={styles.checkbox}>
                    <input ref={el => checkbox = el} type='checkbox' name='terms'/>
                    <p>I agree to the terms & condition.</p>
                </div>
                <button onClick={() => props.onSignup(name.value, email.value, password.value, checkbox.checked)}>Signup</button>
                <p className={styles.error} style={{color: props.error === 'User added successfully!' ? 'green' : 'red'}}>{props.error}</p>
                <div className={styles.line} />
                <p>Already have an account? <Link to='/signin'>Signin!</Link></p>
            </div>
        </div>
    )
}

export default Signup;