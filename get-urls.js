'use strict'
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const path = require('path')


const categories = [    
    'https://www.olx.uz/oz/uslugi/finansovye-uslugi/',
    'https://www.olx.uz/oz/uslugi/nyani-sidelki/',
    'https://www.olx.uz/oz/uslugi/krasota-zdorove/',
    'https://www.olx.uz/oz/uslugi/obrazovanie/',
    'https://www.olx.uz/oz/uslugi/uslugi-dlya-zhivotnyh/',
    'https://www.olx.uz/oz/uslugi/prodazha-biznesa/',
    'https://www.olx.uz/oz/uslugi/razvlechenie-foto-video/',
    'https://www.olx.uz/oz/uslugi/turizm/',
    'https://www.olx.uz/oz/uslugi/uslugi-perevodchikov-nabor-teksta/',
    'https://www.olx.uz/oz/uslugi/avto-moto-uslugi/',
    'https://www.olx.uz/oz/uslugi/yuridicheskie-uslugi/'
]


async function start(categories) {
    const PAGE = 25

    for (const category of categories) {
        for (let page = 1; page <= PAGE; page++) {
            const response = await axios(`${category}?page=${page}`)

            if (response.status !== 200) break

            const $ = cheerio.load(response.data)

            $('.detailsLink:not(.rel, .promoted-list *)').each((i, data) => {
                const url = $(data).attr('href')

                fs.appendFile(path.join(__dirname, 'databases/urls.txt'), url + '\n', err => {
                    if (err) return console.log(err)
                    console.log("OK!")
                })
            })
        }
    }
}


start(categories)
