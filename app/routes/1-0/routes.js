module.exports = function (router,_myData) {

    var version = "1-0";

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))
    }

    // Every GET amd POST
    router.all('/' + version + '/*', function (req, res, next) {
        if(!req.session.myData || req.query.r) {
            reset(req)
        }
        //version
        req.session.myData.version = version
        next()
    });

    // Prototype setup
    router.get('/' + version + '/setup', function (req, res) {
        res.render(version + '/setup', {
            myData:req.session.myData
        });
    });

    // Standards test
    router.get('/' + version + '/standards', function (req, res) {
        res.render(version + '/standards', {
            myData:req.session.myData
        });
    });

    // Start
    router.get('/' + version + '/start', function (req, res) {
        res.render(version + '/start', {
            myData:req.session.myData
        });
    });

    // Home
    router.get('/' + version + '/home', function (req, res) {
        res.render(version + '/home', {
            myData:req.session.myData
        });
    });

    // Training
    router.get('/' + version + '/training', function (req, res) {

        req.session.myData.route = req.query.route || "all"
        
        res.render(version + '/training', {
            myData:req.session.myData
        });

    });

}