process.env.NODE_ENV = 'test';
const { User } = require("../database/models");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { faker } = require("@faker-js/faker");
const should = chai.should();

chai.use(chaiHttp);

let testUser;

describe("User Endpoint", () => {
  describe("POST /users", () => {
    it("should make a new User", (done) => {
      chai
        .request(server)
        .post("/users")
        .send({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          roleId: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .end((err, res) => {
          testUser = res.body.body;
          res.should.have.status(200);
          res.body.body.should.be.a("object");
          done();
        });
    });

    it("should retrieve an Error if User fields are no specified", (done) => {
      chai
        .request(server)
        .post("/users")
        .send({ firstName: "TestUser" })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe("GET /users", () => {
    it("should GET all Users", (done) => {
      chai
        .request(server)
        .get("/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.body.should.be.a("array");
          done();
        });
    });
    it("should GET user by given ID", (done) => {
      chai
        .request(server)
        .get("/users/" + testUser.id)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("should return an error if the ID is invalid", (done) => {
      chai
        .request(server)
        .get("/users/" + 9999)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe("PUT /users", () => {
    it("should update transaction by given ID", (done) => {
      chai
        .request(server)
        .put("/users/" + testUser.id)
        .send({ ...testUser, lastName: "user updated"})
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("DELETE /users", () => {
    it("should delete user by given ID", (done) => {
      chai
        .request(server)
        .delete("/users/" + testUser.id)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  after((done) => {
    User.destroy({ where: { id: testUser.id } , force: true})
    done();
  });
});