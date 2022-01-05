'use strict';

/**
 *  matrik controller
 */

const {
  createCoreController
} = require('@strapi/strapi').factories;
const cust = require('./custom-matrik');
const controller = createCoreController('api::matrik.matrik', () => ({
   ...cust,
}));

module.exports = controller;
