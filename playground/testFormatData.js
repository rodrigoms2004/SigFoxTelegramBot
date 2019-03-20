const moment = require('moment')



// const formatData = data => data ? moment(data).format('DD/MM/YYYY') : 'Não consta'
const formatData = data => {
    const result = moment(data).format('DD/MM/YYYY HH:mm:ss')
    // console.log(result)
    if (result !== 'Invalid date') {
        return result
    } else {
        return 'Não definida'
    }    
}

const timeStamp = '2019-03-23T21:15:30.000Z'
const newTimeStamp = formatData(timeStamp)

console.log(newTimeStamp)