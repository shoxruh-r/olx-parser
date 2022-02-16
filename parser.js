'use strict'
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const path = require('path')


require('dotenv').config()
const { TOKEN } = process.env


const errorLogger = e => {
    fs.appendFile(path.join(__dirname, 'databases/errors.log'), `${e}\n\n`, e => {
        if (e) return console.error(e)
    })
}


function start(links) {
    let index = 0

    const interval = setInterval(async () => {
        if (index >= links.length) return clearInterval(interval)

        try {
            const page = await axios.get(links[index++])

            const $ = cheerio.load(page.data)
            const TITLE = $('h1').text().replaceAll('\n', ' ')
            const COST = $('h3.css-okktvh-Text').text()
            const NAME = $('a[name="user_ads"] h2.css-u8mbra-Text').text()
            const ADDRESS = $('li.css-7dfllt:last-child a.css-tyi2d1').text().split(' - ')[1]
            const ID = $('span.css-9xy3gn-Text').text().replace('ID: ', '')


            const { data: { data: { phones } } } = await axios.get(`https://www.olx.uz/api/v1/offers/${ID}/limited-phones/`, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            })

            if (!phones.length) return

            fs.appendFile(path.join(__dirname, 'databases/olx.csv'), `${TITLE}\t${COST}\t${NAME}\t${ADDRESS}\t${phones}\n`, e => {
                if (e) {
                    errorLogger(e)
                    return clearInterval(interval)
                }
            })
        } catch (e) {
            errorLogger(e)
            return clearInterval(interval)
        }
    }, 5_000)
}


fs.readFile(path.join(__dirname, 'databases/urls.txt'), 'utf8', (e, links) => {
    if (e) return console.error(e)

    links = links.split('\n')
    links.pop()

    start(links)
})
