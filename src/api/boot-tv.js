import fetch from '@/axios/http'

export const bootMount = (data) => fetch.get('bi/bootup/cnt', data)
export const bootLong = (data) => fetch.get('bi/bootup/long', data)
export const bootTime = (data) => fetch.get('bi/bootup/time', data)


export const longavg = (data) => fetch.get('bi/bootup/longavg', data)
export const timedistribute = (data) => fetch.get('bi/bootup/longdis', data)