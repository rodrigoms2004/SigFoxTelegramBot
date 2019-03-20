const env = require('../.env')
const axios = require('axios')

const getLoginToken = async (auth) => {
    const baseUrl = env.sigfox_api.url + '/api/login'
    const response = await axios.post(baseUrl,
    {
        name: auth.name,
        password: auth.password
    })

    return response.data.token
}   // getLoginToken

const getTerminals = async (token) => {
    const baseUrl = env.sigfox_api.url + '/api/terminals'
    const response = await axios.get(baseUrl, {
        headers : { 'x-access-token' : token } 
    })
    return response.data
}   // getTerminals

const getTerminalStatus = async (token, id) => {
    const baseUrl = env.sigfox_api.url + '/api/terminalStatus/' + id
    const response = await axios.get(baseUrl, {
        headers : { 'x-access-token' : token }
    })
    return response.data
}   // getTerminalStatus

const getTerminalLocation = async (token, id) => {
    const baseUrl = env.sigfox_api.url + '/api/terminalLocation/' + id
    const response = await axios.get(baseUrl, {
        headers : { 'x-access-token' : token }
    })
    return response.data
}   // getTerminalLocation

module.exports = {
    getLoginToken, 
    getTerminals,
    getTerminalStatus,
    getTerminalLocation
}