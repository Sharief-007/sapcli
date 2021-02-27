let props = require('../props')

let credentials = props.username+":"+props.password

module.exports= {
    getAuthString(){
        return `Basic ${Buffer.from(credentials).toString('base64')}`
    }
}