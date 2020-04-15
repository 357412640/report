import * as actionTypes from '../action-types'


const manageUser = (state = {userData: {}}, action) => {
  switch (action.type) {
    case actionTypes.saveAuth:
    case actionTypes.removeAuth: {
      return {
        ...state,
        userData: action.payload
      }
    }
    default:
      return state
  }
}

export default manageUser