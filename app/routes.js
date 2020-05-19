const express = require('express')
const router = express.Router()

// Base session data
var _myData = {
    "standards": require(__dirname + '/data/standards.json'),
    "ssa": require(__dirname + '/data/ssa.json'),
    "routes": require(__dirname + '/data/routes.json'),
    "levels": [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7"
    ],
    "levels2": [
        {
            "value": "2",
            "equiv": "GCSE grades 9 to 4",
            "equiv2": "GCSE grades 9 to 4"
        }, 
        {
            "value": "3",
            "equiv": "A level",
            "equiv2": "A level"
        }, 
        {
            "value": "4",
            "equiv": "HNC",
            "equiv2": "HNC"
        }, 
        {
            "value": "5",
            "equiv": "HND",
            "equiv2": "foundation degree"
        }, 
        {
            "value": "6",
            "equiv": "degree",
            "equiv2": "degree"
        }, 
        {
            "value": "7",
            "equiv": "master’s degree",
            "equiv2": "master’s degree"
        }
    ],
    "regions": [
        {"id":1,"label":"North East"},
        {"id":2,"label":"North West"},
        {"id":3,"label":"Yorkshire and the Humber"},
        {"id":4,"label":"East Midlands"},
        {"id":5,"label":"West Midlands"},
        {"id":6,"label":"East of England"},
        {"id":7,"label":"London"},
        {"id":8,"label":"South East"},
        {"id":9,"label":"South West"},
        {"id":10,"label":"All England"}
    ],
    "providers": require(__dirname + '/data/providers.json'),
    "providers-new": require(__dirname + '/data/providers-new.json'),
    "epaos": require(__dirname + '/data/epaos.json')
}

// DO NOT UNCOMMENT AND PUSH LIVE
// require('./generate-data-standards.js')(router,_myData);
// require('./generate-data-providers.js')(router,_myData);

//Sort new providers
_myData["providers-new"].list.sort(function(a,b){
    return b.ukprn - a.ukprn
});

//Sort standards
_myData.standards.list.sort(function(a,b){
    if (a.title.toUpperCase() < b.title.toUpperCase()){
    // if (a.larsCode < b.larsCode){
        return -1
    } else if(a.title.toUpperCase() > b.title.toUpperCase()){
    // } else if(a.larsCode > b.larsCode){
        return 1
    }
    return 0;
});

// Sort routes
_myData.routes.list.sort(function(a,b){
    if (a.name.toUpperCase() < b.name.toUpperCase()){
        return -1
    } else if(a.name.toUpperCase() > b.name.toUpperCase()){
        return 1
    }
    return 0;
});

var _epaosOnStandards = require(__dirname + '/data/epaos-on-standards.json')
// for test data
var _epaosOnStandardsCounts = {}
for (var _epaoLarsCode in _epaosOnStandards) {
    var _epaos = _epaosOnStandards[_epaoLarsCode]
    if(_epaosOnStandards[_epaoLarsCode] == "EPAO in principle - application pending"){
        _epaosOnStandardsCounts["principle"] = (_epaosOnStandardsCounts["principle"] || 0) + 1
    } else {
        _epaosOnStandardsCounts[_epaos.length] = (_epaosOnStandardsCounts[_epaos.length] || 0) + 1
    }
}
_myData.epaosOnStandardsCounts = _epaosOnStandardsCounts

// Set ssa + route counts
var _routeCounts = {},
    _ssaCounts = {}
_myData.standardAutocompleteList = []
var _regulatedProvider6 = 0,
    _regulatedProvider7 = 0
