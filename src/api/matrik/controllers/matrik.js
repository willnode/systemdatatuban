'use strict';

/**
 *  matrik controller
 */

const {
  createCoreController
} = require('@strapi/strapi').factories;

const controller = createCoreController('api::matrik.matrik', () => ({
    async print(ctx) {
        return await require('./custom-matrik').print(ctx);
    }
}));

module.exports = controller;
