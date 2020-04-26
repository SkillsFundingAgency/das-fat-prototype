module.exports = function (router,_myData) {

    var version = "5-0";

    //Sort standards
    function sortStandards(req, _sortBy){
        req.session.myData.standards.list.sort(function(a,b){

            var returnValue = 0;

            // RELEVANCE
            if(_sortBy == "searchrelevance"){
                if (a.searchrelevance == b.searchrelevance){
                    // NAME 
                    sortByName()
                } else if (a.searchrelevance > b.searchrelevance){
                    returnValue = -1
                } else if(a.searchrelevance < b.searchrelevance){
                    returnValue = 1
                }
            } else {
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
    //Sort providers
    function sortProviders(req, _sortBy){
        if(_sortBy == "distance"){
            req.session.myData["providers-new"].list.sort(function(a,b){
                return a.distance - b.distance
            });
        } else {
            req.session.myData["providers-new"].list.sort(function(a,b){
                var returnValue = 0;
                if (a.name.toUpperCase() < b.name.toUpperCase()){
                    returnValue = -1
                } else if(a.name.toUpperCase() > b.name.toUpperCase()){
                    returnValue = 1
                }
                return returnValue
            });
        }
    }
    //Sort epaos
    function sortEPAOs(req, _sortBy){
        if(_sortBy == "distance"){
            req.session.myData.epaos.list.sort(function(a,b){
                return a.distance - b.distance
            });
        } else {
            req.session.myData.epaos.list.sort(function(a,b){
                var returnValue = 0;
                if (a.name.toUpperCase() < b.name.toUpperCase()){
                    returnValue = -1
                } else if(a.name.toUpperCase() > b.name.toUpperCase()){
                    returnValue = 1
                }
                return returnValue
            });
        }
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

    // Location filtering
    function cityMatch(req){
        var _match = false
        req.session.myData.locationTemp = req.session.myData.locationTemp || ""
        for (var i = 0; i < req.session.myData.citiesAutocompleteList.length; i++) {
            var _thisCity = req.session.myData.citiesAutocompleteList[i]
            if(req.session.myData.locationTemp.toUpperCase() == _thisCity.toUpperCase()){
                _match = true
            } else if(req.session.myData.locationTemp.length > 2 && _thisCity.toUpperCase().startsWith(req.session.myData.locationTemp.toUpperCase())){
                req.session.myData.locationTemp = _thisCity
                _match = true
            }
        }
        return _match
    }

    // Search filtering
    function searchFilterSetup(req,_selectedLabel){
        req.session.myData.searchapplied = false
        req.session.myData.searchTerm = ""
        if(req.query.q && req.query.q != ""){
            req.session.myData.needToMatchCount++
            req.session.myData.displaycount = 0
            req.session.myData.searchapplied = true
            req.session.myData.searchTerm = req.query.q.trim()
            req.session.myData.searchfilters.push({"value": "‘" + req.session.myData.searchTerm + "’", "type": "search", "typeText": _selectedLabel})
        }
    }

    // Standard filtering - search
    function standardFilterSetup(req){
        req.session.myData.standardsearchapplied = false
        req.session.myData.standardSearchTerm = ""
        if(req.query.standard){
            req.session.myData.standardSearchTermTemp = req.query.standard.trim()
            for (var i = 0; i < req.session.myData.standards.list.length; i++) {
                var _thisStandard = req.session.myData.standards.list[i]
                if(req.session.myData.standardSearchTermTemp.toUpperCase() == _thisStandard.autoCompleteString.toUpperCase()){
                    req.session.myData.displaycount = 0
                    req.session.myData.needToMatchCount++
                    req.session.myData.standardsearchapplied = true
                    req.session.myData.standardSearchTerm = req.session.myData.standardSearchTermTemp
                    req.session.myData.selectedStandard = _thisStandard
                    req.session.myData.searchfilters.push({"value": _thisStandard.autoCompleteString, "type": "standard", "typeText": "Course name"})
                }
            }
        }
    }

    // Sort setup
    function sortSetup(req,_firstSortType,_secondSortType){
        req.session.myData.sortapplied = false
        if(req.query.sort == _firstSortType || req.query.sort == _secondSortType){
            req.session.myData.sortapplied = true
            req.session.myData.sortby = req.query.sort
        }
    }

    // Check a standard if it matches search term
    function checkStandardSearchTerm(req, _item, _searchesToDo){
        
        _item.search = false
        _item.searchrelevance = 0

        var _matchedsearch = false
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
                if(_thisItem.exactrelevance && _itemToSearch.toUpperCase() == req.session.myData.searchTerm.toUpperCase()){
                    _item.searchrelevance = _item.searchrelevance + _thisItem.exactrelevance
                    _matchedsearch = true
                    if(_thisItem.ifmatch == "exit"){
                        return
                    }
                }
                // Within check
                if(_thisItem.withinrelevance && _itemToSearch.toUpperCase().indexOf(req.session.myData.searchTerm.toUpperCase()) != -1){
                    _item.searchrelevance = _item.searchrelevance + _thisItem.withinrelevance
                    _matchedsearch = true
                    if(_thisItem.ifmatch == "exit"){
                        return 
                    }
                }
            }
            if(_matchedsearch == true && _thisItem.ifmatch == "exit") {
                break
            }
        }
        if(_matchedsearch && _item.searchrelevance > 1){
            req.session.myData.hasAMatchcount++
        }
    }

    // Set the selected standard
    function setSelectedStandard(req, _standardParameter){
        req.session.myData.standardsearchapplied = false
        req.session.myData.selectedStandard = {}
        if(_standardParameter){
            for (var i = 0; i < req.session.myData.standards.list.length; i++) {
                var _thisStandard = req.session.myData.standards.list[i]
                if(_thisStandard.larsCode == _standardParameter || _thisStandard.autoCompleteString.toUpperCase() == _standardParameter.toUpperCase()){
                    req.session.myData.standardsearchapplied = true
                    req.session.myData.selectedStandard = _thisStandard
                    req.session.myData.standard = _thisStandard.larsCode
                }
            }
        }
    }

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        // Default setup
        req.session.myData.start = "home"
        req.session.myData.employeraccount = "false"

        // Default filters
        req.session.myData.location = ""
        req.session.myData.standard = "1"
        req.session.myData.provider = "1"
        req.session.myData.epao = "1"

    }

    // Every GET and POST
    router.all('/' + version + '/*', function (req, res, next) {
        if(!req.session.myData || req.query.r) {
            reset(req)
        }
        //version
        req.session.myData.version = version
        //defaults for setup
        req.session.myData.start =  req.query.s || req.session.myData.start
        req.session.myData.employeraccount =  req.query.ea || req.session.myData.employeraccount
        req.session.myData.layout = ((req.session.myData.employeraccount == "true") ? "layout-as-emp.html" : "layout.html")
        //referrer page
        req.session.myData.referrerpage = getRefererPage(req.headers.referer)
        //local storage clear boolean
        // req.session.myData.clearLocalStorage = (req.query.cls) ? true : false

        //Constant checks for query
        req.session.myData.standard = req.query.standard || req.session.myData.standard
        req.session.myData.provider = req.query.provider || req.session.myData.provider
        req.session.myData.epao = req.query.epao || req.session.myData.epao

        next()
    });

    // Prototype setup
    router.get('/' + version + '/setup', function (req, res) {
        req.session.myData.start = "home"
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

        //Sort
        sortSetup(req,"name","relevance")

        req.session.myData.searchfilters = []
        req.session.myData.displaycount = req.session.myData.standards.list.length
        req.session.myData.needToMatchCount = 0

        // Keyword search reset/setup
        searchFilterSetup(req,"Keywords")

        // Route filter reset/setup
        req.session.myData.routefilterapplied = false
        req.session.myData.route = ""
        req.session.myData.selectedRoute = ""
        if(req.query.route){
            for (var i = 0; i < req.session.myData.routes.list.length; i++) {
                var _thisRoute = req.session.myData.routes.list[i]
                if(req.query.route == _thisRoute.code){
                    req.session.myData.route = req.query.route
                    req.session.myData.routefilterapplied = true
                    req.session.myData.displaycount = 0
                    req.session.myData.selectedRoute = _thisRoute
                    req.session.myData.searchfilters.push({"value": req.session.myData.selectedRoute.name,"type": "route","typeText": "Sector"})
                    req.session.myData.needToMatchCount++
                    break
                }
            }
        }

        // Level filter reset/setup
        req.session.myData.levelfilterapplied = false
        req.session.myData.level = ""
        req.session.myData.selectedLevel = ""
        if(req.query.level){
            for (var i = 0; i < req.session.myData.levels2.length; i++) {
                var _thisLevel = req.session.myData.levels2[i]
                if(req.query.level == _thisLevel.value){
                    req.session.myData.level = req.query.level
                    req.session.myData.levelfilterapplied = true
                    req.session.myData.selectedLevel = _thisLevel
                    req.session.myData.searchfilters.push({"value": "Level " + req.session.myData.selectedLevel.value + " - " + req.session.myData.selectedLevel.equiv,"type": "level","typeText": "Level"})
                    req.session.myData.displaycount = 0
                    req.session.myData.needToMatchCount++
                    break
                }
            }
        }

        req.session.myData.standards.list.forEach(function(_standard, index) {

            req.session.myData.hasAMatchcount = 0

            // Reset each standard
            _standard.search = true

            //ROUTE
            if(req.session.myData.routefilterapplied) {
                _standard.search = false
                if(_standard.route.toUpperCase() == req.session.myData.selectedRoute.name.toUpperCase()) {
                    req.session.myData.hasAMatchcount++
                }
            }

            //LEVEL
            if(req.session.myData.levelfilterapplied) {
                _standard.search = false
                if(_standard.level.toString() == req.session.myData.selectedLevel.value) {
                    req.session.myData.hasAMatchcount++
                }
            }

            //SEARCH TERM
            if(req.session.myData.searchapplied) {
                var _searchesToDo = [
                    {"searchOn": _standard.autoCompleteString,"exactrelevance": 999999,"withinrelevance": 100000,"ifmatch": "exit"},
                    {"searchOn": _standard.title,"exactrelevance": 99999,"withinrelevance": 10000,"ifmatch": "exit"},
                    {"searchOn": _standard.jobRoles,"exactrelevance": 5000,"withinrelevance": 100,"ifmatch": "carryon"},
                    {"searchOn": _standard.keywords,"exactrelevance": 1000,"ifmatch": "carryon"}
                ]
                checkStandardSearchTerm(req,_standard,_searchesToDo)
            }

            //MATCHES ALL IT NEEDS TO?
            if(req.session.myData.needToMatchCount > 0 && req.session.myData.needToMatchCount == req.session.myData.hasAMatchcount){
                _standard.search = true
                req.session.myData.displaycount++
            }

        });

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

        req.session.myData.selectedStandard = {}
        for (var i = 0; i < req.session.myData.standards.list.length; i++) {
            var _thisStandard = req.session.myData.standards.list[i]
            if(_thisStandard.larsCode == req.session.myData.standard || _thisStandard.autoCompleteString.toUpperCase() == req.session.myData.standard.toUpperCase()){
                req.session.myData.selectedStandard = _thisStandard
            }
        }
        req.session.myData.needToMatchCount = 1
        req.session.myData.displaycountproviders = 0
        req.session.myData.displaycountepaos = 0

        //Location reset/setup
        if(req.query.location || (req.session.myData.location != "" && req.session.myData.location)){
            req.session.myData.locationTemp = req.session.myData.location
            if(req.query.location == ""){
                req.session.myData.locationTemp = ""
            } else if (req.query.location) {
                req.session.myData.locationTemp = req.query.location.trim()
            }
            require("request").get('https://api.postcodes.io/postcodes/' + req.session.myData.locationTemp + '/autocomplete', (error, response, body) => {
                var _postCodeMatch = (JSON.parse(body).result && req.session.myData.locationTemp.length > 1)
                if(cityMatch(req) || _postCodeMatch) {
                    req.session.myData.locationapplied = true
                    req.session.myData.location = req.session.myData.locationTemp
                    req.session.myData.needToMatchCount++
                } else {
                    req.session.myData.locationapplied = false
                    req.session.myData.location = ""
                }
                continueRendering()
            });
        } else {
            continueRendering()
        }
        
        function continueRendering(){

            // Providers count
            req.session.myData["providers-new"].list.forEach(function(_provider, index) {
                var _deliversStandard = false
                req.session.myData.hasAMatchcount = 0
                //STANDARD
                if(_provider.courses.includes(parseInt(req.session.myData.standard))){
                    _deliversStandard = true
                    req.session.myData.hasAMatchcount++
                }
                //LOCATION
                if(req.session.myData.locationapplied) {
                    if(_deliversStandard && (_provider.national || _provider.locationmatch)){
                        req.session.myData.hasAMatchcount++
                    }
                }
                //MATCHES ALL IT NEEDS TO?
                if(req.session.myData.needToMatchCount == req.session.myData.hasAMatchcount){
                    req.session.myData.displaycountproviders++
                }
            });
            // EPAOS count
            req.session.myData.epaos.list.forEach(function(_epao, index) {
                var _deliversStandard = false
                req.session.myData.hasAMatchcountEPAO = 0
                //STANDARD
                if(req.session.myData.selectedStandard.epaos.list.includes(_epao.name)){
                    _deliversStandard = true
                    req.session.myData.hasAMatchcountEPAO++
                }
                //LOCATION
                if(req.session.myData.locationapplied) {
                    if(_deliversStandard && _epao.locationmatch){
                        req.session.myData.hasAMatchcountEPAO++
                    }
                }
                //MATCHES ALL IT NEEDS TO?
                if(req.session.myData.needToMatchCount == req.session.myData.hasAMatchcountEPAO){
                    req.session.myData.displaycountepaos++
                }

            });

            res.render(version + '/standard', {
                myData:req.session.myData
            });
        }

    });

    // Providers
    router.get('/' + version + '/providers', function (req, res) {

        //Sort
        sortSetup(req,"name","distance")

        var _providers = req.session.myData["providers-new"].list,
            _standards = req.session.myData.standards.list

        req.session.myData.searchfilters = []
        req.session.myData.selectedStandard = {}
        req.session.myData.displaycount = _providers.length
        req.session.myData.needToMatchCount = 0

        // Standard filter reset/setup
        req.session.myData.standardfilterapplied = true
        req.session.myData.displaycount = 0
        req.session.myData.needToMatchCount++
        for (var i = 0; i < _standards.length; i++) {
            if(req.session.myData.standard == _standards[i].larsCode){
                req.session.myData.selectedStandard = _standards[i]
                break
            }
        }

        //Location reset/setup
        if(req.query.location || (req.session.myData.location != "" && req.session.myData.location)){
            req.session.myData.locationTemp = req.session.myData.location
            if(req.query.location == ""){
                req.session.myData.locationTemp = ""
            } else if (req.query.location) {
                req.session.myData.locationTemp = req.query.location.trim()
            }
            require("request").get('https://api.postcodes.io/postcodes/' + req.session.myData.locationTemp + '/autocomplete', (error, response, body) => {
                var _postCodeMatch = (JSON.parse(body).result && req.session.myData.locationTemp.length > 1)
                if(cityMatch(req) || _postCodeMatch) {
                    req.session.myData.displaycount = 0
                    req.session.myData.needToMatchCount++
                    req.session.myData.locationapplied = true
                    req.session.myData.location = req.session.myData.locationTemp
                    req.session.myData.searchfilters.push({"value": req.session.myData.location, "type": "location", "typeText": "Location of apprenticeship"})
                } else {
                    req.session.myData.locationapplied = false
                    req.session.myData.location = ""
                }
                continueRendering()
            });
        } else {
            continueRendering()
        }

        function continueRendering(){

            // Keyword search reset/setup
            searchFilterSetup(req,"Training provider name")

            _providers.forEach(function(_provider, index) {
                
                var _deliversStandard = false
                
                req.session.myData.hasAMatchcount = 0

                // Reset each provider
                _provider.search = true

                //STANDARD
                if(req.session.myData.standardfilterapplied) {
                    _provider.search = false
                    if(_provider.courses.includes(req.session.myData.selectedStandard.larsCode)){
                        _deliversStandard = true
                        req.session.myData.hasAMatchcount++
                    }
                }

                //LOCATION
                if(req.session.myData.locationapplied) {
                    _provider.search = false
                    if(_deliversStandard && (_provider.national || _provider.locationmatch)){
                        req.session.myData.hasAMatchcount++
                    }
                }

                //SEARCH TERM
                if(req.session.myData.searchapplied) {
                    var _searchesToDo = [
                        {"searchOn": _provider.autoCompleteString,"exactrelevance": 999999,"withinrelevance": 100000,"ifmatch": "exit"}
                    ]
                    checkStandardSearchTerm(req,_provider,_searchesToDo)
                }

                //MATCHES ALL IT NEEDS TO?
                if(req.session.myData.needToMatchCount > 0 && req.session.myData.needToMatchCount == req.session.myData.hasAMatchcount){
                    _provider.search = true
                    req.session.myData.displaycount++
                }

            });

            if(req.session.myData.locationapplied){
                if(req.session.myData.sortby == "name"){
                    sortProviders(req, "name")
                } else {
                    sortProviders(req, "distance")
                }
            } else {
                sortProviders(req, "name")
            }

            res.render(version + '/providers', {
                myData:req.session.myData
            });

        }

    });

    // Providers
    router.get('/' + version + '/providers-all', function (req, res) {

        //Sort
        sortSetup(req,"name","distance")

        var _providers = req.session.myData["providers-new"].list

        req.session.myData.searchfilters = []
        req.session.myData.displaycount = _providers.length
        req.session.myData.needToMatchCount = 0

        //Location filter reset/setup
        if(req.query.location || (req.session.myData.location != "" && req.session.myData.location)){
            req.session.myData.locationTemp = req.session.myData.location
            if(req.query.location == ""){
                req.session.myData.locationTemp = ""
            } else if (req.query.location) {
                req.session.myData.locationTemp = req.query.location.trim()
            }
            require("request").get('https://api.postcodes.io/postcodes/' + req.session.myData.locationTemp + '/autocomplete', (error, response, body) => {
                var _postCodeMatch = (JSON.parse(body).result && req.session.myData.locationTemp.length > 1)
                if(cityMatch(req) || _postCodeMatch) {
                    req.session.myData.displaycount = 0
                    req.session.myData.needToMatchCount++
                    req.session.myData.locationapplied = true
                    req.session.myData.location = req.session.myData.locationTemp
                    req.session.myData.searchfilters.push({"value": req.session.myData.location, "type": "location", "typeText": "Location of apprenticeship"})
                } else {
                    req.session.myData.locationapplied = false
                    req.session.myData.location = ""
                }
                continueRendering()
            });
        } else {
            continueRendering()
        }

        function continueRendering(){

            // Standard filter reset/setup
            standardFilterSetup(req)
            
            // Keyword search reset/setup
            searchFilterSetup(req,"Training provider name")

            // FILTER providers
            _providers.forEach(function(_provider, index) {

                req.session.myData.hasAMatchcount = 0

                // Reset each provider
                _provider.search = true
    
                //STANDARD SEARCH TERM
                if(req.session.myData.standardsearchapplied) {
                    _provider.search = false
                    if(_provider.courses.includes(req.session.myData.selectedStandard.larsCode)){
                        req.session.myData.hasAMatchcount++
                    }
                }
    
                //LOCATION
                if(req.session.myData.locationapplied) {
                    _provider.search = false
                    if(_provider.national || _provider.locationmatch){
                        req.session.myData.hasAMatchcount++
                    }
                }
    
                //SEARCH TERM
                if(req.session.myData.searchapplied) {
                    var _searchesToDo = [
                        {"searchOn": _provider.autoCompleteString,"exactrelevance": 999999,"withinrelevance": 100000,"ifmatch": "exit"}
                    ]
                    checkStandardSearchTerm(req,_provider,_searchesToDo)
                }
    
                //MATCHES ALL IT NEEDS TO?
                if(req.session.myData.needToMatchCount > 0 && req.session.myData.needToMatchCount == req.session.myData.hasAMatchcount){
                    _provider.search = true
                    req.session.myData.displaycount++
                }
    
            });
    
            if(req.session.myData.locationapplied){
                if(req.session.myData.sortby == "name"){
                    sortProviders(req, "name")
                } else {
                    sortProviders(req, "distance")
                }
            } else {
                sortProviders(req, "name")
            }
    
            res.render(version + '/providers-all', {
                myData:req.session.myData
            });
        }

    });

    // Provider
    router.get('/' + version + '/provider', function (req, res) {

        var _standards = req.session.myData.standards.list

        for (var i = 0; i < req.session.myData["providers-new"].list.length; i++) {
            var _thisProvider = req.session.myData["providers-new"].list[i]
            if(req.session.myData.provider == _thisProvider.id){
                req.session.myData.selectedProvider = _thisProvider
            }
        }
        // Provider - standards list
        req.session.myData.displaycount = 0
        for (var i = 0; i < _standards.length; i++) {
            var _thisStandard = _standards[i]
            _thisStandard.matchesProvider = false
            if(req.session.myData.selectedProvider.courses.includes(_thisStandard.larsCode)) {
                req.session.myData.displaycount++
                _thisStandard.matchesProvider = true
            }
        }

        //Selected standard
        setSelectedStandard(req,req.query.standard)

        //Location reset/setup
        if(req.query.location || (req.session.myData.location != "" && req.session.myData.location)){
            req.session.myData.locationTemp = req.session.myData.location
            if(req.query.location == ""){
                req.session.myData.locationTemp = ""
            } else if (req.query.location) {
                req.session.myData.locationTemp = req.query.location.trim()
            }
            require("request").get('https://api.postcodes.io/postcodes/' + req.session.myData.locationTemp + '/autocomplete', (error, response, body) => {
                var _postCodeMatch = (JSON.parse(body).result && req.session.myData.locationTemp.length > 1)
                if(cityMatch(req) || _postCodeMatch) {
                    req.session.myData.locationapplied = true
                    req.session.myData.location = req.session.myData.locationTemp
                } else {
                    req.session.myData.locationapplied = false
                    req.session.myData.location = ""
                }
                continueRendering()
            });
        } else {
            continueRendering()
        }
        
        function continueRendering(){
            res.render(version + '/provider', {
                myData:req.session.myData
            });
        }

    });

    // EPAOs
    router.get('/' + version + '/epaos', function (req, res) {

        //Sort
        sortSetup(req,"name","distance")

        var _epaos = req.session.myData.epaos.list,
            _standards = req.session.myData.standards.list

        req.session.myData.searchfilters = []
        req.session.myData.displaycount = _epaos.length
        req.session.myData.needToMatchCount = 0
        req.session.myData.selectedStandard = {}

        // Standard filter reset/setup
        req.session.myData.standardfilterapplied = true
        req.session.myData.displaycount = 0
        req.session.myData.needToMatchCount++
        for (var i = 0; i < _standards.length; i++) {
            if(req.session.myData.standard == _standards[i].larsCode){
                req.session.myData.selectedStandard = _standards[i]
                break
            }
        }

        //Location reset/setup
        if((req.query.location || (req.session.myData.location != "" && req.session.myData.location)) && req.session.myData.standardfilterapplied){
            req.session.myData.locationTemp = req.session.myData.location
            if(req.query.location == ""){
                req.session.myData.locationTemp = ""
            } else if (req.query.location) {
                req.session.myData.locationTemp = req.query.location.trim()
            }
            require("request").get('https://api.postcodes.io/postcodes/' + req.session.myData.locationTemp + '/autocomplete', (error, response, body) => {
                var _postCodeMatch = (JSON.parse(body).result && req.session.myData.locationTemp.length > 1)
                if(cityMatch(req) || _postCodeMatch) {
                    req.session.myData.displaycount = 0
                    req.session.myData.needToMatchCount++
                    req.session.myData.location = req.session.myData.locationTemp
                    req.session.myData.locationapplied = true
                    req.session.myData.searchfilters.push({"value": req.session.myData.location, "type": "location", "typeText": "Location of apprenticeship"})
                } else {
                    req.session.myData.locationapplied = false
                    req.session.myData.location = ""
                }
                continueRendering()
            });
        } else {
            continueRendering()
        }

        function continueRendering(){

            // Keyword search reset/setup
            searchFilterSetup(req,"Assessment organisation name")

            _epaos.forEach(function(_epao, index) {
                
                var _deliversStandard = false,
                    _epaoIndex = 0

                req.session.myData.hasAMatchcount = 0

                // Reset each epao
                _epao.search = true

                //STANDARD
                if(req.session.myData.standardfilterapplied) {
                    _epao.search = false
                    req.session.myData.selectedStandard.epaos.list.forEach(function(_epaoOnStandard, index) {
                        if(_epaoOnStandard.toUpperCase() == _epao.name.toUpperCase()){
                            _epaoIndex = index
                            _deliversStandard = true
                            req.session.myData.hasAMatchcount++
                        }
                    });
                }

                //LOCATION
                if(req.session.myData.locationapplied) {
                    _epao.search = false
                    if(_epao.locationmatch){
                        req.session.myData.hasAMatchcount++
                    }
                }

                //SEARCH TERM
                if(req.session.myData.searchapplied) {
                    var _searchesToDo = [
                        {"searchOn": _epao.autoCompleteString,"exactrelevance": 999999,"withinrelevance": 100000,"ifmatch": "exit"}
                    ]
                    checkStandardSearchTerm(req,_epao,_searchesToDo)
                }

                //MATCHES ALL IT NEEDS TO?
                if(req.session.myData.needToMatchCount > 0 && req.session.myData.needToMatchCount == req.session.myData.hasAMatchcount){
                    _epao.search = true
                    req.session.myData.displaycount++
                }

            });

            if(req.session.myData.locationapplied){
                if(req.session.myData.sortby == "name"){
                    sortEPAOs(req, "name")
                } else {
                    sortEPAOs(req, "distance")
                }
            } else {
                sortEPAOs(req, "name")
            }

            res.render(version + '/epaos', {
                myData:req.session.myData
            });

        }

    });

    // EPAOS
    router.get('/' + version + '/epaos-all', function (req, res) {

        //Sort
        sortSetup(req,"name","distance")

        req.session.myData.searchfilters = []
        req.session.myData.displaycount = req.session.myData.epaos.list.length
        req.session.myData.needToMatchCount = 0

        //Location reset/setup
        if(req.query.location || (req.session.myData.location != "" && req.session.myData.location)){
            req.session.myData.locationTemp = req.session.myData.location
            if(req.query.location == ""){
                req.session.myData.locationTemp = ""
            } else if (req.query.location) {
                req.session.myData.locationTemp = req.query.location.trim()
            }
            require("request").get('https://api.postcodes.io/postcodes/' + req.session.myData.locationTemp + '/autocomplete', (error, response, body) => {
                var _postCodeMatch = (JSON.parse(body).result && req.session.myData.locationTemp.length > 1)
                if(cityMatch(req) || _postCodeMatch) {
                    req.session.myData.displaycount = 0
                    req.session.myData.needToMatchCount++
                    req.session.myData.location = req.session.myData.locationTemp
                    req.session.myData.locationapplied = true
                    req.session.myData.searchfilters.push({"value": req.session.myData.location, "type": "location", "typeText": "Location of apprenticeship"})
                } else {
                    req.session.myData.locationapplied = false
                    req.session.myData.location = ""
                }
                continueRendering()
            });
        } else {
            continueRendering()
        }

        function continueRendering(){
    
            // Standard filter reset/setup
            standardFilterSetup(req)

            // Keyword search reset/setup
            searchFilterSetup(req,"Assessment organisation name")

            req.session.myData.epaos.list.forEach(function(_epao, index) {

                var _epaoIndex = 0

                req.session.myData.hasAMatchcount = 0

                // Reset each epao
                _epao.search = true

                //STANDARD SEARCH TERM
                if(req.session.myData.standardsearchapplied) {
                    _epao.search = false
                    req.session.myData.selectedStandard.epaos.list.forEach(function(_epaoOnStandard, index) {
                        if(_epaoOnStandard.toUpperCase() == _epao.name.toUpperCase()){
                            _epaoIndex = index
                            req.session.myData.hasAMatchcount++
                        }
                    });
                }

                //LOCATION
                if(req.session.myData.locationapplied) {
                    _epao.search = false
                    if(_epao.locationmatch){
                        req.session.myData.hasAMatchcount++
                    }
                }

                //SEARCH TERM
                if(req.session.myData.searchapplied) {
                    var _searchesToDo = [
                        {"searchOn": _epao.autoCompleteString,"exactrelevance": 999999,"withinrelevance": 100000,"ifmatch": "exit"}
                    ]
                    checkStandardSearchTerm(req,_epao,_searchesToDo)
                }

                //MATCHES ALL IT NEEDS TO?
                if(req.session.myData.needToMatchCount > 0 && req.session.myData.needToMatchCount == req.session.myData.hasAMatchcount){
                    _epao.search = true
                    req.session.myData.displaycount++
                }

            });

            if(req.session.myData.locationapplied){
                if(req.session.myData.sortby == "name"){
                    sortEPAOs(req, "name")
                } else {
                    sortEPAOs(req, "distance")
                }
            } else {
                sortEPAOs(req, "name")
            }

            res.render(version + '/epaos-all', {
                myData:req.session.myData
            });

        }

    });

    // Epao
    router.get('/' + version + '/epao', function (req, res) {
        res.render(version + '/epao', {
            myData:req.session.myData
        });
    });

}