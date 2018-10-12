require('http').get('http://f5ceec5b.ngrok.io', (res) => {
    res.setEncoding('utf8');
    res.on('data', function (body) {
        console.log(body);
    });
});