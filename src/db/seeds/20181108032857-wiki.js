'use strict';

const faker = require("faker");

let wikis = [];
for(let i = 1; i <= 10; i++){
  let id;
  if(i <= 5) {id=1} else {id=2};
  wikis.push({
    title: faker.hacker.phrase(),
    body: faker.lorem.words(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Wikis", wikis, {});
  }
};
