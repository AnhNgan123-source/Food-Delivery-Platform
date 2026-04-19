import axiosClient from './axiosConfig';

const userApi = {
    getProfile: () => {
        return axiosClient.get('/user/profile');
    },
    updateProfile: (data) => {
        return axiosClient.put('/user/profile/update', data);
    }
};

export default userApi;