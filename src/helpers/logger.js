export default () => (next) => (action) => {
    console.log('Action dispatched:', action);
    return next(action)
}