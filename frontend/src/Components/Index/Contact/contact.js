import styles from './contact.module.scss';

const Contact = () => {
    return(
        <div className={styles.contact}>
            <div className={styles.info}>
                <h2>Contact</h2>
                <p className={styles.line}>For any of your queries, contact us <br/> at following address!</p>
                <p> <span> <i className="fas fa-phone" /> </span> 111-000-111 </p>
                <p> <span> <i className="fas fa-envelope" /> </span> info@restro.com </p>
            </div>
            <div className={styles.map}>
                <img src={process.env.PUBLIC_URL + '/map.jpg'} alt='Map' />
            </div>
        </div>
    )
}

export default Contact;