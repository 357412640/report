export function deepCopy (obj) {
    const type = Object.prototype.toString.call(obj)
    if(type !== '[object Object]' && type !== '[object Array]') return obj
    const newObj = type === '[object Object]' ? {} : []
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' && obj[key] !== null ? deepCopy(obj[key]) : obj[key]
        }
    }
    return newObj
}