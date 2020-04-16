module.exports = function (router,_myData) {
    //
    //
    //GENERATE providers data
    //
    //
    var _newProviders = _myData["providers-new"],
        _ofstedRatings = [0,1,2,3,4],
        _booleans = [true,false]
        _inadequateRatings = 0,
        _nationalTrues = 0,
        _courseIDS = []

    _myData.standards.list.forEach(function(_standard, index) {
        var _courseIDObj = {
            "larsCode": _standard.larsCode,
            "used": 0
        }
        _courseIDS.push(_courseIDObj)
    });
    // console.log(_courseIDS)

    _newProviders.list.forEach(function(_provider, index) {

        // Add - "ofsted" - 0,1,2,3,4
        var _ofsted = _ofstedRatings[Math.floor(Math.random()*_ofstedRatings.length)];
        if(_ofsted == 4){
            _inadequateRatings++
            if(_inadequateRatings > 50){
                _ofsted = 2
            }
        }
        _provider.ofsted = _ofsted

        // Add - "national" - true/false
        var _national = _booleans[Math.floor(Math.random()*_booleans.length)];
        if(_national == true){
            _nationalTrues++
            if(_nationalTrues > 500){
                _national = false
            }
        }
        _provider.national = _national

        // Add - "distance"
        _provider.distance = Math.floor(Math.random() * 99) + 1 + Math.round(Math.random() * 10) / 10

        // Add - Courses offered (list) ------ old on standard = "providers":{"number":2}
        var _coursesToAdd = Math.floor(Math.random() * 40) + 1,
            _providersCourses = []
        for (var i = 0; i < _coursesToAdd; i++) {

            //find a random course
            var _randomCourse = _courseIDS[Math.floor(Math.random() * _courseIDS.length)];

            _providersCourses.push(_randomCourse.larsCode)
        }
        // console.log(_providersCourses)
        _provider.courses = _providersCourses


        // Add - Employer reviews data


        // ??????? Contact details - email,website,phone
        // ??????? About provider (free text)
        

    });

    //  FINAL OUTPUT - check console log
    //
    //
    //
    console.log(JSON.stringify(_newProviders)) 
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