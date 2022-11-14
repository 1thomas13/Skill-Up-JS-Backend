"use strict";
const { faker } = require("@faker-js/faker");
const quantity = 11;
const bcrypt = require("bcrypt");
const data = [];
const password = '12345678'
const hash = bcrypt.hashSync(password, 10);


for (let i = 1; i < quantity; i++) {
  data.push({
    id: i,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: hash,
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    roleId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

data.push({
  id: quantity,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: hash,
  email: 'admin@gmail.com',
  avatar: faker.image.avatar(),
  roleId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});
  
  module.exports = {
    up: async (queryInterface) => {
      await queryInterface.bulkInsert("Users", data, {});
    },
  
    down: async (queryInterface) => {
      await queryInterface.bulkDelete("Users", null, {});
    },
  };


