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
    log 
} = require('./util/loggerTool')

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
    const msg = {
        userId  : ctx.update.message.from.id,
        name    : ctx.update.message.from.first_name,
    }
    log('start', 'info', `User ${msg.name}, id ${msg.userId} have started Bot`)
    ctx.reply(`Seja bem vindo, ${msg.name}!\nAvise se precisar de /ajuda`)
})

bot.command('ajuda', async ctx => ctx.reply('/ajuda: opções'
    + '\n/terminais: lista os terminais SigFox cadastrados'
    + '\n/op2: opção genérica'
    + '\n12345: id do terminal SigFox'))

bot.hears(/\/op\d+/i, async ctx => ctx.reply('Resposta padrão para comandos genéricos'))

bot.hears(/\/terminais/gi, async ctx => {
    try {
        const msg = {
            userId  : ctx.update.message.from.id,
            name    : ctx.update.message.from.first_name,
        }
        log('hearsTerminalList', 'info', `User ${msg.name}, id ${msg.userId} asked for terminal list`)
    
        const token = await getLoginToken(auth)
        const terminalsList = await getTerminals(token)
    
        const btnTerminals = await listTerminals(terminalsList.data)
    
        await ctx.reply("Terminais cadastrados:", btnTerminals)
    } catch (error) {
        log('hearsTerminalList', 'error', `${error}`)
        ctx.reply(`${error}`)
    }
})

bot.hears(/^(\d+)$/gi, async ctx => {
    try {
        const msg = {
            userId      : ctx.update.message.from.id,
            name        : ctx.update.message.from.first_name,
            terminalId  : ctx.update.message.text
        }
        log('hearsTerminalId', 'info', `User ${msg.name}, id ${msg.userId} asked for terminal ${msg.terminalId}`)
        
        const token = await getLoginToken(auth)
        const terminalStatusList = await getTerminalStatus(token, msg.terminalId)

        if (terminalStatusList.data.length === 0) {
            log('hearsTerminalId', 'info', `Terminal id ${msg.terminalId} not found`)
            ctx.reply('Terminal não encontrado')
        } else {
            log('hearsTerminalId', 'info', `Sending status`)
            await showTerminalStatus(ctx, terminalStatusList.data, true)
        }

    } catch (error) {
        log('hearsTerminalId', 'error', `${error}`)
        ctx.reply(`${error}`)
    }
})

bot.action(/^(\d+)$/gi, async ctx => {
    try {

        const msg = {
            userId  : ctx.update.callback_query.from.id,
            name    : ctx.update.callback_query.from.first_name,
        }

        const chosenTerminalId = await ctx.update.callback_query.data

        log('actionTerminalStatus', 'info', `User ${msg.name}, id ${msg.userId} asked for ${chosenTerminalId} status.`)

        const token = await getLoginToken(auth)
        const terminalStatusList = await getTerminalStatus(token, chosenTerminalId)
        
        await showTerminalStatus(ctx, terminalStatusList.data, true)
        // await ctx.reply(`Terminal escolhido: ${chosenTerminalId}`)
    } catch (error) {
        log('actionTerminalStatus', 'error', `${error}`)
        ctx.reply(`${error}`)
    }
})

bot.action(/location (.+)/, async ctx => {
    try {

        const msg = {
            userId  : ctx.update.callback_query.from.id,
            name    : ctx.update.callback_query.from.first_name,
        }
        
        const terminalId = ctx.match[1]
        
        log('actionTerminalStatus', 'info', `User ${msg.name}, id ${msg.userId} asked for ${terminalId} location.`)

        const token = await getLoginToken(auth)
        const terminalLocation = await getTerminalLocation(token, terminalId)
    
        await showTerminalLocation(ctx, terminalLocation.data, true)
    } catch (error) {
        log('actionTerminalLocation', 'error', `${error}`)
        ctx.reply(`${error}`)
    }
})

bot.startPolling()
