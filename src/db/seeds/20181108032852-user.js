'use strict';
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();
const hashedPassword = bcrypt.hashSync("123456", salt);

let users = [{
  name: "Admin User",
  email: "admin@example.com",
  password: hashedPassword,
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
},{
  name: "Standard User",
  email: "standard@example.com",
  password: hashedPassword,
  role: "standard",
  createdAt: new Date(),
  updatedAt: new Date()
},{
  name: "Premium User",
  email: "premium@example.com",
  password: hashedPassword,
  role: "premium",
  createdAt: new Date(),
  updatedAt: new Date()
}];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
