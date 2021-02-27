let http = require('http')
let chalk = require('chalk')
let figlet = require('figlet')
let path = require('path')

let auth = require('./Auth')
let props = require('../props')

let options = {
    headers: {
        'Authorization': auth.getAuthString(),
        'x-csrf-token': 'fetch'
    }
}
module.exports = {
    getMetaData(){
        let url = `${props.baseUrl}$metadata`

        http.get(url, options, (res)=>{
            let banner = figlet.textSync('SAPCLI',{horizontalLayout : 'full'})
            let bannersStr = res.statusCode===200 ? chalk.green(banner) : chalk.red(banner)
            console.log(bannersStr)

            res.on('data', chunk => {
                process.stdout.write(chunk)
            })
        })
    },
    getData(entity) {
        let url = path.join(props.baseUrl,`${entity}?$format=json`).toString()
        http.get(url, options, (res)=>{
            res.on('data', chunk => {
                process.stdout.write(chunk)
            })
        })
    },
    queryData(entity, key, xml){
        let url = ''
        if (xml===true){
            url = path.join(props.baseUrl,`${entity}('${key}')`).toString()
        }else{
            url = path.join(props.baseUrl,`${entity}('${key}')?$format=json`).toString()
        }
        http.get(url, options, (response)=>{
            if (response.statusCode===404) {
                console.log(chalk.red(figlet.textSync('Not Found',{horizontalLayout:'full'})))
                return
            }
            response.on('data',chunk => process.stdout.write(chunk))
        })
    }
}