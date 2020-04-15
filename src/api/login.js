import myaxios from '@/axios/http'

export const reqlogin = data => { return myaxios.send('/platform/user/login', data) }