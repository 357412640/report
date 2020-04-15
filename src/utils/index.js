export const setLocation = (key, val) => {
    localStorage.setItem(key, val);
}

export const getLocation = (key) => {
    return localStorage.getItem(key);
}