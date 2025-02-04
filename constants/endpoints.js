export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.10.11.228'
export const API_URL = `${BASE_URL}/api`
// export const API_VERSION = 'v1'

//Auth ENDPOINT
export const LOGIN_ENDPOINT = `${API_URL}/auth/login`
export const LOGOUT_ENDPOINT = `${API_URL}/auth/logout`


// GROUPS
export const GROUP_LIST = `${API_URL}/groups`
export const GROUP = `${API_URL}/groups/:groupId`

export const CONTACT_LIST = `${API_URL}/contacts?page=1`

export const HISTORIES = `${API_URL}/histories`