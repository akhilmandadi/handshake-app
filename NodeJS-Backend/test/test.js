const chai = require('chai');
chai.use(require('chai-http'));
const { expect } = require('chai');
const app = require('../index');
const agent = require('chai').request.agent(app);


describe('Handshake Testing', () => {
  it('GET /signin - Authenticate User with Invalid Credentials', (done) => {
    agent.get('/signin?email=user@example.com&persona=student')
      .then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Invalid Credentials');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('POST /company/:id/jobs - Post a New Job', (done) => {
    const data = {
      title: 'Software Engineer',
      deadline: '2020-04-30',
      location: 'New York',
      salary: '50',
      description: 'React JS Software Engineer',
      category: 'Internship',
      posting_date: '2020-03-10',
    };
    agent.post('/company/1/jobs')
      .send(data)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal('Software Engineer');
        expect(response.body.category).to.equal('Internship');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('Chaecking the status of a Particular Job a Student Applied: GET /student/:studentId/applications', (done) => {
    agent.get('/student/-T1UjbfE/applications')
      .then((response) => {
        expect(response.body[2].title).to.equal('SDE I');
        expect(response.body[2].location).to.equal('Hyd');
        expect(response.body[2].status).to.equal('Reviewed');
        expect(response.status).to.equal(200);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('PUT /applications/:applicationId - Update the Appliation status of a Job', (done) => {
    const data = {
      status: 'Reviewed'
    };
    agent.put('/applications/kRdV465d')
      .send(data)
      .then((response) => {
        expect(response.body.message).to.equal('Update Success');
        expect(response.status).to.equal(200);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('POST /event/:eventId/register - Register for an Event', (done) => {
    const data = {
      studentId: '-T1UjbfE',
      companyId: '36DJANX3',
    };
    agent.post('/event/N1QPlGdU/register')
      .send(data)
      .then((response) => {
        expect(response.body.affectedRows).to.equal(1);
        expect(response.status).to.equal(200);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
