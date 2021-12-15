
module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/matriks/:id/print',
        handler: 'matrik.print',
        config: {
          auth: false,
        },
      },
    ],
  };