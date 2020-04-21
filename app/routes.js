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
    "providers": require(__dirname + '/data/providers.json'),
    "providers-new": require(__dirname + '/data/providers-new.json'),
    "epaos": require(__dirname + '/data/epaos.json')
}

// Uncomment to generate standards.json data - it will magically appear in the console
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

// Set ssa + route counts
var _routeCounts = {},
    _ssaCounts = {}
_myData.standardAutocompleteList = []
_myData.standards.list.forEach(function(_standard, index) {
    // console.log(_standard.coreSkillsCount)
    // if(_standard.coreSkillsCount > 0) {
    //     console.log(_standard.larsCode + " - " + _standard.coreSkillsCount + " - " + _standard.title + " (level " + _standard.level + ")")
    // }

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
    var _epaosOnStandards = require(__dirname + '/data/epaos-on-standards.json')
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
_myData.providerNewAutocompleteList = []
_myData["providers-new"].list.forEach(function(_provider, index) {
    var _autoCompleteString = _provider.name
    _provider.autoCompleteString = _autoCompleteString
    _myData.providerNewAutocompleteList.push(_autoCompleteString);
});

// Set epaos
_myData.epaoAutocompleteList = []
var _locationmatchFalses = 0
_myData.epaos.list.forEach(function(_epao, index) {
    var _autoCompleteString = _epao.name
    _epao.autoCompleteString = _autoCompleteString
    _myData.epaoAutocompleteList.push(_autoCompleteString);
    //Set location matches
    var _locationmatch = [true,false][Math.floor(Math.random()*2)];
    if(_locationmatch == false){
        _locationmatch = (_locationmatchFalses++ > 24)
    }
    _epao.locationmatch = _locationmatch  
});
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
require('./routes/5-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));


module.exports = router