var http = require('https');
var sync = require('deasync');

//Data
var user1 = JSON.stringify({
  'name': 'GE Bracket',
  'price': '150',
  'sku': '1_bracket'
});
//Config
var host = 'localhost';
var port = '8080';
var path = '/users/1';
var method = 'POST';
var contentType = 'application/json';
var options = new Object();
var header1 = new Object();
header1['Content-Type'] = contentType;
options['host']=host;
options['port']=port;
options['path']=path;
options['headers']=header1;
//Define method
options['method']=method;

var token = null;
var req = http.request(options, function(res) {
  var msg = '';
  console.log('Request: '+options['path']);
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    msg += chunk;
  });
  res.on('end', function() {
    //token = JSON.parse(msg);
    //logger.info('Token = ' + token);
    console.log('Returne message = ' + msg);
    token = msg;
  });
});
req.write(data);
req.end();
while(token==null) {sync.sleep(50);}
