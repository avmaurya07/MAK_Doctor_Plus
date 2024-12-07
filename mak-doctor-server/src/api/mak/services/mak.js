'use strict';

/**
 * mak service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mak.mak');
