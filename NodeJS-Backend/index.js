let app = require('express')();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
var logger = require('tracer').colorConsole()
var _ = require('lodash');
var createError = require('http-errors')

var pool = require('./db/connection')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/healthcheck', (request, response) => {
    console.log("Health Check")
    response.json({
        "message": "Application Running"
    })
})

app.get('/login', async (request, response) => {
    try {
        const email = request.query.email;
        const password = request.query.password;
        const entity = request.query.persona;
        var query = 'SELECT * FROM ' + entity + ' where email =\'' + email + '\' and password=\'' + password + '\'';
        var rows = await pool.query(query);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        if (_.isEmpty(rows)) {
            throw createError(401, "Invalid Credentials")
        }
        delete rows[0]["password"];
        return response.json(rows[0]).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching credentials';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.post('/signup', async (request, response) => {
    try {
        const entity = request.query.persona;
        const email = request.body.email;
        const password = request.body.password;
        const name = request.body.name;

        var query = 'SELECT * FROM ' + entity + ' where email =\'' + email + '\'';
        var rows = await pool.query(query);
        if (rows.length === 1) {
            throw createError(409, "Email Id already registered. Try logging in")
        }
        if (entity === 'company') {
            var companySignupQuery = 'INSERT INTO company(name, email, password, location) values(\'' + name + '\',\'' + email + '\',\'' + password + '\',\'' + request.body.location + '\')';
            await pool.query(companySignupQuery);
        }
        if (entity === 'student') {
            var studentSignupQuery = 'INSERT INTO student(name, email, password, college) values(\'' + name + '\',\'' + email + '\',\'' + password + '\',\'' + request.body.college + '\')';
            await pool.query(studentSignupQuery);
        }
        logger.info(JSON.stringify(rows))
        return response.status(200).json({ "message": "Signup Successful" });
    } catch (error) {
        let message = error.message ? error.message : 'Error Ocurred at Server'
        let code = error.statusCode ? error.statusCode : 500;
        return response.status(code).json({ "message": message }).status(code)
    }
})

app.listen(8080, function () {
    console.log("App listening on port 8080");
});