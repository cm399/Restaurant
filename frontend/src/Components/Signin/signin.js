import {Link} from "react-router-dom";
import styles from './signin.module.scss';
import {useRef} from "react";

const Signin = props => {

    let email = useRef(null);
    let password = useRef(null);
    let remember = useRef(null);

    return(
        <div className={styles.signin}>
            <div className={styles.box} >
                <h2>Welcome back!</h2>
                <h3>Signin to continue.</h3>

                <div className={styles.input}>
                    <span> <i className="fas fa-envelope" /> </span>
                    <input ref={el => email = el} type='email' name='email' placeholder='Email'/>
                </div>
                <div className={styles.input}>
                    <span> <i className="fas fa-key" /> </span>
                    <input ref={el => password = el} type='password' name='password' placeholder='Password'/>
                </div>
                <div className={styles.checkbox}>
                    <input ref={el => remember = el} type='checkbox' name='terms'/>
                    <p>Remember me.</p>
                </div>
                <button onClick={()=>props.onSignin(email.value, password.value, remember.checked)}>Signin</button>
                <p className={styles.error} style={{color: props.error === 'Signin successful!' ? 'green' : 'red'}}>{props.error}</p>
                <div className={styles.line} />
                <p>Don't have an account? <Link to='/signup'>Signup!</Link></p>
            </div>
        </div>
    )
}

export default Signin;