let app = require('express')();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
var logger = require('tracer').colorConsole()
var _ = require('lodash');
var createError = require('http-errors')
var cors = require('cors');
const uuid = require('shortid');

var pool = require('./db/connection')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//TODO - Change to a efficient CORS
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/healthcheck', (request, response) => {
    console.log("Health Check")
    response.json({
        "message": "Application Running"
    })
})

app.get('/signin', async (request, response) => {
    try {
        const email = request.query.email;
        const password = request.query.password;
        const entity = request.query.persona;
        var query = 'SELECT * from ?? where email = ? and password = ?';
        //var query = 'SELECT * FROM ' + entity + ' where email =\'' + email + '\' and password=\'' + password + '\'';
        var rows = await pool.query(query, [entity, email, password]);
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
            //var companySignupQuery = 'INSERT INTO company(id,name, email, password, location) values(\'' + name + '\',\'' + email + '\',\'' + password + '\',\'' + request.body.location + '\')';
            var companySignupQuery = 'INSERT INTO company(id,name, email, password, location) values(?,?,?,?,?)';
            await pool.query(companySignupQuery, [uuid.generate(), name, email, password, request.body.location]);
        }
        if (entity === 'student') {
            //var studentSignupQuery = 'INSERT INTO student(id,name, email, password, college) values(\'' + name + '\',\'' + email + '\',\'' + password + '\',\'' + request.body.college + '\')';
            var studentSignupQuery = 'INSERT INTO student(id,name, email, password, college) values(?,?,?,?,?)';
            await pool.query(studentSignupQuery, [uuid.generate(), name, email, password, request.body.college]);
        }
        logger.info(JSON.stringify(rows))
        return response.status(200).json({ "message": "Signup Successful" });
    } catch (error) {
        logger.error(JSON.stringify(error))
        let message = error.message ? error.message : 'Error Ocurred at Server'
        let code = error.statusCode ? error.statusCode : 500;
        return response.status(code).json({ "message": message }).status(code)
    }
})