_myData.standards.list.forEach(function(_standard, index) {
    // console.log(_standard.coreSkillsCount)
    // if(_standard.coreSkillsCount > 0) {
    //     console.log(_standard.larsCode + " - " + _standard.coreSkillsCount + " - " + _standard.title + " (level " + _standard.level + ")")
    // }

    //Set regulated data
    var _EPAOOnly = true
    
    if(_standard.regulated){
        _standard.regulatedEPAOOnly = false
        if(_standard.regulationDetail.length > 0){
            // Training provider (6)
            if(_standard.regulatedBody == ""){
                _standard.regulatedProvider = true
                _standard.regulatedProvider6 = true
                _regulatedProvider6++
                _EPAOOnly = false
            }
            _standard.regulationDetail.forEach(function(_regulationDetail, index) {
                // EPAO (1,2,5)
                if(_regulationDetail.name == "EPAO" || _regulationDetail.name == "EPAO "){
                    _standard.regulatedEPAO = true
                }
                // Training provider (1,2,3,4)
                if(_regulationDetail.name == "Training provider" || _regulationDetail.name == "Training provider "){
                    _standard.regulatedProvider = true
                    _EPAOOnly = false
                }
            });
        } else {
            // Training provider (7)
            _standard.regulatedProvider = true
            _standard.regulatedProvider7 = true
            _regulatedProvider7++
            _EPAOOnly = false
        }
        if(_standard.regulatedEPAO && _EPAOOnly){
            _standard.regulatedEPAOOnly = true
        }
    }

    //Set Providers on each standard
    _standard.providers2 = {
        "number": 0,
        "list": []
    }
    _myData["providers-new"].list.forEach(function(_provider, index) {
        if(_provider.courses.includes(_standard.larsCode)){
            _standard.providers2.number++
            _standard.providers2.list.push(_provider.id)
        }
    })

    //Set EPAOs on each standard
    for (var _epaoLarsCode in _epaosOnStandards) {
        if(_standard.larsCode == _epaoLarsCode){
            var _epaos = _epaosOnStandards[_epaoLarsCode],
                _epaoObj = {
                    "number":_epaos.length,
                    "inprinciple": false,
                    "list": _epaos
                }
            if(_epaos == "EPAO in principle - application pending"){
                _epaoObj = {
                    "number":0,
                    "inprinciple": true,
                    "list": []
                }
            }
            _standard["epaos"] = _epaoObj
        }
    }

    // Set autocomplete string
    var _autoCompleteString = _standard.title + " (level " + _standard.level + ")"
    _standard.autoCompleteString = _autoCompleteString
    _myData.standardAutocompleteList.push(_autoCompleteString);

    // Set maxFunding formatted value
    _standard.maxFundingFormatted = _standard.maxFunding.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    // Set route and ssa counts
    _routeCounts[_standard.route.toLowerCase()] = (_routeCounts[_standard.route.toLowerCase()] || 0) + 1
    _ssaCounts[_standard.ssa1.toLowerCase()] = (_ssaCounts[_standard.ssa1.toLowerCase()] || 0) + 1
    _ssaCounts[_standard.ssa2.toLowerCase()] = (_ssaCounts[_standard.ssa2.toLowerCase()] || 0) + 1
});
// console.log("_regulatedProvider6 = " + _regulatedProvider6)
// console.log("_regulatedProvider7 = " + _regulatedProvider7)
_myData.routes.list.forEach(function(_route, index) {
    _route.standardsCount = _routeCounts[_route.name.toLowerCase()] || 0;
});
_myData.ssa.list.forEach(function(_ssa1, index) {
    _ssa1.standardsCount = _ssaCounts[_ssa1.code.toString() + " " + _ssa1.name.toLowerCase()] || 0;
    _ssa1.ssa2s.forEach(function(_ssa2, index) {
        _ssa2.standardsCount = _ssaCounts[_ssa2.code.toString() + " " + _ssa2.name.toLowerCase()] || 0;
    });
}); 

// Set providers
_myData.providerAutocompleteList = []
_myData.providers.list.forEach(function(_provider, index) {
    var _autoCompleteString = _provider.name
    _provider.autoCompleteString = _autoCompleteString
    _myData.providerAutocompleteList.push(_autoCompleteString);
});

// Set providers new
var _goodProviders = 0,
    _excellentProviders = 0,
    _poorProviders = 0,
    _veryPoorProviders = 0
