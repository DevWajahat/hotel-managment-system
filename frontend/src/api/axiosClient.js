import axios from 'axios';


const axiosClient = axios.create({

	baseURL: 'http://localhost:3000/',
	headers: {
		'Content-Type': 'application/json',
	},
});


axiosClient.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});


axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {

		if (error.response && error.response.status === 401) {

			console.error('Unauthorized access');
		}
		return Promise.reject(error);
	}
);

export default axiosClient;
