import styles from './hero.module.scss';

const Hero = () => {
    return(
        <div className={styles.hero}>
            <div className={styles.text}>
                <img src={process.env.PUBLIC_URL + '/arrow.svg'} alt='arrow' />
                <h1>We speak the <br/>Good Food Language!</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <br/> tempor incididunt consectetur adipiscing elit.</p>
            </div>
            <div className={styles.image}>
                <img src={process.env.PUBLIC_URL + '/hero.png'} alt='hero' />
            </div>
        </div>
    )
}

export default Hero;