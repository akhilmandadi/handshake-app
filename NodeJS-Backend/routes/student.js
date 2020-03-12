const express = require('express');
const router = express.Router();
const logger = require('tracer').colorConsole();
const _ = require('lodash');
const uuid = require('shortid');
const pool = require('../db/connection');
const dotenv = require('dotenv');
dotenv.config();

router.get('/student/:studentId/applications', async (request, response) => {
  try {
    const query = 'select c.name,j.location,j.title,j.deadline,a.status,a.id,a.applied_on,c.image as image from applications a left join jobs j on j.id=a.job_id left join company c on c.id=a.company_id where a.student_id=?';
    const rows = await pool.query(query, [request.params.studentId]);
    return response.json(rows).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching applications details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

const filterJobs = async (jobs, applications) => {
  for (const job of jobs) {
    job.applied = '';
    for (const application of applications) {
      if (job.id === application.job_id) {
        job.applied = 'Applied';
      }
    }
  }
  return jobs;
};

router.get('/jobs', async (request, response) => {
  try {
    const query = 'select j.id,j.title,j.posting_date,j.deadline, j.location,j.salary,j.description,j.category,j.company_id,c.name as company_name,c.image as image from jobs j,company c where c.id=j.company_id and DATE(j.deadline) >= CURRENT_DATE();';
    const jobs = JSON.stringify(await pool.query(query));
    const applicationsQuery = 'select job_id from applications where student_id=?';
    const applications = JSON.stringify(await pool.query(applicationsQuery, [request.query.studentId]));
    const jobsData = await filterJobs(JSON.parse(jobs), JSON.parse(applications));
    return response.json(jobsData).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching jobs';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.put('/student/:id/profile', async (request, response) => {
  try {
    if (!_.isUndefined(request.body.objective)) {
      const query = 'update student set career_objective=? where id=?';
      await pool.query(query, [request.body.objective, request.params.id]);
    }
    if (!_.isUndefined(request.body.college_name)) {
      const {
        college_name, degree, major, month_of_starting, year_of_starting, month_of_passing, year_of_passing, cgpa, id,
      } = request.body;
      const query = 'update education set college_name=?,degree=?,major=?,month_of_starting=?,year_of_starting=?,month_of_passing=?,year_of_passing=?,cgpa=? where id=?';
      await pool.query(query, [college_name, degree, major, month_of_starting, year_of_starting, month_of_passing, year_of_passing, cgpa, id]);
    }
    if (!_.isUndefined(request.body.company)) {
      const {
        company, title, location, year_of_starting, month_of_starting, year_of_ending, month_of_ending, description, id,
      } = request.body;
      const query = 'update experience set company=?, title=?, location=?, year_of_starting=?, month_of_starting=?, year_of_ending=?, month_of_ending=?, description=? where id=?';
      await pool.query(query, [company, title, location, year_of_starting, month_of_starting, year_of_ending, month_of_ending, description, id]);
    }
    if (!_.isUndefined(request.body.name)) {
      const query = 'update student set name=? where id=?';
      await pool.query(query, [request.body.name, request.params.id]);
    }
    if (!_.isUndefined(request.body.skills)) {
      const query = 'update student set skills=? where id=?';
      await pool.query(query, [request.body.skills, request.params.id]);
    }
    if (!_.isUndefined(request.body.email)) {
      const query = 'update student set email=?,mobile=?,city=?,state=?,country=?,dob=? where id=?';
      await pool.query(query, [request.body.email, request.body.mobile, request.body.city, request.body.state, request.body.country, request.body.dob, request.params.id]);
    }
    return response.json({ message: 'Update Success' }).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while Updating student profile';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.post('/student/:id/profile', async (request, response) => {
  try {
    if (!_.isUndefined(request.body.education)) {
      const {
        college_name, degree, major, month_of_starting, year_of_starting, month_of_passing, year_of_passing, cgpa,
      } = request.body.education;
      const query = 'insert into education(id,college_name,degree,major,month_of_starting,year_of_starting,month_of_passing,year_of_passing,cgpa,student_id) values(?,?,?,?,?,?,?,?,?,?);';
      await pool.query(query, [uuid.generate(), college_name, degree, major, month_of_starting, year_of_starting, month_of_passing, year_of_passing, cgpa, request.params.id]);
    }
    if (!_.isUndefined(request.body.experience)) {
      const {
        company, title, location, year_of_starting, month_of_starting, year_of_ending, month_of_ending, description,
      } = request.body.experience;
      const query = 'insert into experience(id,company, title, location, year_of_starting,month_of_starting,year_of_ending,month_of_ending, description,student_id) values(?,?,?,?,?,?,?,?,?,?);';
      await pool.query(query, [uuid.generate(), company, title, location, year_of_starting, month_of_starting, year_of_ending, month_of_ending, description, request.params.id]);
    }
    return response.json({ message: 'Save Success' }).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while Saving student education';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.delete('/student/:id/profile', async (request, response) => {
  try {
    if (request.query.entity === 'education') {
      const query = 'delete from education where id=?';
      await pool.query(query, [request.query.id]);
    }
    if (request.query.entity === 'experience') {
      const query = 'delete from experience where id=?';
      await pool.query(query, [request.query.id]);
    }
    return response.json({ message: 'Delete Success' }).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while deleting student education';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/student/:id/profile', async (request, response) => {
  try {
    const queryForStudent = 'SELECT id,name,email,college,city,dob,state,country,mobile,skills,career_objective,image from student where id=?';
    const studentInfo = await pool.query(queryForStudent, [request.params.id]);
    const queryForEducation = 'select * from education where student_id=? order by year_of_passing DESC';
    const educationInfo = await pool.query(queryForEducation, [request.params.id]);
    const queryForExperience = 'select * from experience where student_id=? order by year_of_starting DESC';
    const experienceInfo = await pool.query(queryForExperience, [request.params.id]);
    studentInfo[0].education = educationInfo;
    studentInfo[0].experience = experienceInfo;
    return response.json(studentInfo[0]).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching applications details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

const fetchProfileInfo = async (id) => {
  const queryForStudent = 'SELECT id,name,email,college,city,dob,state,country,mobile,skills,career_objective,image from student where id=?';
  const studentInfo = await pool.query(queryForStudent, [id]);
  const queryForEducation = 'select * from education where student_id=? order by year_of_passing DESC';
  const educationInfo = await pool.query(queryForEducation, [id]);
  const queryForExperience = 'select * from experience where student_id=? order by year_of_starting DESC';
  const experienceInfo = await pool.query(queryForExperience, [id]);
  studentInfo[0].education = educationInfo;
  studentInfo[0].experience = experienceInfo;
  return studentInfo[0];
};

router.get('/student/profiles', async (request, response) => {
  try {
    let studentIds = `SELECT id from student where id!='${request.query.id}'`;
    if (_.isEmpty(request.query)) studentIds = 'SELECT id from student';
    let idsToFetch = await pool.query(studentIds);
    idsToFetch = JSON.stringify(idsToFetch);
    const studentProfiles = [];
    for (const student of JSON.parse(idsToFetch)) {
      const profile = await fetchProfileInfo(student.id);
      studentProfiles.push(profile);
    }
    return response.json(studentProfiles).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching profile details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/events', async (request, response) => {
  try {
    const query = 'select e.id,e.name,e.date,e.time, e.location,e.eligibility,e.description,e.company_id,c.name as company_name,c.image as image from events e,company c where c.id=e.company_id and DATE(e.date) >= CURRENT_DATE() order by e.date asc';
    const rows = await pool.query(query);
    return response.json(rows).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching events';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

router.get('/student/:studentId/registrations', async (request, response) => {
  try {
    const query = 'select c.name as company_name,c.image as image,e.location,e.name,e.date,e.time,e.location,r.id,r.registered_on from registrations r left join events e on e.id=r.event_id left join company c on c.id=r.company_id where r.student_id=? and DATE(e.date) >= CURRENT_DATE()';
    const rows = await pool.query(query, [request.params.studentId]);
    return response.json(rows).status(200);
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while fetching registrations details';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

module.exports = router;
