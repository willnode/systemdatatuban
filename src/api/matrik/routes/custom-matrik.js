
module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/matriks/:id/print',
        handler: 'matrik.print',
        config: {
          auth: false,
          policies: ['api::matrik.fax']
        },
      },{
        method: 'GET',
        path: '/matriks/summary',
        handler: 'matrik.summary',
        config: {
          auth: false,
        },
      },{
        method: 'GET',
        path: '/matriks/export',
        handler: 'matrik.export',
        config: {
          auth: false,
          policies: ['api::matrik.fax']
        },
      },{
        method: 'POST',
        path: '/matriks/import',
        handler: 'matrik.import',
        config: {
          auth: false,
          policies: ['api::matrik.fax']
        },
      },{
        method: 'GET',
        path: '/matriks/import',
        handler: 'matrik.import',
        config: {
          auth: false,
          policies: ['api::matrik.fax']
        },
      },
    ],
  };