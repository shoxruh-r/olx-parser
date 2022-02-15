const fs = require('fs')
const path = require('path')


fs.readFile(path.join(__dirname, 'databases/urls.txt'), 'utf8', (e, urls) => {
    if (e) return console.error(e)
    urls = urls.split('\n').length - 1

    fs.readFile(path.join(__dirname, 'databases/olx.csv'), 'utf8', (e, ads) => {
        if (e) return console.error(e)

        ads = ads.split('\n').length - 1
        console.log(`${ads} ta olindi. ${urls - ads} ta qoldi.`)
    })

})
