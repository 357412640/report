import * as actionTypes from '../action-types'
import {
    setLocation,
    getLocation
} from '@/utils'
import RoutesConfig from '@/router/config'
import {
    deepCopy
} from '@/utils/deepcopy'

const getCurrentRouter = () => {
    let router = RoutesConfig.menus.find(item => {
        return item.path === window.location.pathname
    })
    if (!router) {
        RoutesConfig.menus.find(item => {
            if (item.subs && item.subs.length !== 0) {
                return router = item.subs.find(sub => {
                    return sub.path === window.location.pathname
                })
            }
        })
    }
    return router
}

const home = {
    key: 'home',
    path: '/home',
    meta: {
        title: '数据概览'
    }
}
const initList = getCurrentRouter() ? [home, getCurrentRouter()] : [home]

// 初始化tabs合并
const getMergeTabs = () => {
    const list = getLocation('tabsList') ? JSON.parse(getLocation('tabsList')) : []
    const mergList = [...list, ...initList]
    return mergList.reduce((acc, cur) => {
        if (!acc.find(ele => (ele && ele.path) === cur.path)) {
            acc.push(cur)
        }
        return acc
    }, [])
}

const initialState = {
    tabsList: getMergeTabs()
}
console.log('initList', initialState)

const isAdded = (list, current) => {
    return list.findIndex(val => val.path === current.path) !== -1
}

const findArrIndex = (item, list) => {
    return list.findIndex(ele => {
        return ele.path === item.path
    })
}


const tagsNav = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TABS_NAV_ADD:
            const newtabsList = isAdded(state.tabsList, action.payload) ? state.tabsList : [...state.tabsList, action.payload]
            // 将值存储到浏览器本地并并更新
            setLocation('tabsList', JSON.stringify(newtabsList))
            return {
                ...state,
                tabsList: newtabsList
            }
        case actionTypes.TABS_NAV_DELETE:
            let newtabList = deepCopy(state.tabsList)
            newtabList.splice(findArrIndex(action.payload, state.tabsList), 1)
            setLocation('tabsList', JSON.stringify(newtabList))
            return {
                ...state, tabsList: newtabList
            }
        case actionTypes.TABS_CLOSE_ALL:
            setLocation('tabsList', JSON.stringify([home]))
            return {
                ...state, tabsList: [home]
            }
        case actionTypes.TABS_CLOSE_OTHERS:
            // 当前页为home时候，只保留home，否则保留home和当前路由（或者指定的路由）
            if (action.payload.path === '/home') {
                setLocation('tabsList', JSON.stringify([home]))
                return {
                    ...state,
                    tabsList: [home]
                }
            } else {
                setLocation('tabsList', JSON.stringify([home, action.payload]))
                return {
                    ...state,
                    tabsList: [home, action.payload]
                }
            }
        default:
            setLocation('tabsList', JSON.stringify(state.tabsList))
            return state
    }
}

export default tagsNav