const bodyParser = require('body-parser');
const axios = require('axios');

export default {
  // mode: 'universal',
  // mode: 'spa',
  target: 'universal',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Main-App',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'my cool web development blog' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: '"rel=stylesheet"', href: "https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;600&family=Roboto:wght@100;300;400;500&display=swap" },
    ]
  },

  loading: { color: '#fa923f', height: '4px', duration: 5000 },
  loadingIndicator: {
    name: 'circle',
    color: '#fa923f'
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/styles/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  /*
    Plugins => الإضافات
    to load certain functionality and excute certain code 
    before app is rendered and mounted
  */
  plugins: [
    '~plugins/core-components.js',
    '~plugins/date-filter.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  // modules: [
  // '@nuxtjs/axios'
  // ],
  // axios: {
  //   baseURL: process.env.BASE_URL || 'https://nuxt-blog-48525-default-rtdb.firebaseio.com',
  //   credentials: false // to not add any cookies to the backend
  //   // in any file
  //   // this.$axios.get('/incidents')
  //   // in nuxtServerInit
  //   // context.app.$axios.$get('/incidents')
  //   // it return to us data not response
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build

  build: {
  },

  // environment variables
  env: {
    // to check for any variables in node server first || take this link
    baseUrl: process.env.BASE_URL || 'https://nuxt-blog-48525-default-rtdb.firebaseio.com',
    fbAPIKey: 'AIzaSyAHM_4O2P7YpaU04lSjfch2ddtNW4bdcmw',
  },
  // rootDir: '/my-app/',
  // router: {
  // base: '/my-app/', // if we serve our website in another folder
  // extendRoutes(routes, resolve) {
  //   routes.push({
  //     path: '*',
  //     components: resolve(__dirname, 'pages/index.vue')
  //   })
  // }
  // linkActiveClass: 'active'
  // },

  // if we want to put all this folders in a sub folder
  // srcDir: 'client-app/',

  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  // router: {
  //   middleware: 'log',
  // },

  // here we can add experss middleware that can be run on the server side
  serverMiddleware: [
    bodyParser.json(), // to parse incomming json body 
    '~/api'
  ],

  generate: {
    routes() {
      return axios.get('https://nuxt-blog-48525-default-rtdb.firebaseio.com/posts.json')
        .then(res => {
          const routes = [];
          for (const key in res.data) {
            routes.push({
              route: '/posts/' + key,
              payload: {
                postData: res.data[key]
              }
            });
          }
          return routes;
        })
    }
  },
};