'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/*{ strapi }*/) {
    if (process.env.NODE_ENV === 'development') {
      const params = {
        username: process.env.DEV_USER || 'admin',
        password: process.env.DEV_PASS || 'admin',
        firstname: process.env.DEV_USER || 'Admin',
        lastname: process.env.DEV_USER || 'Admin',
        email: process.env.DEV_EMAIL || 'admin@test.test',
        blocked: false,
        isActive: true,
      };
      //Check if any account exists.
      const admins = await strapi.query('admin::user').findMany();

      if (admins.length === 0) {
        try {
          let tempPass = params.password;
          let verifyRole = await strapi.query('admin::role').findOne({
            where: {
              code: 'strapi-super-admin',
            }
          });
          if (!verifyRole) {
            verifyRole = await strapi.query('admin::role').create({
              data: {
                name: 'Super Admin',
                code: 'strapi-super-admin',
                description: 'Super Admins can access and manage all features and settings.',
              }
            });
          }
          params.roles = [verifyRole.id];
          params.password = await strapi.admin.services.auth.hashPassword(params.password);
          await strapi.query('admin::user').create({
            data: params,
          });
          strapi.log.info('Admin account was successfully created.');
          strapi.log.info(`Email: ${params.email}`);
          strapi.log.info(`Password: ${tempPass}`);
        } catch (error) {
          strapi.log.error(`Couldn't create Admin account during bootstrap: `, error);
        }
      }
    }

  },
};
