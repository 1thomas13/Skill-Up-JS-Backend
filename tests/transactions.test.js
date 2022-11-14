const { Transaction } = require("../database/models");
process.env.NODE_ENV = 'test';
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const { faker } = require("@faker-js/faker");
const should = chai.should();


chai.use(chaiHttp);

let testTransaction;

describe("Transaction Endpoint", () => {
  describe("POST /transaction", () => {
    it("should make a new Transaction", (done) => {
      chai
        .request(server)
        .post("/transactions")
        .send({
          description: "test Transaction",
          amount: faker.finance.amount(100, 999999),
          userId: faker.finance.amount(1, 10),
          date: new Date(),
          categoryId: faker.finance.amount(1, 2),
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        .end((err, res) => {
          testTransaction = res.body.body;
          res.should.have.status(200);
          res.body.body.should.be.a("object");
          done();
        });
    });

    it("should retrieve an Error if USER CATEGORY AMOUNT DATE fields are no specified", (done) => {
      chai
        .request(server)
        .post("/transactions")
        .send({ description: "test fail transaction" })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe("GET /transaction", () => {
    it("should GET all transactions", (done) => {
      chai
        .request(server)
        .get("/transactions")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.body.should.be.a("array");
          done();
        });
    });
    it("should GET transaction by given ID", (done) => {
      chai
        .request(server)
        .get("/transactions/" + testTransaction.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.body.description.should.be.eql("test Transaction");
          done();
        });
    });
    it("should return an error if the ID is invalid", (done) => {
      chai
        .request(server)
        .get("/transactions/" + 9999)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe("PUT /transactions", () => {
    it("should update transaction by given ID", (done) => {
      chai
        .request(server)
        .put("/transactions/" + testTransaction.id)
        .send({ ...testTransaction, amount: 200 })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("DELETE /transactions", () => {
    it("should delete transaction by given ID", (done) => {
      chai
        .request(server)
        .delete("/transactions/" + testTransaction.id)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  after((done) => {
    Transaction.destroy({ where: { id: testTransaction.id , force: true} })
    done()
  });
});