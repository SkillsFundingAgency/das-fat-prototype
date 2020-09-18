const express = require('express')
const router = express.Router()

// Base session data
var _myData = {
    "maxrows": 999999,
    "populateShortlist": false,
    "favourites": [],
    "favourites2": [],
    "totalFavourites": 0,
    "includeValidation": "true",
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
            "equiv2": "GCSE grades 9 to 4",
            "equiv3": "GCSE"
        }, 
        {
            "value": "3",
            "equiv": "A level",
            "equiv2": "A level",
            "equiv3": "A level"
        }, 
        {
            "value": "4",
            "equiv": "HNC",
            "equiv2": "HNC",
            "equiv3": "higher national certificate (HNC)"
        }, 
        {
            "value": "5",
            "equiv": "HND",
            "equiv2": "foundation degree",
            "equiv3": "higher national diploma (HND)"
        }, 
        {
            "value": "6",
            "equiv": "degree",
            "equiv2": "degree",
            "equiv3": "degree"
        }, 
        {
            "value": "7",
            "equiv": "master’s degree",
            "equiv2": "master’s degree",
            "equiv3": "master’s degree"
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
    "epaos": require(__dirname + '/data/epaos.json'),
    "providers-ordering": require(__dirname + '/data/providers-ordering.json'),
    "providers-ordering-2": require(__dirname + '/data/providers-ordering-2.json'),
    "provideFeedbackFactors": [
        {
            "id": "_factor-1",
            "name": "Communication with employers"
        },
        {
            "id": "_factor-2",
            "name": "Adapting to my needs"
        },
        {
            "id": "_factor-3",
            "name": "Initial assessment of apprentices"
        },
        {
            "id": "_factor-4",
            "name": "Getting new apprentices started"
        },
        {
            "id": "_factor-5",
            "name": "Working with small numbers of apprentices"
        },
        {
            "id": "_factor-6",
            "name": "Providing the right training at the right time"
        },
        {
            "id": "_factor-7",
            "name": "Training facilities"
        },
        {
            "id": "_factor-8",
            "name": "Reporting on progress of apprentices"
        },
        {
            "id": "_factor-9",
            "name": "Improving apprentice skills"
        } 
    ],
    "provideFeedbackFactors2": [
        {
            "id": "_factor-1",
            "name": "Checking suitability of the apprenticeship for the job role"
        },
        {
            "id": "_factor-2",
            "name": "Assistance with apprentice recruitment"
        },
        {
            "id": "_factor-3",
            "name": "Giving access to a complaints procedure"
        },
        {
            "id": "_factor-4",
            "name": "Explaining off-the-job training"
        },
        {
            "id": "_factor-5",
            "name": "Planning the apprentice’s curriculum around any prior learning"
        },
        {
            "id": "_factor-6",
            "name": "Agreeing a total price"
        },
        {
            "id": "_factor-7",
            "name": "Confirming apprentice details within the service"
        }
    ],
    "provideFeedbackFactors3": [
        {
            "id": "_factor-1",
            "name": "Assistance with apprentice recruitment"
        },
        {
            "id": "_factor-2",
            "name": "Giving access to a complaints procedure"
        },
        {
            "id": "_factor-3",
            "name": "Explaining off-the-job training"
        },
        {
            "id": "_factor-4",
            "name": "Planning the apprentice’s curriculum around any prior learning"
        },
        {
            "id": "_factor-5",
            "name": "Confirming apprentice details within the service"
        }
    ]
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


///
///
// for test data
///
///
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





//
//
// FOR DOING TESTS ON IFATE DATA
//
//

// // for pulling out counts of statuses on all stds in IFATE api
// _myData.testStandardsData = []
// console.log("test")

// // Date 
// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();
// today = dd + '/' + mm + '/' + yyyy;

// require("request").get("https://www.instituteforapprenticeships.org/api/apprenticeshipstandards", (error, response, body) => {
//     var _apiData = JSON.parse(body),
//         _statusTypes = {},
//         _versionTypes = {},
//         _integratedDegreeTypes = {},
//         _integratedDegreeTypesApproved = {},
//         _integratedInTitleTypes = {},
//         _approvedForDelivery = 0,
//         _integratedInTitle = 0,
//         _integratedOnlyInTitle = 0,
//         _integratedDegreeInTitle = 0,
//         _integratedInTitleNotFlagged = 0,
//         _integratedNotInTitleFlagged = 0,
//         hasFullStop = 0,
//         doesntHaveFullStop = 0,
//         endsInSpace = 0,
//         _testStandardsData = []
//     console.log(_apiData.length + " standards in API (https://www.instituteforapprenticeships.org/api/apprenticeshipstandards) - checked on " + today)
//     _apiData.forEach(function(_standard, index) {
//         _statusTypes[_standard.status] = (_statusTypes[_standard.status] || 0) + 1
//         _versionTypes["version " + _standard.version] = (_versionTypes["version " + _standard.version] || 0) + 1
//         _integratedDegreeTypes[_standard.integratedDegree] = (_integratedDegreeTypes[_standard.integratedDegree] || 0) + 1
//         var _title = _standard.title + " (level " + _standard.level + ")",
//             _standardData = {}
        
//         _standardData.larsCode = _standard.larsCode
//         _standardData.title = _title
//         _standardData.overview = _standard.overviewOfRole

//         if(_standardData.overview.trim().slice(-1) == "."){
//             console.log("larsCode: " + _standardData.larsCode + " - " + _standardData.title)
//             hasFullStop++
//         } else {
//             doesntHaveFullStop++
//         }

//         if(_standardData.overview.slice(-1) == " "){
//             // console.log("ends in a space = larsCode: " + _standardData.larsCode + " - " + _standardData.title)
//             endsInSpace++
//         }

//         if(_standard.status == "Approved for delivery"){
//             _approvedForDelivery++
//             _integratedDegreeTypesApproved[_standard.integratedDegree] = (_integratedDegreeTypesApproved[_standard.integratedDegree] || 0) + 1
//             _testStandardsData.push(_standardData)
//         }
//         if(_standard.coreAndOptions && _standard.skills.length > 0){
//             // console.log(_title + " has " + _standard.skills.length + " skills.")
//         }


//         // FOR COMPARING ARRAYS
//         // Warn if overriding existing method
//         // if(Array.prototype.equals)
//         // console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
//         // attach the .equals method to Array's prototype to call it on any array
//         Array.prototype.equals = function (array) {
//             // if the other array is a falsy value, return
//             if (!array)
//                 return false;

//             // compare lengths - can save a lot of time 
//             if (this.length != array.length)
//                 return false;

//             for (var i = 0, l=this.length; i < l; i++) {
//                 // Check if we have nested arrays
//                 if (this[i] instanceof Array && array[i] instanceof Array) {
//                     // recurse into the nested arrays
//                     if (!this[i].equals(array[i]))
//                         return false;       
//                 }           
//                 else if (this[i] != array[i]) { 
//                     // Warning - two different object instances will never be equal: {x:20} != {x:20}
//                     return false;   
//                 }           
//             }       
//             return true;
//         }
//         // Hide method from for-in loops
//         Object.defineProperty(Array.prototype, "equals", {enumerable: false});
//         if(!_standard.typicalJobTitles.equals(_standard.jobRoles)){
//             // console.log(_title + " - DONT MATCH")
//             // console.log(_standard.typicalJobTitles)
//             // console.log(_standard.jobRoles)
//         }
//         // console.log("checked")
//         // console.log(_title)

//         if((_standard.title.toUpperCase().indexOf("(INTEGRATED") != -1) && _standard.status == "Approved for delivery"){
//             _integratedInTitle++
//             _integratedInTitleTypes[_standard.integratedDegree] = (_integratedInTitleTypes[_standard.integratedDegree] || 0) + 1
//         }

//         if((_standard.title.toUpperCase().indexOf("(INTEGRATED)") != -1) && _standard.status == "Approved for delivery"){
//             _integratedOnlyInTitle++
//         }

//         if((_standard.title.toUpperCase().indexOf("(INTEGRATED DEGREE)") != -1) && _standard.status == "Approved for delivery"){
//             _integratedDegreeInTitle++
//         }


//         // Integrated in title but not flagged
//         if((_standard.title.toUpperCase().indexOf("(INTEGRATED") != -1 && _standard.integratedDegree != "integrated degree") && _standard.status == "Approved for delivery"){
//             // console.log(_standard.title)
//             // console.log("   -----   integratedDegree = " + _standard.integratedDegree)
//             // console.log(_standard.larsCode)
//             _integratedInTitleNotFlagged++
//         }

//         // Flagged but not in title
//         if((_standard.title.toUpperCase().indexOf("(INTEGRATED") == -1 && _standard.integratedDegree == "integrated degree") && _standard.status == "Approved for delivery"){
//             // console.log(_standard.title)
//             // console.log("   -----   integratedDegree = " + _standard.integratedDegree)
//             // console.log(_standard.larsCode)
//             _integratedNotInTitleFlagged++
//         }

        
//     });

//     console.log("hasFullStop = " + hasFullStop)
//     console.log("doesntHaveFullStop = " + doesntHaveFullStop)
//     console.log("endsInSpace = " + endsInSpace);

    
    
//     // console.log("-----------------")
//     // console.log(_approvedForDelivery + " 'Approved for delivery' standards on " + today)
//     // console.log(_integratedDegreeTypesApproved)
//     // console.log("-----------------")

//     // console.log(_integratedInTitle + " with '(integrated' in title (case insensitive) and 'Approved for delivery'")
//     // console.log(_integratedInTitleTypes)
//     // console.log("-----------------")
//     // console.log(_integratedOnlyInTitle + " with '(integrated)' in title (case insensitive) and 'Approved for delivery'")
//     // console.log(_integratedDegreeInTitle + " with '(integrated degree)' in title (case insensitive) and 'Approved for delivery'")

//     // console.log(_integratedInTitleNotFlagged + " with (integrated in title but NOT flagged")
//     // console.log(_integratedNotInTitleFlagged + " without (integrated in title but IS flagged")
//     // console.log("START")
//     // console.log(JSON.stringify(_testStandardsData))
//     // console.log("END")
// });
// // var distinctStatuses = [...new Set(_apiData.map(function(data){return data.statuses}))];







// Set ssa + route counts
// Regulated
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

    //Set integrated
    if(_standard.integratedDegree == "integrated degree" || _standard.title.toUpperCase().indexOf("(INTEGRATED") != -1){
        _standard.integrated = true
    } else {
        _standard.integrated = false
    }

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

    //Set route code
    var _selectedRoute = _myData.routes.list.find(obj => obj.name.toLowerCase() === _standard.route.toLowerCase())
    if(_selectedRoute){
        _standard.routecode = _selectedRoute.code
    }

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
    //Set empty trading names if doesnt have any
    _provider.tradingNames = _provider.tradingNames || []
    //Set autocomplete string
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
var _standardsOnEPAOsCounts = {}
_myData.epaos.list.forEach(function(_epao, index) {
    //autocomplete string
    var _autoCompleteString = _epao.name
    _epao.autoCompleteString = _autoCompleteString
    _myData.epaoAutocompleteList.push(_autoCompleteString);
    //Convert regions to array
    _epao.regions = _epao.regions.split(',');
    //number of standards
    var _stdCount = 0
    _epao.standards = []
    for (var i = 0; i < _myData.standards.list.length; i++) {
        var _thisStandard = _myData.standards.list[i]
        _thisStandard.epaos.list.forEach(function(_epaoOnStandard, index) {
            if(_epaoOnStandard.toUpperCase() == _epao.name.toUpperCase()){
                _epao.standards.push(_thisStandard.autoCompleteString)
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
require('./routes/7-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/8-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/9-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/10-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/11-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/12-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/13-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/14-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));


module.exports = router