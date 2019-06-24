"use strict";

const express = require('express');
const app = express();
const maxmind = require('maxmind');
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(80);

maxmind.open('/path/to/GeoLite2-City.mmdb').then((lookup) => {
  console.log(lookup.get('66.6.44.4'));
});

maxmind.open('/path/to/GeoOrg.mmdb').then((lookup) => {
  console.log(lookup.get('66.6.44.4'));
});