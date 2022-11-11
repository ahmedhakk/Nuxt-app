// middleware => we can excute any code before any page is loaded
// this fun will be excuted in the server or in the client
// if we run async code => so we should return Promise
// if we run sync code => we don't have to return anything 

export default function (context) {
  console.log('[Middleware] Running !!!');
}


// context function on the docs of nuxt
/*
function (context) { // Could be asyncData, nuxtServerInit, ...
  // Always available
  const {
    app,
    store,
    route,
    params,
    query,
    env,
    isDev,
    isHMR,
    redirect,
    error,
    $config
  } = context

  // Only available on the Server-side
  if (process.server) {
    const { req, res, beforeNuxtRender } = context
  }

  // Only available on the Client-side
  if (process.client) {
    const { from, nuxtState } = context
  }
}
*/