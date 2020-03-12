const express = require('express');
const router = express.Router();
const logger = require('tracer').colorConsole();
const _ = require('lodash');
const createError = require('http-errors');
const uuid = require('shortid');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pool = require('../db/connection');

router.get('/signin', async (request, response) => {
  try {
    const { email } = request.query;
    const entity = request.query.persona;
    const query = 'SELECT * from ?? where email = ?';
    const rows = await pool.query(query, [entity, email]);
    if (_.isEmpty(rows)) {
      throw createError(401, 'Invalid Credentials');
    }
    return response.json(rows[0]).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching credentials';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.post('/signup', async (request, response) => {
  try {
    const entity = request.query.persona;
    const { email } = request.body;
    const { password } = request.body;
    const { name } = request.body;
  
    const query = `SELECT * FROM ${entity} where email ='${email}'`;
    const rows = await pool.query(query);
    if (rows.length === 1) {
      throw createError(409, 'Email Id already registered. Try logging in');
    }
    if (entity === 'company') {
      const companySignupQuery = 'INSERT INTO company(id,name, email, password, location) values(?,?,?,?,?)';
      await pool.query(companySignupQuery,
        [uuid.generate(), name, email, password, request.body.location]);
    }
    if (entity === 'student') {
      const studentSignupQuery = 'INSERT INTO student(id,name, email, password, college) values(?,?,?,?,?)';
      await pool.query(studentSignupQuery,
        [uuid.generate(), name, email, password, request.body.college]);
    }
    return response.status(200).json({ message: 'Signup Successful' });
  } catch (error) {
    logger.error(JSON.stringify(error));
    const message = error.message ? error.message : 'Error Ocurred at Server';
    const code = error.statusCode ? error.statusCode : 500;
    return response.status(code).json({ message }).status(code);
  }
});

router.get('/students', async (request, response) => {
  try {
    let query = 'SELECT id,name,email,college,city,dob,state,country,mobile,skills,career_objective from student';
    if (!_.isEmpty(request.query)) {
      if (_.isUndefined(request.query.exclude)) {
        query = `SELECT id,name,email,college,city,dob,state,country,mobile,skills,career_objective from student where id='${request.query.id}'`;
      } else {
        query = `SELECT id,name,email,college,city,dob,state,country,mobile,skills,career_objective from student where id!='${request.query.id}'`;
      }
    }
    const rows = await pool.query(query);
    return response.json(rows).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching students details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

module.exports = router;
