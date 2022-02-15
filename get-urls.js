'use strict'
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const path = require('path')


const categories = [
    'https://www.olx.uz/oz/uslugi/stroitelstvo-otdelka-remont/stroitelnye-uslugi/',
    'https://www.olx.uz/oz/uslugi/stroitelstvo-otdelka-remont/dizayn-arhitektura/',
    'https://www.olx.uz/oz/uslugi/stroitelstvo-otdelka-remont/otdelka-remont/',
    'https://www.olx.uz/oz/uslugi/stroitelstvo-otdelka-remont/okna-dveri-balkony/',
    'https://www.olx.uz/oz/uslugi/stroitelstvo-otdelka-remont/santehnika-kommunikatsii/',
    'https://www.olx.uz/oz/uslugi/stroitelstvo-otdelka-remont/bytovoy-remont-uborka/',
    'https://www.olx.uz/oz/uslugi/stroitelstvo-otdelka-remont/elektrika/',
    'https://www.olx.uz/oz/uslugi/stroitelstvo-otdelka-remont/ventilyatsiya-konditsionirovanie/',
    // 'https://www.olx.uz/oz/uslugi/perevozki-arenda-transporta/',
    // 'https://www.olx.uz/oz/uslugi/reklama-marketing-pr/',
    // 'https://www.olx.uz/oz/uslugi/syre-materialy/',
    // 'https://www.olx.uz/oz/uslugi/oborudovanie/',
    // 'https://www.olx.uz/oz/uslugi/obsluzhivanie-remont-tehniki/remont-i-ustanovka-sputnikovogo-tv/',
    // 'https://www.olx.uz/oz/uslugi/obsluzhivanie-remont-tehniki/bytovaya-tehnika/',
    // 'https://www.olx.uz/oz/uslugi/obsluzhivanie-remont-tehniki/mobilnye-ustroystva-telefoniya/',
    // 'https://www.olx.uz/oz/uslugi/obsluzhivanie-remont-tehniki/kompyuternaya-tehnika-igrovye-pristavki/',
    // 'https://www.olx.uz/oz/uslugi/obsluzhivanie-remont-tehniki/foto-video-audio-tehnika/',
    // 'https://www.olx.uz/oz/uslugi/obsluzhivanie-remont-tehniki/klimaticheskaya-tehnika/',
    // 'https://www.olx.uz/oz/uslugi/obsluzhivanie-remont-tehniki/postavka-remont-obsluzhivanie-oborudovaniya/',
    // 'https://www.olx.uz/oz/uslugi/prokat-tovarov/',
    // 'https://www.olx.uz/oz/uslugi/prochie-usligi/',
    // 'https://www.olx.uz/oz/uslugi/finansovye-uslugi/',
    // 'https://www.olx.uz/oz/uslugi/nyani-sidelki/',
    // 'https://www.olx.uz/oz/uslugi/krasota-zdorove/',
    // 'https://www.olx.uz/oz/uslugi/obrazovanie/',
    // 'https://www.olx.uz/oz/uslugi/uslugi-dlya-zhivotnyh/',
    // 'https://www.olx.uz/oz/uslugi/prodazha-biznesa/',
    // 'https://www.olx.uz/oz/uslugi/razvlechenie-foto-video/',
    // 'https://www.olx.uz/oz/uslugi/turizm/',
    // 'https://www.olx.uz/oz/uslugi/uslugi-perevodchikov-nabor-teksta/',
    // 'https://www.olx.uz/oz/uslugi/avto-moto-uslugi/',
    // 'https://www.olx.uz/oz/uslugi/yuridicheskie-uslugi/'
]


async function start(categories) {
    const PAGE = 25

    for (const category of categories) {
        for (let page = 1; page <= PAGE; page++) {
            const response = await axios(`${category}?page=${page}`)

            if (response.status !== 200) break

            const $ = cheerio.load(response.data)

            $('.detailsLink:not(.rel)').each((i, data) => {
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
