"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const maxmind = require('maxmind');
const ipV4 = require('ip-address').Address4;
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = lowdb(adapter);

db.defaults({ authorization: []}).write();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.post('/resources', function (req, res) {
  
  let params = req.body;
  let keysSet = new Set(Object.keys(params));
  
  if (!(keysSet.has("name") && keysSet.has("context")))
    return res.status(400).send({ error: 'parameters not match' });
  if (!(keysSet.has("ipRange")||keysSet.has("location"))) 
    return res.status(403).send({ error: 'ipRange or location not specified' });
  getCityByIp(params.ipRange)
  .then((city) => {
    params.location = city;
  })
  .then(() => {
    db.get('authorization')
    .push(params)
    .write()
  })
  .then(() => {
    res.status(201).send();
  })
  .catch((err) => {
    console.log(err);
    res.status(400).send(err);
  })
})

 
app.get('/resources*', function (req, res) {
  
  let params = req.query;
  
  if (!params.ip) return res.status(401).send({ error: 'no ip' });
  getCityByIp(params.ip)
  .then((city) => {
    params.location = city;
    params.name = req.url.slice(req.url.lastIndexOf('/')+1, req.url.indexOf('?'));
    if (params.name == '') return res.status(403).send("name error");
  })
  .then(() => {
    return db.get('authorization')
    .find({ 'name': params.name })
    .value();
  })
  .then((record) => {
    if (!record) return res.status(403).send("not record with this name");
    if (record.location != params.location) return res.status(403).send("access not allowed");
    return res.status(200).send("Your password is: "+ record.context);
  })
  .catch((err) => {
    console.log("err", err);
    return res.status(401).send(err);
  })
})

app.listen(8080, function(){
  console.log('app listening on port: 8080'); 
})

function getCityByIp(ipAddress){
  return new Promise(function(resolve, reject) {
    let address = new ipV4(ipAddress);
    if(!address.isValid(ipAddress)) return reject("ip not valid");
    maxmind.open('node_modules/geolite2/dbs/GeoLite2-City.mmdb').then((lookup) => {
      resolve(lookup.get(ipAddress).city.names.en);
    });
  });
}

