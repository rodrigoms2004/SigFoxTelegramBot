const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const moment = require('moment')

const formatData = data => {
    const result = moment(data).format('DD/MM/YYYY HH:mm:ss')
    // console.log(result)
    if (result !== 'Invalid date') {
        return result
    } else {
        return 'Não definida'
    }    
}   // formatData

const listTerminals = async terminals => {
    const buttons = terminals.map(terminal => {
        const data = terminal.id ? `${terminal.id}` : ''

        return [Markup.callbackButton(`${data}`, `${data}`)]
        // return [Markup.callbackButton(`${data}${terminal.description}`, `show ${terminal.id}`)]
    })
    return Extra.markup(Markup.inlineKeyboard(buttons, { columns: 2 }))
}

// https://emojipedia.org/
const terminalButtons = id => Extra.HTML().markup(Markup.inlineKeyboard([
    Markup.callbackButton('️Localização', `location ${id}`)
], {columns: 4}))

const showTerminalStatus = async(ctx, data, newMsg = false) => {
    const id = data[0].terminal_id    
    // console.log("CHAMADO", chamado[0].chamados)
    if(data !== null) {

        let msg = `
            <b>Status Id: </b>${data[0].statusId}
            <b>Terminal Id: </b>${data[0].terminal_id}
            <b>Date: </b>${formatData(data[0].timeStamp).split(/\ /)[0]}
            <b>Time: </b>${formatData(data[0].timeStamp).split(/\ /)[1]}
            <b>Connection Status: </b>${data[0].connectionStatus}
            <b>Update Status: </b> ${data[0].updateStatus}
            `

        if(newMsg) {
            ctx.reply(msg, terminalButtons(id))
        } else {
            ctx.editMessageText(msg, terminalButtons(id))
        }

    } else {
        ctx.reply(`Status do terminal ${id} não encontrado!`)
    }
}   // showTerminalStatus

const showTerminalLocation = async(ctx, data, newMsg = false) => {
    const id = data[0].terminal_id    
    // console.log("CHAMADO", chamado[0].chamados)
    if(data !== null) {

        let msg = `
            <b>Location Id: </b>${data[0].id}
            <b>Terminal Id: </b>${data[0].deviceId}
            <b>Date: </b>${formatData(data[0].timeStamp).split(/\ /)[0]}
            <b>Time: </b>${formatData(data[0].timeStamp).split(/\ /)[1]}
            <b>Latitude: </b>${data[0].latitude}
            <b>Longitude: </b>${data[0].longitude}
            <b>Precisão (m): </b>${data[0].accuracy}
            `

        if(newMsg) {
            await ctx.replyWithHTML(msg)
            await ctx.replyWithLocation(data[0].latitude, data[0].longitude);
        } else {
            ctx.replyWithHTML(msg)
        }

    } else {
        ctx.reply(`Localização do terminal ${id} não encontrado!`)
    }
}   // showTerminalLocation


module.exports = {
    listTerminals,
    showTerminalStatus,
    showTerminalLocation
}