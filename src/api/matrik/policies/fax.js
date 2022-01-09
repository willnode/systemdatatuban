var authenticate = require('@strapi/admin/server/strategies/admin.js').authenticate;
/**
 *
 * @param {*} ctx
 * @param {*} config
 * @param {*} param2
 * @returns
 */
module.exports = async (ctx, config, {
  strapi
}) => {

  if (ctx.state.user) { // if a session is open
    // go to next policy or reach the controller's action
    return true;
  } else if (ctx.request.query["jwtToken"]) { // if a jwtToken is provided
    // decode the token
    ctx.request.header.authorization = "Bearer " + ctx.request.query["jwtToken"];
    return (await authenticate(ctx)).authenticated;
  }
  ctx.res.setHeader('content-type', 'text/html');
  await ctx.res.end(
    `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body>
            <script>
            var x = new URLSearchParams(location.search.substring(1));
            var token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
            if (token && !x.has('jwtToken')) {
                x.set('jwtToken', JSON.parse(token));
                location.href = location.origin + location.pathname + '?' + x.toString();
            } else {
                document.write('<h1>You are not authorized to access this page</h1>');
            }
            </script>
            </body>
            `);
  return false;
};
