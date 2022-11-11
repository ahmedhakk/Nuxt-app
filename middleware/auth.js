export default function (context) {
    if (!context.store.getters.isAuthenticated) {
        console.log('middleware auth.js');
        context.redirect('/admin/auth');
    }
};