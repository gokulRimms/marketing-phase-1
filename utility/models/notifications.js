import HIT_SERVER  from '../HIT_SERVER';


export const _NOTIFICATIONS_COUNT = async() => {
    try {
        const request = await HIT_SERVER.get('notifications/count');
        return request;
    } catch (error) {
        console.log('error : ', error);
    }
}

export const _FETCH_NOTIFICATIONS = async(type) => {
    try {
        const request = await HIT_SERVER.get('notifications', { params: { type: type } });
        return request;
    } catch (error) {
        console.log('error : ', error);
    }
}

export const _MARK_AS_READ = (id) => {
    try {
        const request = HIT_SERVER.post(`notifications/${id}/mark-read`);
        return request;
    } catch (error) {
        console.log('error : ', error);
    }
}

export const _DELETE_NOTIFICATION = async(id) => {
    try {
        const request = await HIT_SERVER.post(`notifications/${id}/delete`);
        return request;
    } catch (error) {
        console.log('error : ', error);
    }
}

export const _CLEAR_NOTIFICATIONS = async() => {
    try {
        const request = await HIT_SERVER.post(`notifications/clear-all`);
        return request;
    } catch (error) {
        console.log('error : ', error);
    }
}

export const _READALL_NOTIFICATIONS = async() => {
    try {
        const request = await HIT_SERVER.post(`notifications/read-all`);
        return request;
    } catch (error) {
        console.log('error : ', error);
    }
}


