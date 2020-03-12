const chai = require('chai');
chai.use(require('chai-http'));
const { expect } = require('chai');
const app = require('../index');
const agent = require('chai').request.agent(app);


describe('Handshake Testing', () => {
  xit('GET /signin - Authenticate User with Invalid Credentials', (done) => {
    agent.get('/signin?email=user@example.com&persona=student')
      .then((response) => {
        console.log(response.body);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Invalid Credentials');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  xit('POST /company/:id/jobs - Post a New Job', (done) => {
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
});
