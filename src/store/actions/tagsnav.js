import * as actionTypes from '../action-types'

export default {
    addNav(router) {
        return { type: actionTypes.TABS_NAV_ADD, payload: router }
    },
    deleteNav(router) {
        return { type: actionTypes.TABS_NAV_DELETE, payload: router }
    },
    closeAll() {
        return { type: actionTypes.TABS_CLOSE_ALL }
    },
    closeOthers(router) {
        return { type: actionTypes.TABS_CLOSE_OTHERS, payload: router }
    }
}
