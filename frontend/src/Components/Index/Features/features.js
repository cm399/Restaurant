import styles from './features.module.scss';
import Feature from "./Feature/feature";

const Features = () => {
    return(
        <div className={styles.features}>
            <h3>Why we are</h3>
            <h2>The Best in the Town</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <br/>tempor incididunt consectetur adipiscing elit.</p>

            <div className={styles.list}>
                <Feature title='Delicious Food' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.' />
                <Feature title='Fun Time' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.' />
                <Feature title='Healthy Options' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.' />
                <Feature title='Easy parking' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.' />
                <Feature title='Fast Service' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.' />
                <Feature title='Friendly Team' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.' />
            </div>
        </div>
    )
}

export default Features;