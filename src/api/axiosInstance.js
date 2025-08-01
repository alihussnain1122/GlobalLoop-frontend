import axios from 'axios';

const API= axios.create({
    baseURL: 'https://globalloop-backend.onrender.com/api/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})
API.interceptors.request.use((req)=>{
    const token= localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
