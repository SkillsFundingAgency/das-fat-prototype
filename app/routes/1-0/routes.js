module.exports = function (router,_myData) {

    var version = "1-0";

    //Sort standards
    function sortStandards(req, _sortBy){
        req.session.myData.standards.list.sort(function(a,b){

            var returnValue = 0;

            // RELEVANCE
            if(_sortBy == "searchrelevance"){
                // req.session.myData.sortby = "relevance"
                if (a.searchrelevance == b.searchrelevance){
                    // NAME 
                    sortByName()
                } else if (a.searchrelevance > b.searchrelevance){
                    returnValue = -1
                } else if(a.searchrelevance < b.searchrelevance){
                    returnValue = 1
                }
            } else {
                // req.session.myData.sortby = "name"
                // NAME
                sortByName()
            }

            function sortByName(){
                if (a.title.toUpperCase() < b.title.toUpperCase()){
                    returnValue = -1
                } else if(a.title.toUpperCase() > b.title.toUpperCase()){
                    returnValue = 1
                }
            }

            return returnValue

        });
    }
    // For back links
    function getRefererPage(referer){
        if(referer) {
          var urlArray = referer.split('/'),
              pageLoc = urlArray.length-1,
              refPage = urlArray[pageLoc];
          return refPage
        } else {
          return ""
        }
      }

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))
    }

    // Every GET and POST
    router.all('/' + version + '/*', function (req, res, next) {
        if(!req.session.myData || req.query.r) {
            reset(req)
        }
        //version
        req.session.myData.version = version
        //referrer page
        req.session.myData.referrerpage = getRefererPage(req.headers.referer)

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

        req.session.myData.searchTerm = ""

        res.render(version + '/home', {
            myData:req.session.myData
        });
    });

    // Training
    router.get('/' + version + '/training', function (req, res) {

        //Sort
        // req.session.myData.routesearch = false
        req.session.myData.sortapplied = false
        if(req.query.sort == "name" || req.query.sort == "relevance"){
            req.session.myData.sortapplied = true
            req.session.myData.sortby = req.query.sort
        }

        var _needToMatchCount = 0,
            _selectedRoute = {},
            _standards = req.session.myData.standards.list,
            _routes = req.session.myData.routes.list

        req.session.myData.searchfilters = []
        req.session.myData.displaycount = _standards.length
        req.session.myData.matchesroutecount = _standards.length
        req.session.myData.matchessearchcount = _standards.length

        // Route filter reset/setup
        req.session.myData.filterapplied = false
        if(req.query.route){
            for (var i = 0; i < _routes.length; i++) {
                var _thisRoute = _routes[i]
                if(req.query.route == _thisRoute.code){
                    req.session.myData.route = req.query.route
                    req.session.myData.filterapplied = true
                    req.session.myData.matchesroutecount = 0
                    req.session.myData.displaycount = 0
                    _selectedRoute = _thisRoute
                    req.session.myData.searchfilters.push(_selectedRoute.name)
                    _needToMatchCount++
                    break
                }
            }
        } else {
            req.session.myData.route = "all"
        }

        //Search reset/setup
        req.session.myData.searchapplied = false
        var _searchQ = req.query.q
        if(_searchQ || _searchQ == ""){
            _searchQ = _searchQ.trim()
            if(_searchQ != ""){
                req.session.myData.searchTerm = _searchQ
                req.session.myData.searchapplied = true
                req.session.myData.matchessearchcount = 0
                req.session.myData.displaycount = 0
                req.session.myData.searchfilters.push("‘" + _searchQ + "’")
                _needToMatchCount++
            }
        }


        _standards.forEach(function(_standard, index) {

            var _hasAMatchcount = 0

            // Reset each standard
            _standard.search = true

            //ROUTE
            if(req.session.myData.filterapplied) {
                _standard.search = false
                if(_standard.route.toUpperCase() == _selectedRoute.name.toUpperCase()) {
                    req.session.myData.matchesroutecount++
                    _hasAMatchcount++
                }
            }

            //SEARCH TERM
            if(req.session.myData.searchapplied) {
                _standard.search = false
                _standard.searchrelevance = 0
                var _standardsearch = false,
                    _searchesToDo = [
                        {"searchOn": _standard.autoCompleteString,"exactrelevance": 999999,"withinrelevance": 100000,"ifmatch": "exit"},
                        {"searchOn": _standard.title,"exactrelevance": 99999,"withinrelevance": 10000,"ifmatch": "exit"},
                        {"searchOn": _standard.jobRoles,"exactrelevance": 5000,"withinrelevance": 100,"ifmatch": "carryon"},
                        {"searchOn": _standard.keywords,"exactrelevance": 1000,"ifmatch": "carryon"}
                    ]
                // if(_searchQ.toUpperCase().endsWith(" (CATEGORY)")){
                //     req.session.myData.routesearch = true
                //     _searchesToDo = [
                //         {"searchOn": _standard.route + " (CATEGORY)","exactrelevance": 55555,"ifmatch": "exit"}
                //     ]
                // }
                for (var i = 0; i < _searchesToDo.length; i++) {
                    var _thisItem = _searchesToDo[i]
                    if(Array.isArray(_thisItem.searchOn)){
                        _thisItem.searchOn.forEach(function(_arrayPart, index) {
                            doSearches(_arrayPart)
                        });
                    } else {
                        doSearches(_thisItem.searchOn)
                    }
                    function doSearches(_itemToSearch){
                        //Exact check
                        if(_thisItem.exactrelevance && _itemToSearch.toUpperCase() == _searchQ.toUpperCase()){
                            _standard.searchrelevance = _standard.searchrelevance + _thisItem.exactrelevance
                            _standardsearch = true
                            if(_thisItem.ifmatch == "exit"){
                                return
                            }
                        }
                        // Within check
                        if(_thisItem.withinrelevance && _itemToSearch.toUpperCase().indexOf(_searchQ.toUpperCase()) != -1){
                            _standard.searchrelevance = _standard.searchrelevance + _thisItem.withinrelevance
                            _standardsearch = true
                            if(_thisItem.ifmatch == "exit"){
                                return 
                            }
                        }
                    }
                    if(_standardsearch == true && _thisItem.ifmatch == "exit") {
                        break
                    }
                }
                if(_standardsearch && _standard.searchrelevance > 1){
                    req.session.myData.matchessearchcount++
                    _hasAMatchcount++
                }
            }

            //MATCHES ALL IT NEEDS TO?
            if(_needToMatchCount > 0 && _needToMatchCount == _hasAMatchcount){
                _standard.search = true
                req.session.myData.displaycount++
            }

        });
        // Hide low relevance results if results count too high - needs redoing since commenting out to work with BOTH filter and search term
        // if(req.session.myData.displaycount > 50){
        //     _standards.forEach(function(_standard, index) {
        //         if(_standard.search == true && _standard.searchrelevance < 10000) {
        //             _standard.search = false
        //             req.session.myData.displaycount--
        //         }
        //     });
        // }

        if(req.session.myData.searchapplied){
            if(req.session.myData.sortby == "name"){
                sortStandards(req, "name")
            } else {
                sortStandards(req, "searchrelevance")
            }
        } else {
            sortStandards(req, "name")
        }

        res.render(version + '/training', {
            myData:req.session.myData
        });

    });

    // Standard
    router.get('/' + version + '/standard', function (req, res) {

        req.session.myData.standard = req.query.standard || "1"
        
        res.render(version + '/standard', {
            myData:req.session.myData
        });

    });

}