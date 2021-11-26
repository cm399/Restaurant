import axios from "axios";
require('dotenv').config()

const instance = axios.create({
    baseURL: 'http://localhost:8080/'
});

export default instance;