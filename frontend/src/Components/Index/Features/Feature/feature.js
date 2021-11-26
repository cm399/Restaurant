import styles from './feature.module.scss';
// const foodImage = require('../../../../../public/fast-food.png');

const Feature = props => {
    return(
        <div className={styles.feature}>
            <img src={process.env.PUBLIC_URL + '/fast-food.png'} alt='Food' />
            <h2>{props.title}</h2>
            <p>{props.description}</p>
        </div>
    )
}

export default Feature;