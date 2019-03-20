const env = require('../.env')

const auth = {
    name: env.sigfox_api.name,
    password: env.sigfox_api.password
}

const {
    getLoginToken, 
    getTerminals,
    getTerminalStatus,
    getTerminalLocation
} = require('../services/servicesModules')

const test = async() => {

    const token = await getLoginToken(auth)
    // console.log(token)
    const list = await getTerminals(token)
    // console.log(list.data[0])

    const chosenDeviceId = list.data[3].id
    console.log(chosenDeviceId)

    const terminalStatus = await getTerminalStatus(token, chosenDeviceId)
    console.log("STATUS FROM", chosenDeviceId)
    console.log(terminalStatus.data)

    const terminalLocation = await getTerminalLocation(token, chosenDeviceId)
    console.log("LOCATION INFO", terminalLocation)
    console.log(terminalLocation.data)
}   // end test

test()