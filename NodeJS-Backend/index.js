const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const AWS = require('aws-sdk');
const logger = require('tracer').colorConsole();
const commonRoutes = require('./routes/common');
const companyRoutes = require('./routes/company');
const studentRoutes = require('./routes/student');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({ origin: process.env.REACT_URL, credentials: true }));

const pool = require('./db/connection');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  sessionToken: process.env.SESSION_TOKEN,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, './public/resume');
    } else {
      cb(null, './public/images');
    }
  },
  filename: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, req.query.id + path.extname(file.originalname));
    } else {
      cb(null, req.params.id + path.extname(file.originalname));
    }
  },
});
const upload = multer({
  storage,
});

app.get('/healthcheck', (request, response) => {
  logger.debug('Health Check');
  response.json({
    message: 'Application Running',
  });
});

app.post('/student/:id/image', upload.single('image'), async (request, response) => {
  try {
    if (request.file) {
      const fileContent = fs.readFileSync(`./public/images/${request.params.id}${path.extname(request.file.originalname)}`);
      const query = 'update student set image=? where id=?';
      const rows = await pool.query(query, [fileContent, request.params.id]);
      return response.json(rows).status(200);
    }
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while uploading image';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});
  
app.post('/company/:id/image', upload.single('image'), async (request, response) => {
  try {
    if (request.file) {
      const fileContent = fs.readFileSync(`./public/images/${request.params.id}${path.extname(request.file.originalname)}`);
      const query = 'update company set image=? where id=?';
      const rows = await pool.query(query, [fileContent, request.params.id]);
      return response.json(rows).status(200);
    }
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while uploading image';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});
  
app.post('/company/:companyId/job/:jobId/student/:studentId/apply', upload.single('resume'), async (request, response) => {
  try {
    if (request.file) {
      const fileContent = fs.readFileSync(`./public/resume/${request.query.id}${path.extname(request.file.originalname)}`);
      const params = {
        Bucket: 'handshakeimages',
        Key: request.query.id + path.extname(request.file.originalname),
        Body: fileContent,
        ContentType: request.file.mimetype,
      };
      s3.upload(params, (err, data) => {
        if (err) {
          return response.status(500).json({ error: err.message });
        }
        const query = 'insert into applications(id,student_id,company_id,job_id,status,applied_on,resume) values(?,?,?,?,?,?,?)';
        pool.query(query, [request.query.id, request.params.studentId, request.params.companyId, request.params.jobId, 'Applied', new Date().toISOString().slice(0, 10), data.Location], (error) => {
          if (error) return response.status(500).json({ error: error.message });
          return response.status(200).json({ message: 'File Upload Success' });
        });
      });
    }
  } catch (ex) {
    logger.error(JSON.stringify(ex));
    const message = ex.message ? ex.message : 'Error while uploading resume';
    const code = ex.statusCode ? ex.statusCode : 500;
    return response.status(code).json({ message });
  }
});

app.use(commonRoutes);
app.use(studentRoutes);
app.use(companyRoutes);

app.listen(8080, () => {
  logger.debug('App listening on port 8080');
});

module.exports = app;
