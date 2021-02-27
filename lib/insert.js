let http = require('http')
let fs = require('fs')
let path = require('path')
let chalk = require('chalk')
let figlet = require('figlet')

let auth = require('./Auth')
let props = require('../props')

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

module.exports = {
    postData(entity, filepath, xml, verbose){
        let url = props.baseUrl + entity
        fs.access(filepath, fs.F_OK, (err)=>{
            if (err) {
                console.log(chalk.red(`File ${filepath} doesn't exist`))
            }else{
                fs.readFile(filepath, ((err1, data) => {
                    if (err1) console.log(chalk.red(`cannot read file ${filepath}`))
                    else {
                        let body = data.toString('utf-8')

                        http.get(options,(response)=>{
                            let reqOptions = {
                                headers : {
                                    'Content-Type' : xml===true ? 'application/xml':'application/json',
                                    'Authorization' : auth.getAuthString(),
                                    'x-csrf-token' : response.headers['x-csrf-token'],
                                    'Cookie' : response.headers['set-cookie'],
                                    'Accept' : xml===true ? 'application/xml':'application/json'
                                },
                                hostname : props.urlOptions.hostname,
                                port : props.urlOptions.port,
                                path : `${props.urlOptions.path}${entity}`,
                                method: 'POST'
                            }

                            let req = http.request(reqOptions, (res) => {
                                let content = '', success =true
                                if (res.statusCode!==201){
                                    success=false
                                    console.log(chalk.red('Something went wrong'))
                                    process.stdout.write(chalk.yellowBright('Response Body :'))
                                }
                                res.on('data', (chunk)=> content+=chunk)
                                res.on('end',()=>{
                                    if (!success || verbose){
                                        console.log(content)
                                    }
                                    console.log(`Response status code :${chalk.yellowBright(res.statusCode)}`)
                                    if (success){
                                        console.log(chalk.green(figlet.textSync('CREATED',{horizontalLayout:'full'})))
                                    }
                                })
                                res.on('error',err2 => {
                                    err2.printStackTrace()
                                })
                            });

                            req.write(body)
                            req.end()
                        })
                    }
                }))
            }
        })
    }
}