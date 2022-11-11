export default function (context) {
    console.log('middleware check-auth.js');
    // check if we run on the browser not in the server / because nuxt app runs first in the server so code will fail as there are no local storage in the server
    // ERROR : localStorage is not defined

    context.store.dispatch('initAuth', context.req); // req will be null in the client
};