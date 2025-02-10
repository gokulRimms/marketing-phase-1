import HIT_SERVER  from '../HIT_SERVER';
export const _LOGIN = (data) => {
    try {
        const request = HIT_SERVER.post('login', data);
        return request;
    } catch (error) {
        console.log('error : ', error);
    }
}