app.get('/company/:id/jobs', async (request, response) => {
    try {
        var query = 'SELECT id,title,posting_date,deadline,location,salary,description,category,\'View Applicants\' as applicants from jobs where company_id=?';
        var rows = await pool.query(query, [request.params.id]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching jobs';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.post('/company/:id/jobs', async (request, response) => {
    try {
        var query = 'insert into jobs(id,title,posting_date,deadline,location,salary,description,category,company_id) values(?,?,?,?,?,?,?,?,?)';
        var rows = await pool.query(query, [uuid.generate(), request.body.title, request.body.posting_date, request.body.deadline, request.body.location, request.body.salary, request.body.description, request.body.category, request.params.id]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(request.body).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching jobs';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.get('/company/:companyId/job/:jobId/applicants', async (request, response) => {
    try {
        var query = 'SELECT student.name as student_name, student.id as student_id, student.college as student_college,applications.id as application_id, applications.applied_on as applied_on,applications.status as status,\'Edit\' as edit from student,jobs,company,applications where jobs.id=? and company.id=? and applications.student_id=student.id and applications.company_id=? and applications.job_id=?';
        var rows = await pool.query(query, [request.params.jobId, request.params.companyId, request.params.companyId, request.params.jobId]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching applicants';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.put('/applications/:applicationId', async (request, response) => {
    try {
        var query = 'update applications set status=? where id=?'
        var rows = await pool.query(query, [request.body.status, request.params.applicationId]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json({ "message": "Update Success" }).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while Updating applicantion Status';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
})

app.get('/job/:jobId', async (request, response) => {
    try {
        var query = 'SELECT * from jobs where id=?';
        var rows = await pool.query(query, [request.params.jobId]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching jobs details';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.get('/students', async (request, response) => {
    try {
        var query = 'SELECT id,name,email,college,city,dob,state,country,mobile,skills,career_objective from student';
        if (!_.isEmpty(request.query)) {
            if (_.isUndefined(request.query.exclude)) {
                var query = 'SELECT id,name,email,college,city,dob,state,country,mobile,skills,career_objective from student where id=\'' + request.query.id + '\'';
            } else {
                var query = 'SELECT id,name,email,college,city,dob,state,country,mobile,skills,career_objective from student where id!=\'' + request.query.id + '\'';
            }
        }
        var rows = await pool.query(query);
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching students details';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.get('/company', async (request, response) => {
    try {
        var query = 'SELECT name,email,location,description,contact_num,contact_num,contact_name,contact_email from company';
        if (!_.isEmpty(request.query)) {
            var query = 'SELECT name,email,location,description,contact_num,contact_num,contact_name,contact_email from company where id=\'' + request.query.id + '\'';
        }
        var rows = await pool.query(query);
        return response.json(rows[0]).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching company details';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.get('/student/:studentId/applications', async (request, response) => {
    try {
        var query = 'select c.name,j.location,j.title,j.deadline,a.status,a.id,a.applied_on from applications a left join jobs j on j.id=a.job_id left join company c on c.id=a.company_id where a.student_id=?';
        var rows = await pool.query(query, [request.params.studentId]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching applications details';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.get('/jobs', async (request, response) => {
    try {
        var query = 'select j.id,j.title,j.posting_date,j.deadline, j.location,j.salary,j.description,j.category,j.company_id,c.name as company_name from jobs j,company c where c.id=j.company_id;'
        var rows = await pool.query(query);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching jobs';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
})

app.get('/student/:studentId/registrations', async (request, response) => {
    try {
        var query = 'select c.name,j.location,j.title,j.deadline,a.status,a.id,a.applied_on from applications a left join jobs j on j.id=a.job_id left join company c on c.id=a.company_id where a.student_id=?';
        var rows = await pool.query(query, [request.params.studentId]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching applications details';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.get('/events', async (request, response) => {
    try {
        var query = 'select j.id,j.title,j.posting_date,j.deadline, j.location,j.salary,j.description,j.category,j.company_id,c.name as company_name from jobs j,company c where c.id=j.company_id;'
        var rows = await pool.query(query);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching jobs';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
})

app.get('/company/:id/events', async (request, response) => {
    try {
        var query = 'SELECT id,name,date,time,location,eligibility,description,\'View Registrations\' as applicants from events where company_id=?';
        var rows = await pool.query(query, [request.params.id]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching events';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.post('/company/:id/events', async (request, response) => {
    try {
        var query = 'insert into events(id,name,date,time,location,eligibility,description,company_id) values(?,?,?,?,?,?,?,?)';
        var rows = await pool.query(query, [uuid.generate(), request.body.name, request.body.date, request.body.time, request.body.location, request.body.eligibility, request.body.description, request.params.id]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(request.body).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while posting events';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.get('/company/:companyId/event/:eventId/applicants', async (request, response) => {
    try {
        var query = 'SELECT student.name as student_name, student.id as student_id, student.college as student_college,registrations.id as registration_id, registrations.registered_on as registered_on from student,events,company,registrations where events.id=? and company.id=? and registrations.student_id=student.id and registrations.company_id=? and registrations.event_id=?';
        var rows = await pool.query(query, [request.params.eventId, request.params.companyId, request.params.companyId, request.params.eventId]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching event applicants';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.put('/registrations/:registrationId', async (request, response) => {
    try {
        var query = 'update applications set status=? where id=?'
        var rows = await pool.query(query, [request.body.status, request.params.applicationId]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json({ "message": "Update Success" }).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while Updating applicantion Status';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
})

app.get('/event/:eventId', async (request, response) => {
    try {
        var query = 'SELECT * from events where id=?';
        var rows = await pool.query(query, [request.params.eventId]);
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json(rows).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching event details';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.put('/company/:id/profile', async (request, response) => {
    try {
        if (!_.isUndefined(request.body.description)) {
            var query = 'update company set description=? where id=?'
            var rows = await pool.query(query, [request.body.description, request.params.id]);
        }
        if (!_.isUndefined(request.body.contact_name)) {
            var query = 'update company set contact_name=?,contact_num=?,contact_email=? where id=?'
            var rows = await pool.query(query, [request.body.contact_name, request.body.contact_num, request.body.contact_email, request.params.id]);
        }
        if (!_.isUndefined(request.body.name)) {
            var query = 'update company set name=?,location=? where id=?'
            var rows = await pool.query(query, [request.body.name, request.body.location, request.params.id]);
        }
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json({ "message": "Update Success" }).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while Updating company profile';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
})

app.put('/student/:id/profile', async (request, response) => {
    try {
        if (!_.isUndefined(request.body.objective)) {
            var query = 'update student set career_objective=? where id=?'
            var rows = await pool.query(query, [request.body.objective, request.params.id]);
        }
        if (!_.isUndefined(request.body.contact_name)) {
            var query = 'update company set contact_name=?,contact_num=?,contact_email=? where id=?'
            var rows = await pool.query(query, [request.body.contact_name, request.body.contact_num, request.body.contact_email, request.params.id]);
        }
        if (!_.isUndefined(request.body.name)) {
            var query = 'update company set name=?,location=? where id=?'
            var rows = await pool.query(query, [request.body.name, request.body.location, request.params.id]);
        }
        logger.debug("Response from DB:" + JSON.stringify(rows))
        return response.json({ "message": "Update Success" }).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while Updating student profile';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
})

app.get('/student/:id/profile', async (request, response) => {
    try {
        var queryForStudent = 'SELECT id,name,email,college,city,dob,state,country,mobile,skills,career_objective from student where id=?';
        var studentInfo = await pool.query(queryForStudent, [request.params.id]);
        var queryForEducation = 'select * from education where student_id=?';
        var educationInfo = await pool.query(queryForEducation, [request.params.id]);
        var queryForExperience = 'select * from experience where student_id=?';
        var experienceInfo = await pool.query(queryForExperience, [request.params.id]);
        studentInfo[0].education = _.sortBy(educationInfo, ['year_of_passing']);
        studentInfo[0].experience = _.sortBy(experienceInfo, ['start_date']);
        return response.json(studentInfo[0]).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex))
        let message = ex.message ? ex.message : 'Error while fetching applications details';
        let code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ "message": message })
    }
});

app.listen(8080, function () {
    console.log("App listening on port 8080");
});