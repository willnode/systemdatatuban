module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '91f04f6cf03451e70b60be057b9ede65'),
  },
});
