const sql = require('mssql')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 5050 });
const connection = sql.connect({
    user: 'sa',
    password: 'test1234',
    server: 'ITECNP-PAG', // You can use 'localhost\\instance' to connect to named instance
    database: 'SDS',

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
});

const sqlCon = new Promise(function(resolve, reject) {
    connection.then(function(con) {
        resolve(con);
    }).catch(function(err) {
        reject(err);
    });

});



wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log( message);
        var request = JSON.parse(message)
        sqlCon.then(function(con) {

            con.request().query(request.query).then(function(result) {

                ws.send(JSON.stringify({
                    id: request.id,
                    data: result.recordset
                }));
            }).catch(function(err) {
                console.log(err)
            });

        })
    });

    // ws.send('something');
});




/*
  con.request().query('select 1 as x').then(function(result) {
        console.log(result)
    }).catch(function(err) {
        console.log(err)
    });
 */