let app = require('express')();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
var logger = require('tracer').colorConsole()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var pool = require('./db/connection')

app.get('/healthcheck', (request, response) => {
    console.log("Health Check")
    response.json({
        "message": "Application Running"
    })
})

app.get('/login', async (request, response) => {
    try {
        const companyEmail = request.query.email;
        const password = request.query.password;
        const entity = request.query.persona;
        var query = 'SELECT * FROM ' + entity + ' where email =\'' + companyEmail + '\' and password=\'' + password + '\'';
        var rows = await pool.query(query);
        logger.info(JSON.stringify(rows))
        response.json(rows);
    } catch {
        response.json({ "message": "Error in fetching credentials" })
    }

});

app.post('/signup', (request, response) => {
    response.json({ "message": "message" })
})

app.listen(8080, function () {
    console.log("App listening on port 8080");
});