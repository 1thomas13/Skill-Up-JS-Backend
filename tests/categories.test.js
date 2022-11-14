const { Category } = require("../database/models");
process.env.NODE_ENV = 'test';
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();

chai.use(chaiHttp);

let testCategory;

describe("Categories endpoint Endpoint", () => {
  describe("POST /categories", () => {
    it("should make a new Category", (done) => {
      chai
        .request(server)
        .post("/categories")
        .send({
          name: "test",
          description: "test category",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .end((err, res) => {
          testCategory = res.body.body;
          res.should.have.status(200);
          res.body.body.should.be.a("object");
          done();
        });
    });
  });

  describe("GET /category", () => {
    it("should GET all categories", (done) => {
      chai
        .request(server)
        .get("/categories")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.body.should.be.a("array");
          done();
        });
    });
    it("should GET categories by given ID", (done) => {
      chai
        .request(server)
        .get("/categories/" + testCategory.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.body.description.should.be.eql("test category");
          done();
        });
    });
    it("should return an error if the ID is invalid", (done) => {
      chai
        .request(server)
        .get("/categories/" + 9999)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe("PUT /categories", () => {
    it("should update category by given ID", (done) => {
      chai
        .request(server)
        .put("/categories/" + testCategory.id)
        .send({ ...testCategory, name: "test category updated" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("DELETE /categories", () => {
    it("should delete category by given ID", (done) => {
      chai
        .request(server)
        .delete("/categories/" + testCategory.id)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  after((done) => {
    Category.destroy({ where: { id: testCategory.id, force: true } })
    done();
  });
});