const express = require('express');
const router = express.Router();
const logger = require('tracer').colorConsole();
const _ = require('lodash');
const uuid = require('shortid');
const pool = require('../db/connection');
const dotenv = require('dotenv');
dotenv.config();

router.get('/company/:id/jobs', async (request, response) => {
  try {
    const query = 'SELECT id,title,posting_date,deadline,location,salary,description,category,\'View Applicants\' as applicants from jobs where company_id=?';
    const rows = await pool.query(query, [request.params.id]);
    return response.json(rows).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching jobs';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});


router.post('/company/:id/jobs', async (request, response) => {
  try {
    const query = 'insert into jobs(id,title,posting_date,deadline,location,salary,description,category,company_id) values(?,?,?,?,?,?,?,?,?)';
    await pool.query(query, [uuid.generate(), request.body.title, request.body.posting_date, request.body.deadline, request.body.location, request.body.salary, request.body.description, request.body.category, request.params.id]);
    return response.json(request.body).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching jobs';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/company/:companyId/job/:jobId/applicants', async (request, response) => {
  try {
    const query = 'SELECT student.name as student_name, student.id as student_id, student.college as student_college,applications.id as application_id,applications.resume as student_resume, applications.applied_on as applied_on,applications.status as status,\'View Resume\' as resume,\'Edit\' as edit from student,jobs,company,applications where jobs.id=? and company.id=? and applications.student_id=student.id and applications.company_id=? and applications.job_id=?';
    const rows = await pool.query(query, [request.params.jobId, request.params.companyId, request.params.companyId, request.params.jobId]);
    return response.json(rows).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching applicants';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.put('/applications/:applicationId', async (request, response) => {
  try {
    const query = 'update applications set status=? where id=?';
    await pool.query(query, [request.body.status, request.params.applicationId]);
    return response.json({ message: 'Update Success' }).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while Updating applicantion Status';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/job/:jobId', async (request, response) => {
  try {
    const query = 'SELECT * from jobs where id=?';
    const rows = await pool.query(query, [request.params.jobId]);
    return response.json(rows).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching jobs details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/company', async (request, response) => {
  try {
    let query = 'SELECT name,email,location,description,contact_num,contact_num,contact_name,contact_email,image from company';
    if (!_.isEmpty(request.query)) {
      query = `SELECT name,email,location,description,contact_num,contact_num,contact_name,contact_email,image from company where id='${request.query.id}'`;
    }
    const rows = await pool.query(query);
    return response.json(rows[0]).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching company details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/company/:id/events', async (request, response) => {
  try {
    const query = 'SELECT id,name,date,time,location,eligibility,description,\'View Registrations\' as applicants from events where company_id=?';
    const rows = await pool.query(query, [request.params.id]);
    return response.json(rows).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching events';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.post('/company/:id/events', async (request, response) => {
  try {
    const query = 'insert into events(id,name,date,time,location,eligibility,description,company_id) values(?,?,?,?,?,?,?,?)';
    await pool.query(query, [uuid.generate(), request.body.name, request.body.date, request.body.time, request.body.location, request.body.eligibility, request.body.description, request.params.id]);
    return response.json(request.body).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while posting events';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/company/:companyId/event/:eventId/applicants', async (request, response) => {
  try {
    const query = 'SELECT student.name as student_name, student.id as student_id, student.college as student_college,registrations.id as registration_id, registrations.registered_on as registered_on from student,events,company,registrations where events.id=? and company.id=? and registrations.student_id=student.id and registrations.company_id=? and registrations.event_id=?';
    const rows = await pool.query(query, [request.params.eventId, request.params.companyId, request.params.companyId, request.params.eventId]);
    return response.json(rows).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching event applicants';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.put('/registrations/:registrationId', async (request, response) => {
  try {
    const query = 'update applications set status=? where id=?';
    await pool.query(query, [request.body.status, request.params.applicationId]);
    return response.json({ message: 'Update Success' }).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while Updating applicantion Status';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.put('/company/:id/profile', async (request, response) => {
  try {
    if (!_.isUndefined(request.body.description)) {
      const query = 'update company set description=? where id=?';
      await pool.query(query, [request.body.description, request.params.id]);
    }
    if (!_.isUndefined(request.body.contact_name)) {
      const query = 'update company set contact_name=?,contact_num=?,contact_email=? where id=?';
      await pool.query(query, [request.body.contact_name, request.body.contact_num, request.body.contact_email, request.params.id]);
    }
    if (!_.isUndefined(request.body.name)) {
      const query = 'update company set name=?,location=? where id=?';
      await pool.query(query, [request.body.name, request.body.location, request.params.id]);
    }
    return response.json({ message: 'Update Success' }).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while Updating company profile';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/event/:id', async (request, response) => {
  try {
    const query = 'select e.id,e.name,e.date,e.time, e.location,e.eligibility,e.description,e.company_id,c.name as company_name,c.image as image from events e,company c where c.id=e.company_id and e.id=?';
    const rows = await pool.query(query, [request.params.id]);
    let status = '';
    if (!_.isEmpty(request.query)) {
      const registrationStatus = 'select * from registrations where student_id=? and event_id=?';
      const studentStatus = await pool.query(registrationStatus, [request.query.studentId, request.params.id]);
      if (!_.isEmpty(studentStatus)) status = 'Applied';
      rows[0].status = status;
    }
    return response.json(rows[0]).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching event details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.post('/event/:eventId/register', async (request, response) => {
  try {
    const query = 'insert into registrations(id,student_id,company_id,event_id,registered_on) values(?,?,?,?,?)';
    const rows = await pool.query(query, [uuid.generate(), request.body.studentId, request.body.companyId, request.params.eventId, new Date().toISOString().slice(0, 10)]);
    return response.json(rows[0]).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching event details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

module.exports = router;
