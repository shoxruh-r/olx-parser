const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const path = require('path')


require('dotenv').config()
const { TOKEN } = process.env


async function start(links) {
    let i = 0

    console.log("Boshlandi!")
    
    const interval = setInterval(async () => {
        if (i === links.length)
            return clearInterval(interval)

        try {
            const page = await axios.get(links[i++])

            const $ = cheerio.load(page.data)
            const TITLE = $('h1').text().replaceAll('\n', ' ')
            const COST = $('h3.css-okktvh-Text').text()
            const NAME = $('a[name="user_ads"] h2.css-u8mbra-Text').text()
            const ADDRESS = $('li.css-7dfllt:last-child a.css-tyi2d1').text().split(' - ')[1]
            const ID = $('span.css-9xy3gn-Text').text().replace('ID: ', '')

            const { data: { data: { phones } } } = await axios.get(`https://www.olx.uz/api/v1/offers/${ID}/limited-phones/`, {
                headers: { Authorization: 'Bearer ' + TOKEN }
            })

            if (!phones.length) return

            fs.appendFile(path.join(__dirname, 'databases/olx.csv'), `${TITLE}\t${COST}\t${NAME}\t${ADDRESS}\t${phones}\n`, e => {
                if (e) return console.error(e)
            })
        } catch (e) {
            return console.error(e)
        }
    }, 5000)
}


fs.readFile(path.join(__dirname, 'databases/urls.txt'), 'utf8', (e, links) => {
    if (e) return console.error(e)

    links = links.split('\n')
    links.pop()

    start(links)
})

