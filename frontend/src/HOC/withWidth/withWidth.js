import styles from './withWidth.module.scss';

const wihWidth = (WrappedComponent, background) => {
    return props => (
        <div style={{width: '100%', background: background}}>
            <div className={styles.width}>
                <WrappedComponent {...props} />
            </div>
        </div>
    )
}

export default wihWidth;