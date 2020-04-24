module.exports = function (router,_myData) {
    //
    //
    //GENERATE providers data
    //
    //
    var _newProviders = _myData["providers-new"],
        _inadequateRatings = 0,
        _nationals = 0,
        _courseIDS = [],
        _poorProviders = 0,
        _excellentProviders = 0

    _myData.standards.list.forEach(function(_standard, index) {
        var _courseIDObj = {
            "larsCode": _standard.larsCode,
            "used": 0
        }
        _courseIDS.push(_courseIDObj)
    });

    _newProviders.list.forEach(function(_provider, index) {

        // Add - "ofsted" - 0,1,2,3,4
        var _ofsted = [0,1,2,3,4][Math.floor(Math.random()*5)];
        if(_ofsted == 4){
            _inadequateRatings++
            if(_inadequateRatings > 50){
                _ofsted = 2
            }
        }
        _provider.ofsted = _ofsted

        // Add - "national" - true/false
        var _national = [true,false][Math.floor(Math.random()*2)];
        if(_national == true){
            _nationals++
            if(_nationals > 500){
                _national = false
            }
        }
        _provider.national = _national

        // Add - "distance"
        _provider.distance = Math.floor(Math.random() * 99) + 1 + Math.round(Math.random() * 10) / 10

        // Add - "locationmatch"
        _provider.locationmatch = [true,false][Math.floor(Math.random()*2)]

        // Add - Courses offered (list) ------ old on standard = "providers":{"number":2}
        var _coursesToAdd = Math.floor(Math.random() * 40) + 1,
            _providersCourses = []
        for (var i = 0; i < _coursesToAdd; i++) {
            //find a random course
            var _randomCourse = _courseIDS[Math.floor(Math.random() * _courseIDS.length)];
            _providersCourses.push(_randomCourse.larsCode)
        }
        _provider.courses = _providersCourses

        // Add - Employer reviews data - ratings - ["excellent","good","poor","very poor"]
        var _numberOfRatings = Math.floor(Math.random() * (62 - 16 + 1) + 16),
            _empRatings = {
                "excellent": 0,
                "good": 0,
                "poor": 0,
                "very poor": 0
            },
            _goodRatings = [
                {
                    "rating": "excellent", 
                    "cutoff": Math.ceil(_numberOfRatings/4)
                },
                {
                    "rating": "good", 
                    "cutoff": _numberOfRatings
                },
                {
                    "rating": "poor", 
                    "cutoff": Math.ceil(_numberOfRatings/10)
                },
                {
                    "rating": "very poor", 
                    "cutoff": Math.ceil(_numberOfRatings/_numberOfRatings)
                }
            ],
            _poorRatings = [
                {
                    "rating": "excellent", 
                    "cutoff": Math.ceil(_numberOfRatings/16)
                },
                {
                    "rating": "good", 
                    "cutoff": Math.ceil(_numberOfRatings/10)
                },
                {
                    "rating": "poor", 
                    "cutoff": _numberOfRatings
                },
                {
                    "rating": "very poor", 
                    "cutoff": Math.ceil(_numberOfRatings/3)
                }
            ],
            _excellentRatings = [
                {
                    "rating": "excellent", 
                    "cutoff": _numberOfRatings
                },
                {
                    "rating": "good", 
                    "cutoff": Math.ceil(_numberOfRatings/8)
                },
                {
                    "rating": "poor", 
                    "cutoff": Math.ceil(_numberOfRatings/32)
                },
                {
                    "rating": "very poor", 
                    "cutoff": 0
                }
            ]

        //which set to use
        var _empSetToUse = _poorRatings
        if(_poorProviders > 200){
            _empSetToUse = _excellentRatings
            if(_excellentProviders > 600){
                _empSetToUse = _goodRatings
            }
            _excellentProviders++
        }
        _poorProviders++

        for (var i = 0; i < _numberOfRatings; i++) {

            //for each rating to use
            var _employerRatingToUse = _empSetToUse[Math.floor(Math.random()*4)];

            //check if hit cut off
            function checkCutoff(){
                if(_empRatings[_employerRatingToUse.rating] > _employerRatingToUse.cutoff){
                    _employerRatingToUse = _empSetToUse[Math.floor(Math.random()*4)];
                    checkCutoff()
                }
            }
            checkCutoff()
            
            //add to object
            _empRatings[_employerRatingToUse.rating]++
        }
        _provider.empRatings = _empRatings

        // average rating
        var _excellentTotal = _empRatings["excellent"] * 4,
            _goodTotal = _empRatings["good"] * 3,
            _poorTotal = _empRatings["poor"] * 2,
            _veryPoorTotal = _empRatings["very poor"] * 1,
            _averageEmpRating = (_excellentTotal + _goodTotal + _poorTotal + _veryPoorTotal) / _numberOfRatings
        _averageEmpRating = (Math.round(_averageEmpRating * 10) / 10).toFixed(1)
        _provider.averageEmpRating = _averageEmpRating

        // ??????? Contact details - email,website,phone
        // ??????? About provider (free text)

    });

    //  FINAL OUTPUT - check console log
    //
    //
    //
    // console.log(JSON.stringify(_newProviders)) 
    //
    //
    //
    //  



    //
    // Generating extra provider info
    //

    // 1,500 providers

    //
    // Cities list
    //

    // Example
    //
    // function randomBoolean(_chance){
    //     return Math.random() < _chance
    // }
    // if(randomBoolean(0.1)){
    //     _reservation.status = "used"
    // } else {
    //     _reservation.status = "available"
    // }

    // Chance = 6
    //
    // London

    // Chance = 1
    //
    // Birmingham

    // Chance = 0.35
    //
    // Liverpool
    // Sheffield
    // Leeds
    // Manchester
    // Bristol

    // Chance = 0.25
    //
    // Coventry
    // Leicester
    // Bradford
    // Nottingham
    // Newcastle
    // Stoke-on-Trent
    // Hull
    // Wolverhampton
    // Plymouth
    // Derby
    

    // Chance = 0.175
    //
    // Southampton
    // Sunderland
    // Dudley
    // Portsmouth
    // Walsall
    // Norwich
    // Northampton
    // Luton

    // Chance = 0.135
    //
    // Southend-on-Sea
    // Milton Keynes
    // Blackpool
    // Reading
    // Bolton
    // Middlesbrough
    // West Bromwich
    // Preston
    // Brighton
    // Stockport
    // Poole
    // Peterborough
    // Huddersfield
    // Ipswich
    // Telford




}