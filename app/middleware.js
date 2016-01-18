module.exports = function(app) {

    // logs req to console
    app.use(function (req,res,next) {
        var d = new Date;
        console.log(`${d.toISOString()} ${req.originalUrl} from ${req.ip}`);
        req.dateRecieved = d;
        next();
    });
}
