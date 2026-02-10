const dns = require('dns');
console.log('Resolving SRV for _mongodb._tcp.cluster0.dirkz0c.mongodb.net');
dns.resolveSrv('_mongodb._tcp.cluster0.dirkz0c.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('DNS Resolution Error:', err);
    } else {
        console.log('SRV Records:', addresses);
    }
});
