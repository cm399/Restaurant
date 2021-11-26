import styles from './footer.module.scss';
import withWidth from '../../HOC/withWidth/withWidth';

const Footer = () => {
    return(
        <div className={styles.footer}>
            <p>© Restro Ltd. 2021</p>
        </div>
    )
}

export default withWidth(Footer, '#222428');