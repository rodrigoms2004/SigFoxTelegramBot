const env = require('./.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const moment = require('moment')

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')

// creating path and file stream objects
const Path = require('path')
const fs = require('fs')

const bot = new Telegraf(env.token)

const {
    getLoginToken, 
    getTerminals,
    getTerminalStatus,
    getTerminalLocation
} = require('./services/servicesModules')

const {
    listTerminals,
    showTerminalStatus,
    showTerminalLocation
} = require('./util/view')

const auth = {
    name: env.sigfox_api.name,
    password: env.sigfox_api.password
}

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja bem vindo, ${name}!\nAvise se precisar de /ajuda`)
})

bot.command('ajuda', async ctx => ctx.reply('/ajuda: opções'
    + '\n/terminais: lista os terminais SigFox cadastrados'
    + '\n/op2: opção genérica'
    + '\n12345: id do terminal SigFox'))

bot.hears(/\/op\d+/i, async ctx => ctx.reply('Resposta padrão para comandos genéricos'))

bot.hears(/\/terminais/gi, async ctx => {
    const token = await getLoginToken(auth)
    const terminalsList = await getTerminals(token)

    const btnTerminals = await listTerminals(terminalsList.data)

    await ctx.reply("Terminais cadastrados:", btnTerminals)
})

bot.action(/^(\d+)$/gi, async ctx => {
    const chosenTerminalId = await ctx.update.callback_query.data

    const token = await getLoginToken(auth)
    const terminalStatusList = await getTerminalStatus(token, chosenTerminalId)
    
    await showTerminalStatus(ctx, terminalStatusList.data, true)
    // await ctx.reply(`Terminal escolhido: ${chosenTerminalId}`)
})

bot.action(/location (.+)/, async ctx => {
    const terminalId = ctx.match[1]
    
    const token = await getLoginToken(auth)
    const terminalLocation = await getTerminalLocation(token, terminalId)

    await showTerminalLocation(ctx, terminalLocation.data, true)
})

bot.startPolling()
