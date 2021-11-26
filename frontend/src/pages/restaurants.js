import withWidth from "../HOC/withWidth/withWidth";
import {default as AllRestaurants} from '../Components/Restaurants/restaurants';
import Modal from "../UI/Modal/modal";
import {Fragment, useRef, useState} from "react";
import styles from './fileInput.module.scss';
import {connect} from "react-redux";
import axios from "../axios";
import FormData from 'form-data';

const Restaurants = props => {

    //post review modal

    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [filename, setFilename] = useState('Select file');

    let nameInput = useRef(null);
    let imageInput = useRef(null);

    const postRestaurant = () => {
        if(nameInput.value.length < 5){
            setError('Name should be at least 5 characters long.');
        }
        else if(imageInput.value === ''){
            setError('Please select an image.');
        }else {
            const data = new FormData();
            data.set('name', nameInput.value);
            data.set('image', imageInput.files[0]);

            axios.post('/restaurant', data, {headers: {Authorization: props.token, 'Content-Type': `multipart/form-data; boundary=${data._boundary}`}})
                .then(res => {
                    setError(res.data.message);
                    if(res.data.message === 'Restaurant added successfully!'){
                        const ownerRestaurants = JSON.parse(window.localStorage.getItem('restaurants'));
                        ownerRestaurants.push(res.data.restaurant._id);
                        window.localStorage.removeItem('restaurants');
                        window.localStorage.setItem('restaurants', JSON.stringify(ownerRestaurants));
                        window.location.reload();
                    }
                })
                .catch(err => {
                    setError(err.response.data.message);
                })
        }
    }

    return(
        <Fragment>

            {(props.isAuth && props.role === 'Owner') ? (
                <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} >
                    <h2>Add Restaurant</h2>
                    <input ref={el => nameInput = el} placeholder='Restaurant name' type='text' />

                    <label className={styles.file}>
                        <input ref={el => imageInput = el} onChange={event => {setFilename(event.target.files[0].name)}} multiple={false} type="file" accept='.jpg,.jpeg,.png' required />
                        <span className={styles.fileCustom} > {filename} </span>
                    </label>

                    <h3 className={styles.error} style={{color: error === 'Restaurant added successfully!' ? 'green' : 'red'}}>{error}</h3>
                    <button onClick={postRestaurant}>Submit</button>
                </Modal>
            ) : null}


            <div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h1 style={{margin: '1rem 0', fontWeight: 900}}>Our Restaurants</h1>
                    {(props.isAuth && props.role === 'Owner') ? (
                        <button className={styles.submit} onClick={()=>setModalOpen(true)}>Add Restaurant</button>
                    ) : null}
                </div>
                <AllRestaurants />
            </div>
        </Fragment>
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

export default connect(mapStateToProps)(withWidth(Restaurants));