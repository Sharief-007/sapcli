#!/usr/bin/env node
let cli = require('commander');
let httpGet = require('./lib/HttpGet')
let httpPost = require('./lib/insert')
let httpDelete = require('./lib/delete')
let httpPut = require('./lib/update')

cli.version('0.0.1');

cli.command('init')
    .description('Shows the number of Entity Sets in OData Service')
    .action(httpGet.getMetaData);

cli.command('get <entity>')
    .description('Get all entities from EntitySet')
    .action((entity)=> httpGet.getData(entity));

cli.command('query <entity>')
    .requiredOption('-K, --key <key>','query the odata service with key')
    .option('--xml','Xml response', false)
    .description('query odata service with key')
    .action((entity, options)=> httpGet.queryData(entity, options.key, options.xml))

cli.command('insert <entity> ')
    .description('post data to the odata service')
    .requiredOption('-F, --file <path>', 'path to the file')
    .option('-X, --xml','xml body', false)
    .option('--verbose','display response body', false)
    .action((entity, options)=> httpPost.postData(entity, options.file, options.xml, options.verbose))

cli.command('update <entity>')
    .description('update data to the odata service')
    .requiredOption('-F --file <path>','path to the file')
    .requiredOption('-K, --key <key>','value of key field')
    .option('-X, --xml','xml body', false)
    .action((entity, options)=> httpPut.updateData(entity, options.key, options.file, options.xml))

cli.command('delete <entity>')
    .description('delete data request to the odata service')
    .requiredOption('-K, --key <key>','value of key field')
    .action((entity, options)=>{
        httpDelete.deleteData(entity, options.key)
    })

cli.parse(process.argv);
if (!cli.args.length){
    cli.help()
}