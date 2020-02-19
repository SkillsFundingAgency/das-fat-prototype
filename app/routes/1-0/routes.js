module.exports = function (router,_myData) {

    var version = "1-0";

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))
    }

    // Every GET amd POST
    router.all('/' + version + '/*', function (req, res, next) {
        if(!req.session.myData || req.query.reset) {
            reset(req)
        }
        //version
        req.session.myData.version = version
        next()
    });

    // Standards test
    router.get('/' + version + '/standards', function (req, res) {
        req.session.myData.standards.list.sort(function(a,b){
            // if (a.title.toUpperCase() < b.title.toUpperCase()){
            if (a.larsCode < b.larsCode){
                return -1
            // } else if(a.title.toUpperCase() > b.title.toUpperCase()){
            } else if(a.larsCode > b.larsCode){
                return 1
            }
            return 0;
        });
        res.render(version + '/standards', {
            myData:req.session.myData
        });
    });

}