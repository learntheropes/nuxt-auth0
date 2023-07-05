export default eventHandler(async (event) => {
   return { email: event.session.user.email };
});