_myData.providerNewAutocompleteList = []
_myData["providers-new"].list.forEach(function(_provider, index) {
    var _autoCompleteString = _provider.name
    _provider.autoCompleteString = _autoCompleteString
    _myData.providerNewAutocompleteList.push(_autoCompleteString);
    //Set average rating text
    _provider.averageEmpRating = parseFloat(_provider.averageEmpRating)
    _provider.averageEmpRatingPlus1 = parseFloat(_provider.averageEmpRating) + 1
    var _rating = _provider.averageEmpRating,
        _ratingText = "Good",
        _ratingID = 2
    if (_rating > 0 & _rating < 1.3){
        _ratingText = "Very poor"
        _ratingID = 4
        _veryPoorProviders++
    } else if (_rating >= 1.3 && _rating < 2.3){
        _ratingText = "Poor"
        _ratingID = 3
        _poorProviders++
    } else if (_rating >= 2.3 && _rating < 3.3){
        _ratingText = "Good"
        _ratingID = 2
        _goodProviders++
    } else if (_rating >= 3.3){
        _ratingText = "Excellent"
        _ratingID = 1
        _excellentProviders++
    }
    _provider.averageEmpRatingText = _ratingText
    _provider.averageEmpRatingID = _ratingID
    //Set total ratings count
    _provider.totalEmpRatings = _provider.empRatings["excellent"] + _provider.empRatings["good"] + _provider.empRatings["poor"] + _provider.empRatings["very poor"]
    //Set percentages
    function percentage(_total, _value){
        var _percentage = Math.round(_value/(_total/100))
        return _percentage
    }
    _provider.empRatingsPercentages = {
        "excellent": percentage(_provider.totalEmpRatings, _provider.empRatings["excellent"]),
        "good": percentage(_provider.totalEmpRatings, _provider.empRatings["good"]),
        "poor": percentage(_provider.totalEmpRatings, _provider.empRatings["poor"]),
        "very poor": percentage(_provider.totalEmpRatings, _provider.empRatings["very poor"]) 
    }
});

// Set epaos
_myData.epaoAutocompleteList = []
var _locationmatchFalses = 0
var _standardsOnEPAOsCounts = {}
_myData.epaos.list.forEach(function(_epao, index) {
    //autocomplete string
    var _autoCompleteString = _epao.name
    _epao.autoCompleteString = _autoCompleteString
    _myData.epaoAutocompleteList.push(_autoCompleteString);
    //Set location matches
    var _locationmatch = [true,false][Math.floor(Math.random()*2)];
    if(_locationmatch == false){
        _locationmatch = (_locationmatchFalses++ > 24)
    }
    _epao.locationmatch = _locationmatch  
    //Convert regions to array
    _epao.regions = _epao.regions.split(',');
    //number of standards
    var _stdCount = 0
    for (var i = 0; i < _myData.standards.list.length; i++) {
        var _thisStandard = _myData.standards.list[i]
        _thisStandard.epaos.list.forEach(function(_epaoOnStandard, index) {
            if(_epaoOnStandard.toUpperCase() == _epao.name.toUpperCase()){
                _stdCount++
            }
        });
    }
    _epao.stdCount = _stdCount
    _standardsOnEPAOsCounts[_stdCount] = (_standardsOnEPAOsCounts[_stdCount] || 0) + 1
});
_myData.standardsOnEPAOsCounts = _standardsOnEPAOsCounts

// Set cities list
_myData.citiesAutocompleteList = []
require(__dirname + '/data/cities.json').list.forEach(function(_city, index) {
    var _suffix = (_city.city == _city.admin || _city.admin == "") ? "" : (", " + _city.admin),
        _autoCompleteString = _city.city + _suffix
    _myData.citiesAutocompleteList.push(_autoCompleteString);
});
_myData.citiesAutocompleteList.sort(function(a,b){
    if (a.toUpperCase() < b.toUpperCase()){
        return -1
    } else if(a.toUpperCase() > b.toUpperCase()){
        return 1
    }
    return 0;
});


require('./routes/1-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/2-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/3-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/4-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/4-1/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/5-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/6-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));


module.exports = router