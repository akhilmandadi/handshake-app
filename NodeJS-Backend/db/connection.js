var mysql = require('mysql');
var util = require('util');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'akhilmandadi',
    password: 'akhilmandadi',
    database: 'handshake'
})
pool.getConnection((error, connection) => {
    if (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused by Database')
        }
        if (error.code === 'ER_CON_COUNT_ERROR') {
            console.error('Connection limit reached for Database')
        }
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Connection was closed.')
        }
    }
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query)

module.exports = pool