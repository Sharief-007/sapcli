let http = require('http')
let path = require('path')
let chalk = require('chalk')
let figlet = require('figlet')

let props = require('../props')
let auth = require('./Auth')

let options = {
    headers: {
        'Authorization': auth.getAuthString(),
        'x-csrf-token': 'fetch'
    },
    hostname : props.urlOptions.hostname,
    port : props.urlOptions.port,
    path : props.urlOptions.path,
    method: 'GET'
}

module.exports ={
    deleteData(entity, key){
        let url = `${props.baseUrl}${entity}('${key}')`
        http.get(options,(response)=> {
            let reqOptions = {
                headers: {
                    'Authorization': auth.getAuthString(),
                    'x-csrf-token': response.headers['x-csrf-token'],
                    'Cookie': response.headers['set-cookie']
                },
                hostname: props.urlOptions.hostname,
                port: props.urlOptions.port,
                path: `${props.urlOptions.path}${entity}('${key}')`,
                method: 'DELETE'
            }
            let req = http.request(reqOptions, res => {
                res.on('data',chunk => process.stdout.write(chunk))
                res.on('end',()=> {
                    console.log(`Response status code : ${res.statusCode}`)
                    if (res.statusCode===204) console.log(chalk.green(figlet.textSync('DELETED',{horizontalLayout:'full'})))
                })
            })
            req.end()
        })
    }
}