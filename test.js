const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./index');

const { expect } = chai;

chai.use(chaiHttp);

let server;

before((done) => {
    server = app.listen(5432, () => {
        console.log('Example app listening on port 5432!');
        done();
    });
});

after(() => {
    server.close();
});

describe('API endpoint tests', () => {
    it('should return "Hello World!"', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Hello World!');
                done();
            });
    });

    it('should return an array of data "List"', (done) => {
        chai.request(app)
            .get('/files/list')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should return an array of data "Find"', (done) => {
        chai.request(app)
            .get('/files/data')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
