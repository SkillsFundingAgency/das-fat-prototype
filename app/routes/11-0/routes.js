module.exports = function (router,_myData) {

    var version = "11-0";

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
            req.session.myData.displaycount = 0
            req.session.myData.displaycountExcludingLocation = 0
            req.session.myData.needToMatchCount++
            req.session.myData.needToMatchCountExcludingLocation++
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

    // Ofsted filtering - setup
    function ofstedFilterSetup(req){
        req.session.myData.ofstedratingsapplied = false
        if(req.session.myData.ofstedratings.length > 0){
            req.session.myData.displaycount = 0
            req.session.myData.displaycountExcludingLocation = 0
            req.session.myData.needToMatchCount++
            req.session.myData.needToMatchCountExcludingLocation++
            req.session.myData.ofstedratingsapplied = true
            var ofstedratingsValues = []
            req.session.myData.ofstedratings.forEach(function(_rating, index) {
                var _IDtoLabel = {1:"Outstanding",2:"Good",3:"Requires improvement",4:"Inadequate",0:"Not yet rated"}
                ofstedratingsValues.push({
                    "label":_IDtoLabel[_rating],
                    "id":_rating
                })
            });
            req.session.myData.searchfilters.push({"value": ofstedratingsValues, "type": "ofstedratings", "typeText": "Ofsted rating","typeof":"array"})
        }
    }

    // Employer reviews filtering - setup
    function employerReviewsFilterSetup(req){
        req.session.myData.employerreviewsapplied = false
        if(req.session.myData.employerreviews.length > 0){
            req.session.myData.displaycount = 0
            req.session.myData.displaycountExcludingLocation = 0
            req.session.myData.needToMatchCount++
            req.session.myData.needToMatchCountExcludingLocation++
            req.session.myData.employerreviewsapplied = true
            var employerreviewsValues = []
            req.session.myData.employerreviews.forEach(function(_rating, index) {
                var _IDtoLabel = {1:"Excellent",2:"Good",3:"Poor",4:"Very poor",0:"Not yet reviewed"}
                employerreviewsValues.push({
                    "label":_IDtoLabel[_rating],
                    "id":_rating
                })
            });
            req.session.myData.searchfilters.push({"value": employerreviewsValues, "type": "employerreviews", "typeText": "Average employer review","typeof":"array"})
        }
    }

    // National filtering - setup
    function nationalFilterSetup(req){
        req.session.myData.nationalapplied = false
        if(req.session.myData.national.length > 0){
            req.session.myData.displaycount = 0
            req.session.myData.displaycountExcludingLocation = 0
            req.session.myData.needToMatchCount++
            req.session.myData.needToMatchCountExcludingLocation++
            req.session.myData.nationalapplied = true
            req.session.myData.searchfilters.push({"value": "Offers training across England", "type": "national", "typeText": "All England"})
        }
    }

    // EPAO region filtering - setup
    function regionFilterSetup(req){
        req.session.myData.regionfiltersapplied = false
        if(req.session.myData.regionfilters.length > 0){
            req.session.myData.displaycount = 0
            req.session.myData.needToMatchCount++
            req.session.myData.regionfiltersapplied = true
            var regionfiltersValues = []
            req.session.myData.regionfilters.forEach(function(_region, index) {
                req.session.myData.regions.forEach(function(_regionToCheck, index) {
                    if(_regionToCheck.id == _region){
                        regionfiltersValues.push({
                            "label":_regionToCheck.label,
                            "id":_regionToCheck.id
                        })
                    }
                });
            });
            req.session.myData.searchfilters.push({"value": regionfiltersValues, "type": "regionfilters", "typeText": "Delivery areas","typeof":"array"})
        }
    }

    // Route filters - setup
    function routeFilterSetup(req){
        req.session.myData.routefilterapplied = false
        if(req.session.myData.routefilters.length > 0){
            req.session.myData.displaycount = 0
            req.session.myData.needToMatchCount++
            req.session.myData.routefilterapplied = true
            var routefiltersValues = []
            req.session.myData.routefilters.forEach(function(_routeFilter, index) {
                var _route = req.session.myData.routes.list.find(obj => obj.code.toString() === _routeFilter)
                if(_route){
                    routefiltersValues.push({
                        "label":_route.name,
                        "id":_route.code
                    })
                }
            });
            req.session.myData.searchfilters.push({"value": routefiltersValues, "type": "routefilters", "typeText": "Sector","typeof":"array"})
        }
    }

    // Level filters - setup
    function levelFilterSetup(req){
        req.session.myData.levelfilterapplied = false
        if(req.session.myData.levelfilters.length > 0){
            req.session.myData.displaycount = 0
            req.session.myData.needToMatchCount++
            req.session.myData.levelfilterapplied = true
            var levelfiltersValues = []
            req.session.myData.levelfilters.forEach(function(_levelFilter, index) {
                var _level = req.session.myData.levels2.find(obj => obj.value === _levelFilter)
                if(_level){
                    levelfiltersValues.push({
                        "label":"Level " + _level.value + " - " + _level.equiv2,
                        "id":_level.value
                    })
                }
            });
            req.session.myData.searchfilters.push({"value": levelfiltersValues, "type": "levelfilters", "typeText": "Qualification level","typeof":"array"})
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
        _item.searchExcludingLocation = false
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
            req.session.myData.hasAMatchcountExcludingLocation++
        }
    }

    // Set the selected standard
    function setSelectedStandard(req, _standardParameter){
        req.session.myData.standardsearchapplied = false
        if(_standardParameter){
            for (var i = 0; i < req.session.myData.standards.list.length; i++) {
                var _thisStandard = req.session.myData.standards.list[i]
                if(_thisStandard.larsCode.toString() == _standardParameter.toString() || _thisStandard.autoCompleteString.toUpperCase() == _standardParameter.toString().toUpperCase()){
                    req.session.myData.standardsearchapplied = true
                    req.session.myData.selectedStandard = _thisStandard
                    req.session.myData.standard = _thisStandard.larsCode
                }
            }
        }
    }

    // Set the selected provider
    function setSelectedProvider(req, _providerParameter){
        for (var i = 0; i < req.session.myData["providers-new"].list.length; i++) {
            if(_providerParameter){
                for (var i = 0; i < req.session.myData["providers-new"].list.length; i++) {
                    var _thisProvider = req.session.myData["providers-new"].list[i]
                    if(_thisProvider.id.toString() == _providerParameter.toString() || _thisProvider.autoCompleteString.toUpperCase() == _providerParameter.toString().toUpperCase()){
                        req.session.myData.selectedProvider = _thisProvider
                        req.session.myData.provider = _thisProvider.id
                    }
                }
            }
        }
    }

    // Add or remove provider from favourites
    function addRemoveFavourite(req,_removeAllLocations){

        var _favProviderQuery = req.query.fav,
            _removeFavProviderQuery = req.query.favdel

        if(_favProviderQuery || _removeFavProviderQuery){

            var _providerData = req.session.myData["providers-new"].list.find(obj => obj.id.toString() == (_favProviderQuery || _removeFavProviderQuery)),
                _newProv = {"id": _favProviderQuery,"locations": [req.session.myData.location]},
                _favourite = req.session.myData.favourites.find(obj => obj.larsCode == req.session.myData.standard)
            
            // Message notifications
            var _locationMessage = (req.session.myData.location != "") ? (" for " + req.session.myData.location) : (""),
                _courseMessage = req.session.myData.selectedStandard.title + " (level " + req.session.myData.selectedStandard.level + ") ",
                // _removeMessage = _providerData.name + " for " + _courseMessage + _locationMessage + " removed from shortlist.",
                // _addMessage = _providerData.name + " for " + _courseMessage + _locationMessage + " added to shortlist."
                _removeMessage = _providerData.name + " removed from shortlist.",
                _addMessage = _providerData.name + " added to shortlist."

            if(_favourite){
                // console.log("fav exists")

                var _provider = _favourite.providers.find(obj => obj.id == (_favProviderQuery || _removeFavProviderQuery))

                if(_provider){
                    // console.log("prov in fav exists")

                    var _location = _provider.locations.find(obj => obj == req.session.myData.location),
                        _locationValue = (req.session.myData.locationapplied) ? req.session.myData.location : "",
                        _locationExists = (_location && req.session.myData.locationapplied) || (!req.session.myData.locationapplied),
                        _removeAllLocations = (!req.session.myData.locationapplied) || _removeAllLocations

                    // Adding location

                    // PROVIDER IS IN FAVS ALREADY
                    // if(_locationExists){
                    // }

                    // PROVIDER IS NOT IN FAVS ALREADY
                    if(!_locationExists){
                        _provider.locations.push(_locationValue)
                        req.session.myData.notifications = {"message": _addMessage}
                        req.session.myData.showNotification = "true"
                    }

                    // Removing location
                    if( _removeFavProviderQuery){
                        if(_removeAllLocations){
                            // console.log("remove provider and all its locations")
                            _favourite.providers = _favourite.providers.filter(function(el) { return el.id != _removeFavProviderQuery; }); 
                            req.session.myData.notifications = {"message": _removeMessage}
                            req.session.myData.showNotification = "true"
                        } else if(_locationExists){
                            // console.log("loc in prov fav exists")
                            // console.log("remove just the filtered location against the provider")
                            var _locIndex = _provider.locations.indexOf(_locationValue)
                            if (_locIndex > -1) {
                                _provider.locations.splice(_locIndex, 1)
                                req.session.myData.notifications = {"message": _removeMessage}
                                req.session.myData.showNotification = "true"
                            }
                        }
                        //remove provider from favourite if you jsut removed the last location from it
                        if (_provider.locations.length == 0){
                            _favourite.providers = _favourite.providers.filter(function(el) { return el.id != _removeFavProviderQuery; }); 
                        }
                        //remove favourite from favourites if you just removed the last provider from it
                        if (_favourite.providers.length == 0){
                            req.session.myData.favourites = req.session.myData.favourites.filter(function(el) { return el.larsCode != req.session.myData.standard; }); 
                        }
                    }

                // Adding provider to existing favourite
                } else if (_favProviderQuery) {
                    _favourite.providers.push(_newProv)
                    req.session.myData.notifications = {"message": _addMessage}
                    req.session.myData.showNotification = "true"
                }
            
            // Adding whole new favourite
            } else if(_favProviderQuery) {
                req.session.myData.favourites.push({"larsCode": req.session.myData.standard,"providers": [_newProv]})
                req.session.myData.notifications = {"message": _addMessage}
                req.session.myData.showNotification = "true"
            }
                
        }

        // total favs
        req.session.myData.totalFavourites = 0
        req.session.myData.favourites.forEach(function(_favourite, index) {
            _favourite.providers.forEach(function(_favourite, index) {
                req.session.myData.totalFavourites++
            })
        })

    }

    // Set true/false if provider is in favourites
    function setIfInFavourites(req,_provider){
        _provider.inFavourites = false
        var _favourite = req.session.myData.favourites.find(obj => obj.larsCode == req.session.myData.standard)
        if(_favourite){
            var _providerInFavs = _favourite.providers.find(obj => obj.id == _provider.id.toString())
            if(_providerInFavs){
                var _location = _providerInFavs.locations.find(obj => obj == req.session.myData.location),
                    _blankLocation = _providerInFavs.locations.find(obj => obj == "")
                //providers added against currently applied location
                if((_location && req.session.myData.locationapplied) || (!req.session.myData.locationapplied)){
                    _provider.inFavourites = true
                }
            }
        }
    }

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        req.session.myData.favourites = [{"larsCode":196,"providers":[{"id":"1806","locations":[""]},{"id":"610","locations":[""]},{"id":"681","locations":[""]},{"id":"1468","locations":["Coventry, West Midlands"]}]}]

        req.session.myData.clearLocalStorageReset = true
        req.session.myData.clearLocalStorageNext = true

        // fake favs 
        // [{"larsCode":34,"providers":[{"id":"1350","locations":[""]}]}]

        // Default setup
        req.session.myData.employeraccount = "false"
        req.session.myData.epaoinfat = "false"
        req.session.myData.service = "fat"
        // req.session.myData.phase = "latest"

        // Dev settings
        // KEY: 
        // cmp = component
            // c = course 
                // f = filter 
                    // k = keyword
                    // s = sector
                    // l = level
            // p = provider
                // f = filter
                // d = display
                    // l = location
                    // o = ofsted 
                    // e = employer reviews 
                    // d = delivery area
                    // a = achievement rate
        req.session.myData.cmpcfk = "true"
        req.session.myData.cmpcfs = "true"
        req.session.myData.cmpcfl = "true"
        req.session.myData.cmppfl = "true"
        req.session.myData.cmppfo = "true"
        req.session.myData.cmppfe = "true"
        req.session.myData.cmppfd = "true"
        req.session.myData.cmppda = "true"
        req.session.myData.cmppdo = "true"
        req.session.myData.cmppde = "true"
        req.session.myData.cmppdoc = "true"
        req.session.myData.cmpstar = "true"
        req.session.myData.cmppfc = "true"

        // Default filters
        req.session.myData.location = ""
        req.session.myData.standard = "1"
        req.session.myData.provider = "1"
        req.session.myData.epao = "1"
        req.session.myData.employerreviews = []
        req.session.myData.ofstedratings = []
        req.session.myData.regionfilters = []
        req.session.myData.national = []
        req.session.myData.routefilters = []
        req.session.myData.levelfilters = []


        //Defautl back link values
        req.session.myData.returnURLepaos2 = "epao-course"
        req.session.myData.returnURLepao2 = "epaos-2"
        req.session.myData.returnURLepaodropout = "epao-course"
        

        //Default answers
        req.session.myData.epaocourseAnswer = 1
        req.session.myData.epaolocationAnswer = 1
        req.session.myData.epaolocationAnswerApplied = false

    }

    // Every GET and POST
    router.all('/' + version + '/*', function (req, res, next) {
        if(!req.session.myData || req.query.r) {
            reset(req)
        }

        //1st load reset could be true
        if(req.session.myData.clearLocalStorageNext){
            req.session.myData.clearLocalStorageNext = false;
        } else {
            //2nd load onwards reset is false
            req.session.myData.clearLocalStorageReset = false;
        }
        req.session.myData.clearLocalStorage = req.session.myData.clearLocalStorageReset;

        //version
        req.session.myData.version = version

        // Reset page validation to false by default. Will only be set to true, if applicable, on a POST of a page
        req.session.myData.validationErrors = {}
        req.session.myData.validationError = "false"
        req.session.myData.includeValidation =  req.query.includeValidation || req.session.myData.includeValidation

        //Reset page notifications
        req.session.myData.notifications = {}
        req.session.myData.showNotification = "false"

        //defaults for setup
        req.session.myData.employeraccount =  req.query.ea || req.session.myData.employeraccount
        req.session.myData.epaoinfat =  req.query.epaofat || req.session.myData.epaoinfat
        req.session.myData.layout = ((req.session.myData.employeraccount == "true") ? "layout-as-emp.html" : "layout.html")
        req.session.myData.service =  req.query.s || req.session.myData.service
        // req.session.myData.phase =  req.query.p || req.session.myData.phase
        
        //component visibility - for devs
        //courses
        req.session.myData.cmpcfk =  req.query.cmpcfk || req.session.myData.cmpcfk
        req.session.myData.cmpcfs =  req.query.cmpcfs || req.session.myData.cmpcfs
        req.session.myData.cmpcfl =  req.query.cmpcfl || req.session.myData.cmpcfl
        //providers
        req.session.myData.cmppfl =  req.query.cmppfl || req.session.myData.cmppfl
        req.session.myData.cmppfo =  req.query.cmppfo || req.session.myData.cmppfo
        req.session.myData.cmppfe =  req.query.cmppfe || req.session.myData.cmppfe
        req.session.myData.cmppfd =  req.query.cmppfd || req.session.myData.cmppfd
        req.session.myData.cmppda =  req.query.cmppda || req.session.myData.cmppda
        req.session.myData.cmppdo =  req.query.cmppdo || req.session.myData.cmppdo
        req.session.myData.cmppde =  req.query.cmppde || req.session.myData.cmppde
        req.session.myData.cmppdoc =  req.query.cmppdoc || req.session.myData.cmppdoc
        req.session.myData.cmpstar =  req.query.cmpstar || req.session.myData.cmpstar
        req.session.myData.cmppfc =  req.query.cmppfc || req.session.myData.cmppfc

        req.session.myData.maxrows =  req.query.maxrows || 999999
        
        //referrer page
        req.session.myData.referrerpage = getRefererPage(req.headers.referer)
        //local storage clear boolean
        // req.session.myData.clearLocalStorage = (req.query.cls) ? true : false

        // TODO actually make thsi work because it doesnt :D 
        req.session.myData.returnURLepaos2 =  req.query.returnURLepaos2 || req.session.myData.returnURLepaos2
        req.session.myData.returnURLepaos2 = req.body.returnURLepaos2 || req.session.myData.returnURLepaos2
        req.session.myData.returnURLepao2 =  req.query.returnURLepao2 || req.session.myData.returnURLepao2
        req.session.myData.returnURLepao2 = req.body.returnURLepao2 || req.session.myData.returnURLepao2
        req.session.myData.returnURLepaodropout =  req.query.returnURLepaodropout || req.session.myData.returnURLepaodropout
        req.session.myData.returnURLepaodropout = req.body.returnURLepaodropout || req.session.myData.returnURLepaodropout

        
        //Constant checks for query
        req.session.myData.standard = req.query.standard || req.session.myData.standard
        req.session.myData.provider = req.query.provider || req.session.myData.provider
        req.session.myData.epao = req.query.epao || req.session.myData.epao

        setSelectedProvider(req,req.session.myData.provider)
        setSelectedStandard(req,req.session.myData.standard)

        //
        // Fixes for checkbox values in query string - turns them into arrays
        //
        var _checkboxQueries = [
            "employerreviews",
            "ofstedratings",
            "regionfilters",
            "national",
            "routefilters",
            "levelfilters"
        ]
        _checkboxQueries.forEach(function(_checkboxQuery, index) {
            req.session.myData[_checkboxQuery] = req.query[_checkboxQuery] || []
            if(req.session.myData[_checkboxQuery] == "_unchecked"){
                req.session.myData[_checkboxQuery] = []
            }
            if(!Array.isArray(req.session.myData[_checkboxQuery])){
                req.session.myData[_checkboxQuery] = [req.session.myData[_checkboxQuery]]
            }
        });

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

    // Home
    router.get('/' + version + '/home', function (req, res) {
        res.render(version + '/home', {
            myData:req.session.myData
        });
    });

    // Home - EPAO
    router.get('/' + version + '/home-epao', function (req, res) {
        res.render(version + '/home-epao', {
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
        
        // Route filter setup
        routeFilterSetup(req)

        // Level filter reset/setup
        levelFilterSetup(req)

        req.session.myData.standards.list.forEach(function(_standard, index) {

            req.session.myData.hasAMatchcount = 0

            // Reset each standard
            _standard.search = true

            //ROUTE
            if(req.session.myData.routefilterapplied) {
                _standard.search = false
                var _route = req.session.myData.routefilters.find(obj => obj === _standard.routecode.toString())
                if(_route){
                    req.session.myData.hasAMatchcount++
                }
            }

            //LEVEL
            if(req.session.myData.levelfilterapplied) {
                _standard.search = false
                var _level = req.session.myData.levelfilters.find(obj => obj === _standard.level.toString())
                if(_level){
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

        //Selected standard
        setSelectedStandard(req,req.query.standard)

        //order job titles A-Z and capitalise
        req.session.myData.selectedStandard.typicalJobTitles.forEach(function(_jobTitle, index) {
            req.session.myData.selectedStandard.typicalJobTitles[index] = _jobTitle.charAt(0).toUpperCase() + _jobTitle.slice(1)
        });
        req.session.myData.selectedStandard.typicalJobTitles.sort(function(a,b){
            if (a.toUpperCase() < b.toUpperCase()){
                return -1
            } else if(a.toUpperCase() > b.toUpperCase()){
                return 1
            }
            return 0;
        });

        req.session.myData.needToMatchCount = 1
        req.session.myData.countproviders = 0
        req.session.myData.countepaos = 0
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
                var _courseBlacklisted = false
                if(req.session.myData.standard == 36){
                    _courseBlacklisted = true
                }
                if(_provider.courses.includes(parseInt(req.session.myData.standard)) && !_courseBlacklisted){
                    _deliversStandard = true
                    req.session.myData.hasAMatchcount++
                    req.session.myData.countproviders++
                }
                //LOCATION
                if(req.session.myData.locationapplied) {
                    var _providerBlacklisted = false
                    if(req.session.myData.standard == 34 || req.session.myData.standard == 174){
                        _providerBlacklisted = true
                    }
                    if(_deliversStandard && (_provider.national || _provider.locationmatch) && !_providerBlacklisted){
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
                    req.session.myData.countepaos++
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

    // Standard - closed
    router.get('/' + version + '/standard-closed', function (req, res) {

        res.render(version + '/standard-closed', {
            myData:req.session.myData
        });

    });

    // Providers
    router.get('/' + version + '/providers', function (req, res) {

        //Sort
        sortSetup(req,"name","distance")

        var _providers = req.session.myData["providers-new"].list

        setSelectedStandard(req,req.session.myData.standard)

        req.session.myData.searchfilters = []
        req.session.myData.displaycount = 0
        req.session.myData.displaycountExcludingLocation = 0
        req.session.myData.needToMatchCount = 1
        req.session.myData.needToMatchCountExcludingLocation = 1

        // Standard filter reset/setup
        req.session.myData.standardfilterapplied = true

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
                    req.session.myData.searchfilters.push({"value": req.session.myData.location, "type": "location", "typeText": "Apprenticeship location"})
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

            // National filter setup
            nationalFilterSetup(req)

            // Ofsted ratings filter setup
            ofstedFilterSetup(req)

            // Employer reviews filter setup
            employerReviewsFilterSetup(req)

            // Keyword search reset/setup
            searchFilterSetup(req,"Training provider name")

            // Add and removing favourites
            addRemoveFavourite(req,false)

            _providers.forEach(function(_provider, index) {
                
                var _deliversStandard = false
                
                req.session.myData.hasAMatchcount = 0
                req.session.myData.hasAMatchcountExcludingLocation = 0

                // Reset each provider
                _provider.search = true
                _provider.searchExcludingLocation = true

                setIfInFavourites(req,_provider)

                //STANDARD
                if(req.session.myData.standardfilterapplied) {
                    _provider.search = false
                    _provider.searchExcludingLocation = false
                    _provider.deliversStandard = false
                    if(_provider.courses.includes(req.session.myData.selectedStandard.larsCode)){
                        _deliversStandard = true
                        _provider.deliversStandard = true
                        req.session.myData.hasAMatchcount++
                        req.session.myData.hasAMatchcountExcludingLocation++
                    }
                }

                //LOCATION
                if(req.session.myData.locationapplied) {
                    var _providerBlacklisted = false
                    if(req.session.myData.standard == 34 || req.session.myData.standard == 174){
                        _providerBlacklisted = true
                    }
                    _provider.search = false
                    if(_deliversStandard && (_provider.national || _provider.locationmatch) && !_providerBlacklisted){
                        req.session.myData.hasAMatchcount++
                    }
                }

                // NATIONAL
                if(req.session.myData.nationalapplied) {
                    _provider.search = false
                    _provider.searchExcludingLocation = false
                    if(_provider.national){
                        req.session.myData.hasAMatchcount++
                        req.session.myData.hasAMatchcountExcludingLocation++
                    }
                }

                // OFSTED RATING
                if(req.session.myData.ofstedratingsapplied) {
                    _provider.search = false
                    _provider.searchExcludingLocation = false
                    req.session.myData.ofstedratings.forEach(function(_rating, index) {
                        if(_provider.ofsted == _rating){
                            req.session.myData.hasAMatchcount++
                            req.session.myData.hasAMatchcountExcludingLocation++
                        }
                    });
                }

                // EMPLOYER REVIEW
                if(req.session.myData.employerreviewsapplied) {
                    _provider.search = false
                    _provider.searchExcludingLocation = false
                    req.session.myData.employerreviews.forEach(function(_rating, index) {
                        if ((_provider.distance > 5 && _provider.distance < 10) && _rating == 0) {
                            // zero reviews
                            req.session.myData.hasAMatchcount++
                            req.session.myData.hasAMatchcountExcludingLocation++
                        } else {
                            if(_provider.averageEmpRatingID == _rating){
                                req.session.myData.hasAMatchcount++
                                req.session.myData.hasAMatchcountExcludingLocation++
                            }
                        }
                    });
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
                //MATCHES ALL IT NEEDS TO?
                if(req.session.myData.needToMatchCountExcludingLocation > 0 && req.session.myData.needToMatchCountExcludingLocation == req.session.myData.hasAMatchcountExcludingLocation){
                    _provider.searchExcludingLocation = true
                    req.session.myData.displaycountExcludingLocation++
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
    router.get('/' + version + '/providers-ordering', function (req, res) {

        var _providers = req.session.myData["providers-ordering"].list

        if(req.query.sort == "shuffle"){
            function shuffle(array) {
                var currentIndex = array.length, temporaryValue, randomIndex;
                
                // While there remain elements to shuffle...
                while (0 !== currentIndex) {
                
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                
                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                
                return array;
            }
            shuffle(_providers);
        } else {
            // Sort on name
            _providers.sort(function(a,b){
                var returnValue = 0;
                if (a.name.toUpperCase() < b.name.toUpperCase()){
                    returnValue = -1
                } else if(a.name.toUpperCase() > b.name.toUpperCase()){
                    returnValue = 1
                }
                return returnValue
            });
            // Then sort on points
            _providers.sort(function(a,b){
                return b.totalPoints - a.totalPoints
            });
            
        }
        
        setSelectedStandard(req,req.session.myData.standard)
        
        req.session.myData.displaycount = 0

        _providers.forEach(function(_provider, index) {
            if(req.query.distances == "show"){
                _provider.displayDistances = true
            } else {
                _provider.displayDistances = false
            }
            _provider.search = true
            req.session.myData.displaycount++
        });

        res.render(version + '/providers-ordering', {
            myData:req.session.myData
        });

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
                    req.session.myData.searchfilters.push({"value": req.session.myData.location, "type": "location", "typeText": "Apprenticeship location"})
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

            // setSelectedStandard(req,req.session.myData.standard)
            
            // Standard filter reset/setup
            standardFilterSetup(req)

            // Ofsted ratings filter setup
            ofstedFilterSetup(req)

            // Employer reviews filter setup
            employerReviewsFilterSetup(req)

            // Keyword search reset/setup
            searchFilterSetup(req,"Training provider name")

            // Add and removing favourites
            addRemoveFavourite(req,false)

            // FILTER providers
            // CHECK FOR MATCHES
            _providers.forEach(function(_provider, index) {

                req.session.myData.hasAMatchcount = 0

                // Reset each provider
                _provider.search = true

                setIfInFavourites(req,_provider)
    
                //LOCATION
                if(req.session.myData.locationapplied) {
                    _provider.search = false
                    if(_provider.national || _provider.locationmatch){
                        req.session.myData.hasAMatchcount++
                    }
                }
    
                //STANDARD SEARCH TERM
                if(req.session.myData.standardsearchapplied) {
                    _provider.search = false
                    if(_provider.courses.includes(req.session.myData.selectedStandard.larsCode)){
                        req.session.myData.hasAMatchcount++
                    }
                }

                // OFSTED RATING
                if(req.session.myData.ofstedratingsapplied) {
                    _provider.search = false
                    req.session.myData.ofstedratings.forEach(function(_rating, index) {
                        if(_provider.ofsted == _rating){
                            req.session.myData.hasAMatchcount++
                        }
                    });
                }

                // EMPLOYER REVIEW
                if(req.session.myData.employerreviewsapplied) {
                    _provider.search = false
                    req.session.myData.employerreviews.forEach(function(_rating, index) {
                        if ((_provider.distance > 5 && _provider.distance < 10) && _rating == 0) {
                            // zero reviews
                            req.session.myData.hasAMatchcount++
                        } else {
                            if(_provider.averageEmpRatingID == _rating){
                                req.session.myData.hasAMatchcount++
                            }
                        }
                    });
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

        var _standards = req.session.myData.standards.list,
            _providers = req.session.myData["providers-new"].list

        // Selected provider        
        setSelectedProvider(req,req.session.myData.provider)

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

            // Add and removing favourites
            addRemoveFavourite(req,false)

            //Set if in favourites
            setIfInFavourites(req,req.session.myData.selectedProvider)

            //Count of other providers
            req.session.myData.providersOnStandardCount = 0
            _providers.forEach(function(_provider, index) {

                // Reset each provider
                var _deliversStandard = false,
                    _hasAMatchcount = 0

                //STANDARD
                if(_provider.courses.includes(req.session.myData.selectedStandard.larsCode)){
                    _deliversStandard = true
                    _hasAMatchcount++
                }

                //LOCATION
                var _providerBlacklisted = false
                if(req.session.myData.standard == 34 || req.session.myData.standard == 174){
                    _providerBlacklisted = true
                }
                _provider.search = false
                if(_deliversStandard && (_provider.national || _provider.locationmatch) && !_providerBlacklisted){
                    _hasAMatchcount++
                }

                //MATCHES ALL IT NEEDS TO?
                if(_hasAMatchcount == 2){
                    req.session.myData.providersOnStandardCount++
                }
            });

            res.render(version + '/provider', {
                myData:req.session.myData
            });
        }

    });

    // Provider - unavailable
    router.get('/' + version + '/provider-unavailable', function (req, res) {

        res.render(version + '/provider-unavailable', {
            myData:req.session.myData
        });

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
            searchFilterSetup(req,"End-point assessment organisation name")

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

            sortEPAOs(req, "name")

            res.render(version + '/epaos', {
                myData:req.session.myData
            });

        }

    });

    // EPAOs - 2 - for the EPAO journey
    router.get('/' + version + '/epaos-2', function (req, res) {

        req.session.myData.displaycount = 0
        req.session.myData.needToMatchCount = 1

        setSelectedStandard(req,req.session.myData.standard)

        if(req.session.myData.epaolocationAnswerApplied) {
            req.session.myData.needToMatchCount++
        }

        req.session.myData.epaos.list.forEach(function(_epao, index) {

            req.session.myData.hasAMatchcount = 0

            // Reset each epao
            _epao.search = false

            //STANDARD
            req.session.myData.selectedStandard.epaos.list.forEach(function(_epaoOnStandard, index) {
                if(_epaoOnStandard.toUpperCase() == _epao.name.toUpperCase()){
                    req.session.myData.hasAMatchcount++
                }
            });

            //REGION
            if(req.session.myData.epaolocationAnswerApplied) {
                _epao.search = false
                if(_epao.regions.includes(req.session.myData.epaolocationAnswer.toString()) || _epao.regions.includes("10")){
                    req.session.myData.hasAMatchcount++
                }
            }

            //MATCHES ALL IT NEEDS TO?
            if(req.session.myData.needToMatchCount > 0 && req.session.myData.needToMatchCount == req.session.myData.hasAMatchcount){
                _epao.search = true
                req.session.myData.displaycount++
            }

        });

        sortEPAOs(req, "name")

        res.render(version + '/epaos-2', {
            myData:req.session.myData
        });

    });

    // EPAOS
    router.get('/' + version + '/epaos-all', function (req, res) {

        //Sort
        sortSetup(req,"name")

        req.session.myData.searchfilters = []
        req.session.myData.displaycount = req.session.myData.epaos.list.length
        req.session.myData.needToMatchCount = 0

        //Location reset/setup
        // if(req.query.location || (req.session.myData.location != "" && req.session.myData.location)){
        //     req.session.myData.locationTemp = req.session.myData.location
        //     if(req.query.location == ""){
        //         req.session.myData.locationTemp = ""
        //     } else if (req.query.location) {
        //         req.session.myData.locationTemp = req.query.location.trim()
        //     }
        //     require("request").get('https://api.postcodes.io/postcodes/' + req.session.myData.locationTemp + '/autocomplete', (error, response, body) => {
        //         var _postCodeMatch = (JSON.parse(body).result && req.session.myData.locationTemp.length > 1)
        //         if(cityMatch(req) || _postCodeMatch) {
        //             req.session.myData.displaycount = 0
        //             req.session.myData.needToMatchCount++
        //             req.session.myData.location = req.session.myData.locationTemp
        //             req.session.myData.locationapplied = true
        //             req.session.myData.searchfilters.push({"value": req.session.myData.location, "type": "location", "typeText": "Location of apprenticeship"})
        //         } else {
        //             req.session.myData.locationapplied = false
        //             req.session.myData.location = ""
        //         }
        //         continueRendering()
        //     });
        // } else {
        //     continueRendering()
        // }
        continueRendering()

        function continueRendering(){

            // Standard filter reset/setup
            standardFilterSetup(req)

            // Keyword search reset/setup
            searchFilterSetup(req,"EPAO name")
    
            // Region filter setup
            regionFilterSetup(req)

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

                //SEARCH TERM
                if(req.session.myData.searchapplied) {
                    _epao.search = false
                    var _searchesToDo = [
                        {"searchOn": _epao.autoCompleteString,"exactrelevance": 999999,"withinrelevance": 100000,"ifmatch": "exit"}
                    ]
                    checkStandardSearchTerm(req,_epao,_searchesToDo)
                }

                // REGION
                if(req.session.myData.regionfiltersapplied) {
                    _epao.search = false
                    req.session.myData.regionfilters.forEach(function(_region, index) {
                        if(_epao.regions.includes(_region.toString()) || _epao.regions.includes("10")){
                            req.session.myData.hasAMatchcount++
                        }
                    });
                }

                //LOCATION
                // if(req.session.myData.locationapplied) {
                //     _epao.search = false
                //     if(_epao.locationmatch){
                //         req.session.myData.hasAMatchcount++
                //     }
                // }

                //MATCHES ALL IT NEEDS TO?
                if(req.session.myData.needToMatchCount > 0 && req.session.myData.needToMatchCount == req.session.myData.hasAMatchcount){
                    _epao.search = true
                    req.session.myData.displaycount++
                }

            });

            sortEPAOs(req, "name")

            res.render(version + '/epaos-all', {
                myData:req.session.myData
            });

        }

    });

    // EPAO
    router.get('/' + version + '/epao', function (req, res) {

        var _standards = req.session.myData.standards.list

        for (var i = 0; i < req.session.myData["epaos"].list.length; i++) {
            var _thisEPAO = req.session.myData["epaos"].list[i]
            if(req.session.myData.epao == _thisEPAO.id){
                req.session.myData.selectedEPAO = _thisEPAO
            }
        }

        // EPAO - standards list
        req.session.myData.displaycount = 0
        for (var i = 0; i < _standards.length; i++) {
            var _thisStandard = _standards[i]
            _thisStandard.matchesEPAO = false
            _thisStandard.epaos.list.forEach(function(_epaoOnStandard, index) {
                if(_epaoOnStandard.toUpperCase() == req.session.myData.selectedEPAO.name.toUpperCase()){
                    req.session.myData.displaycount++
                    _thisStandard.matchesEPAO = true
                }
            });
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
            res.render(version + '/epao', {
                myData:req.session.myData
            });
        }
    });

    // EPAO 2
    router.get('/' + version + '/epao-2', function (req, res) {

        // Selected EPAO
        req.session.myData.selectedEPAO = req.session.myData.epaos.list.find(obj => obj.id == req.session.myData.epao)

        setSelectedStandard(req,req.session.myData.standard)

        res.render(version + '/epao-2', {
            myData:req.session.myData
        });
    });

    // EPAO - course
    router.get('/' + version + '/epao-course', function (req, res) {
        res.render(version + '/epao-course', {
            myData: req.session.myData
        });
    });
    router.post('/' + version + '/epao-course', function (req, res) {
        req.session.myData.epaocourseAnswerTemp = req.body.epaocourseAnswer
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.epaocourseAnswerTemp = req.session.myData.epaocourseAnswerTemp || req.session.myData.standards.list[0].larsCode
        }
        if(!req.session.myData.epaocourseAnswerTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.epaocourseAnswer = {
                "anchor": "epaocourse-1",
                "message": "Select an apprenticeship training course"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/epao-course', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.epaocourseAnswer = req.session.myData.epaocourseAnswerTemp
            req.session.myData.standard = req.session.myData.epaocourseAnswer
            req.session.myData.epaolocationAnswerApplied = false
            req.session.myData.epaocourseAnswerTemp = ''

            setSelectedStandard(req,req.session.myData.standard)

            req.session.myData.epaoCount = req.session.myData.selectedStandard.epaos.number



            if(req.session.myData.selectedStandard.integratedDegree == "integrated degree" || req.session.myData.selectedStandard.title.toUpperCase().indexOf("(INTEGRATED") != -1) {
                //integrated course
                res.redirect(301, '/' + version + '/epao-integrated?s=epao&standard=' + req.session.myData.standard);
            } else {
                if(req.session.myData.epaoCount == 0){
                    //0 EPAOs
                    req.session.myData.returnURLepaodropout = "epao-course"
                    req.session.myData.dropout = "epaocourse"
                    res.redirect(301, '/' + version + '/epao-dropout?s=epao&standard=' + req.session.myData.standard);
                } else {
                    var _hasANonNational = false
                    req.session.myData.epaos.list.forEach(function(_epao, index) {
                        if(_epao.regions != 10){
                            var _nonNational = req.session.myData.selectedStandard.epaos.list.find(obj => obj === _epao.name)
                            if(_nonNational){
                                _hasANonNational = true
                            }
                        }
                    });
                    // if(_hasANonNational){
                    //     //1 or more Non National EPAOs
                    //     res.redirect(301, '/' + version + '/epao-location?s=epao&standard=' + req.session.myData.epaocourseAnswer);
                    // } else 
                    if (req.session.myData.epaoCount == 1)  {
                        //Single National EPAO
                        req.session.myData.returnURLepao2 = "epao-course"
                        var _epao = req.session.myData.epaos.list.find(obj => obj.name === req.session.myData.selectedStandard.epaos.list[0])
                        res.redirect(301, '/' + version + '/epao-2?s=epao&epao=' + _epao.id + '&standard=' + req.session.myData.standard);
                    } else {
                        //More than 1 National EPAOs
                        req.session.myData.returnURLepaos2 = "epao-course"
                        res.redirect(301, '/' + version + '/epaos-2?s=epao&standard=' + req.session.myData.standard);
                    }
                }
            }
        }
    });

    // EPAO - location
    router.get('/' + version + '/epao-location', function (req, res) {

        req.session.myData.newregions = req.session.myData.regions
        req.session.myData.newregions.sort(function(a,b){
            if (a.label.toUpperCase() < b.label.toUpperCase()){
                return -1
            } else if(a.label.toUpperCase() > b.label.toUpperCase()){
                return 1
            }
            return 0;
        });

        setSelectedStandard(req,req.session.myData.standard)

        res.render(version + '/epao-location', {
            myData: req.session.myData
        });
    });
    router.post('/' + version + '/epao-location', function (req, res) {
        req.session.myData.epaolocationAnswerTemp = req.body.epaolocationAnswer
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.epaolocationAnswerTemp = req.session.myData.epaolocationAnswerTemp || 1
        }
        if(!req.session.myData.epaolocationAnswerTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.epaolocationAnswer = {
                "anchor": "epaolocation-1",
                "message": "Select where the apprenticeship is"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/epao-location', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.epaolocationAnswer = req.session.myData.epaolocationAnswerTemp
            req.session.myData.epaolocationAnswerApplied = true
            req.session.myData.epaolocationAnswerTemp = ''

            req.session.myData.selectedRegion = req.session.myData.regions.find(obj => obj.id == req.session.myData.epaolocationAnswer)

            // req.session.myData.selectedRegion = 

            var _matches = 0,
                _matchedEPAOid = 1
           
            req.session.myData.selectedStandard.epaos.list.forEach(function(_epaoOnStandard, index) {
                var _epao = req.session.myData.epaos.list.find(obj => obj.name.toUpperCase() === _epaoOnStandard.toUpperCase())
                if(_epao && (_epao.regions.includes(req.session.myData.epaolocationAnswer.toString()) || _epao.regions.includes("10"))){
                    _matchedEPAOid = _epao.id
                    _matches++
                }
            });

            if(_matches == 0) {
                // dropout
                req.session.myData.returnURLepaodropout = "epao-location"
                req.session.myData.dropout = "epaolocation"
                res.redirect(301, '/' + version + '/epao-dropout?s=epao&standard=' + req.session.myData.standard);
            } else {
                req.session.myData.epaoCount = _matches
                if(_matches == 1) {
                    // direct to EPAO
                    req.session.myData.returnURLepao2 = "epao-location"
                    res.redirect(301, '/' + version + '/epao-2?s=epao&epao=' + _matchedEPAOid + '&standard=' + req.session.myData.standard);
                } else {
                    // more than 1 epao
                    req.session.myData.returnURLepaos2 = "epao-location"
                    res.redirect(301, '/' + version + '/epaos-2?s=epao&standard=' + req.session.myData.epaocourseAnswer);
                }
            }


        }
    });

    // EPAO dropout
    router.get('/' + version + '/epao-dropout', function (req, res) {

        setSelectedStandard(req,req.session.myData.standard)

        res.render(version + '/epao-dropout', {
            myData:req.session.myData
        });
    });

    // EPAO integrated
    router.get('/' + version + '/epao-integrated', function (req, res) {

        setSelectedStandard(req,req.session.myData.standard)

        res.render(version + '/epao-integrated', {
            myData:req.session.myData
        });
    });


    // Shortlist
    router.get('/' + version + '/shortlist', function (req, res) {

        setSelectedStandard(req,req.query.standard || "")
        addRemoveFavourite(req,true)

        res.render(version + '/shortlist', {
            myData:req.session.myData
        });
    });

    // Shortlist - remove confirm
    router.get('/' + version + '/shortlist-remove', function (req, res) {

        // Selected Standard
        setSelectedStandard(req,req.query.standard)
        
        // Selected provider 
        setSelectedProvider(req,req.query.favdel)

        res.render(version + '/shortlist-remove', {
            myData: req.session.myData
        });
    });
    router.post('/' + version + '/shortlist-remove', function (req, res) {
        req.session.myData.removeshortlistAnswerTemp = req.body.removeshortlistAnswer
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.removeshortlistAnswerTemp = req.session.myData.removeshortlistAnswerTemp || "yes"
        }
        if(!req.session.myData.removeshortlistAnswerTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.removeshortlistAnswer = {
                "anchor": "removeshortlist-1",
                "message": "Select whether to remove the training provider from your shortlist or not"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/shortlist-remove', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.removeshortlistAnswer = req.session.myData.removeshortlistAnswerTemp
            req.session.myData.removeshortlistAnswerTemp = ''

            if(req.session.myData.removeshortlistAnswer == "yes"){
                res.redirect(301, '/' + version + '/shortlist?favdel=' + req.session.myData.selectedProvider.id + '&standard=' + req.session.myData.selectedStandard.larsCode);
            } else {
                res.redirect(301, '/' + version + '/shortlist');
            }
            
        }
    });

}