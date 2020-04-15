import * as actionTypes from '../action-types';

export default {
    saveAuth(user) {
        return { type: actionTypes.saveAuth, payload: user };
    },
    removeAuth() {
        return { type: actionTypes.removeAuth, payload: {} };
    }
};
