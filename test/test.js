const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app")
    // asssertion style
chai.should();
chai.use(chaiHttp);

describe("tests api", () => {
    describe("GET /investment", () => {
        it("should get all the user investments",
            (done) => {
                chai.request(server)
                    .get('/investment').set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTY0NjYxMDU2OCwiZXhwIjoxNjU0Mzg2NTY4fQ.1vF6DDfe4RDd3PzGActu-0VadoV2iPYdTgOdXAGOD8M')
                    .end((error, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        done();
                    })

            })
    });
    describe("GET /investments", () => {
        it("should get all the user investments",
            (done) => {
                chai.request(server)
                    .get('/investments').set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTY0NjYxMDU2OCwiZXhwIjoxNjU0Mzg2NTY4fQ.1vF6DDfe4RDd3PzGActu-0VadoV2iPYdTgOdXAGOD8M')
                    .end((error, res) => {
                        res.should.have.status(404);

                        done();
                    })

            })
    });
    describe("GET /investment/show/id", () => {
        it("should  an user investment",
            (done) => {
                const id = 17
                chai.request(server)
                    .get('/investment/show/' + id).set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTY0NjYxMDU2OCwiZXhwIjoxNjU0Mzg2NTY4fQ.1vF6DDfe4RDd3PzGActu-0VadoV2iPYdTgOdXAGOD8M')
                    .end((error, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');

                        done();
                    })

            })
    });
    describe("GET /investment/show", () => {
        it("should not get an user investment",
            (done) => {

                chai.request(server)
                    .get('/investment/show/').set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTY0NjYxMDU2OCwiZXhwIjoxNjU0Mzg2NTY4fQ.1vF6DDfe4RDd3PzGActu-0VadoV2iPYdTgOdXAGOD8M')
                    .end((error, res) => {
                        res.should.have.status(404);


                        done();
                    })

            })
    });
    //  when runing this test make shure to change the email value to pass
    describe("POST /register", () => {
        it("should register a new user",
            (done) => {
                const testUser = {
                    name: "test",
                    email: "trying@test.com",
                    password: "123456",
                    passwordConfirmation: "123456"
                }
                chai.request(server)
                    .post('/register')
                    .send(testUser)
                    .end((error, res) => {
                        res.should.have.status(200);
                        // res.body.should.be.a('object');
                        done();
                    })

            })
    })

    describe("POST /register", () => {
        it("should not register a new user",
            (done) => {
                const testUser = {
                    name: "test",
                    email: "testing@test.com",
                    password: "0000",
                    paswordConfirmation: "0000"
                }
                chai.request(server)
                    .post('/register')
                    .send(testUser)
                    .end((error, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        done();
                    })

            })
    });

    describe("POST /login", () => {
        it("should login a user",
            (done) => {
                const User = {

                    email: "howaida@gmail.com",
                    password: "0000"

                }
                chai.request(server)
                    .post('/login')
                    .send(User)
                    .end((error, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    })

            })
    });



    describe("POST /login", () => {
        it("should not login a user",
            (done) => {
                const User = {
                    email: "testing@test.com",
                    password: "0000"

                }
                chai.request(server)
                    .post('/login')
                    .send(User)
                    .end((error, res) => {
                        res.should.have.status(401);
                        res.body.should.be.a('object');
                        done();
                    })

            })
    });



    describe("DELETE /investment/delete/:id", () => {
        // make sure to change the id number to pass
        it("should delete a user's investment ",
            (done) => {
                const id = 18
                chai.request(server)
                    .delete('/investment/delete/' + id).set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTY0NjYxMDU2OCwiZXhwIjoxNjU0Mzg2NTY4fQ.1vF6DDfe4RDd3PzGActu-0VadoV2iPYdTgOdXAGOD8M')
                    .end((error, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        done();
                    })

            })
    });
    describe("PUT /investment/edit/:id", () => {
        it("should edit a user's investment ",
            (done) => {
                const testValue = {
                    value: 5000
                }
                const id = 18
                chai.request(server)
                    .put('/investment/edit/' + id).set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTY0NjYxMDU2OCwiZXhwIjoxNjU0Mzg2NTY4fQ.1vF6DDfe4RDd3PzGActu-0VadoV2iPYdTgOdXAGOD8M')
                    .send(testValue)
                    .end((error, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        done();
                    })

            })
    });
    describe("POST /investment/invest", () => {
        it("insert an investment  ",
            (done) => {
                const testValue = {
                    value: 2020
                }

                chai.request(server)
                    .post('/investment/invest').set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTY0NjYxMDU2OCwiZXhwIjoxNjU0Mzg2NTY4fQ.1vF6DDfe4RDd3PzGActu-0VadoV2iPYdTgOdXAGOD8M')
                    .send(testValue)
                    .end((error, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        done();
                    })

            })
    });

})