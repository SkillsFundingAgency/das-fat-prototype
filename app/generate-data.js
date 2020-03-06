module.exports = function (router,_myData) {
    //
    //
    //GENERATE standards data
    //
    //
    var Request = require("request"),
        _newStandards = {"list": []},
        _count = 0,
        cooooount = 0
    var _activeStds = ["1","2","5","6","7","8","9","10","11","12","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","45","46","47","48","49","50","51","53","54","55","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","96","98","99","100","101","102","103","104","105","106","107","108","109","110","111","112","114","116","117","118","119","120","122","123","124","125","126","127","128","129","130","131","132","133","134","135","136","137","138","139","140","141","142","143","144","145","146","147","148","149","150","151","152","153","154","155","156","157","158","159","160","161","162","163","164","165","166","167","168","169","170","171","172","173","174","175","176","177","178","179","180","181","182","183","184","185","186","187","188","189","190","191","192","193","194","195","196","197","198","199","200","201","202","203","204","205","206","207","209","210","211","212","213","214","215","216","217","218","219","220","221","222","223","224","225","226","227","228","229","230","231","232","233","234","235","236","237","238","239","240","241","242","243","244","245","246","247","248","249","250","251","252","253","254","255","256","257","258","259","260","261","262","263","264","265","266","267","268","269","270","271","272","273","274","275","276","277","278","279","280","281","282","283","284","285","286","287","289","290","291","292","293","294","295","296","297","298","299","300","301","302","303","304","305","306","307","308","309","310","311","312","313","314","315","316","317","318","319","320","321","322","323","324","325","326","327","328","329","330","331","332","333","334","335","336","337","338","339","340","341","342","343","344","345","346","347","348","349","350","351","352","353","354","355","356","357","358","359","360","361","362","363","364","365","366","367","368","369","370","371","372","373","374","375","376","377","378","379","380","381","382","383","384","385","386","387","388","389","390","391","392","393","394","395","396","397","398","399","400","401","402","403","404","405","406","407","408","409","410","411","412","413","414","415","416","417","418","419","420","421","422","423","424","425","426","427","428","429","430","431","432","433","434","435","436","437","438","439","440","441","442","443","444","445","446","447","448","449","450","451","452","453","454","455","456","457","458","459","460","461","462","463","464","465","466","467","468","469","470","471","472","473","474","475","476","477","478","479","480","481","482","483","484","485","486","487","488","489","490","491","492","493","494","495","496","497","498","499","500","501","502","503","504","505","506","507","508","509","510","511","512","513","514","515","516","517","518","519","521","522","524","525"];
    for(var i = 0; i < _activeStds.length; i++){
        var current = _activeStds[i];
        GetMyResourceData(current);
    }
    function GetMyResourceData(current){
        Request.get("https://www.instituteforapprenticeships.org/api/apprenticeshipstandards/" + current, (error, response, body) => {
            //use following console logs to check for broken api calls
            // console.log("current = " + current)
            // console.log(JSON.parse(body).title)
            var _apiData = JSON.parse(body),
                _stdObj = {
                    "larsCode": _apiData.larsCode,
                    "title": _apiData.title,
                    "level": _apiData.level,
                    "maxFunding": _apiData.maxFunding,
                    "typicalDuration": _apiData.typicalDuration,
                    "ssa1": _apiData.ssa1,
                    "ssa2": _apiData.ssa2,
                    "route": _apiData.route,
                    "pathway": _apiData.pathway,
                    "cluster": _apiData.cluster,
                    "keywords": _apiData.keywords,
                    "jobRoles": _apiData.jobRoles,
                    "integratedDegree": _apiData.integratedDegree,
                    "overviewOfRole": _apiData.overviewOfRole,
                    "typicalJobTitles": _apiData.typicalJobTitles,
                    "skills": _apiData.skills,
                    "duties": _apiData.duties,
                    "qualifications": _apiData.qualifications,
                    "professionalRecognition": _apiData.professionalRecognition,
                    "standardPageUrl": _apiData.standardPageUrl,
                    "coreSkillsCount": 0
                }

            //STRIP OUT P TAG and APOSTROPHE HTML FROM OVERVIEW
            _stdObj.overviewOfRole = _stdObj.overviewOfRole.replace("&lt;p&gt;", "");
            _stdObj.overviewOfRole = _stdObj.overviewOfRole.replace("&lt;/p&gt;", "");
            _stdObj.overviewOfRole = _stdObj.overviewOfRole.replace("&#39;", "’");

            
            //MAP CORE SKILLS
            if(_stdObj.duties.length > 0) { 
            // if(_apiData.thing != "" ) {
                // cooooount++
                // console.log(_apiData.title + " - regulated = " + JSON.stringify(_apiData.regulated))
                // console.log(JSON.stringify(_apiData.regulatedBody))
                // console.log(JSON.stringify(_apiData.regulationDetail))
                // console.log("------")
                var _coreSkillIDs = []
                _stdObj.duties.forEach(function(_duty, index) {
                    if(_duty.isThisACoreDuty == 1){
                        _coreSkillIDs = _coreSkillIDs.concat(_duty.mappedSkills)
                    }
                });
                _stdObj.skills.forEach(function(_skill, index) {
                    if(_coreSkillIDs.includes(_skill.skillId)){
                        _stdObj.coreSkillsCount++
                    }
                    _skill.isThisACoreSkill = _coreSkillIDs.includes(_skill.skillId)
                });
            }
    
            _newStandards.list.push(_stdObj)
            _count++
            if(_count == _activeStds.length){
                //use following to spit out entire gathered data
                // console.log(JSON.stringify(_newStandards))
                // console.log(cooooount)
                // APPLY provider data to generated standards
                var _activeStdsObjs = _activeStds.map((str, index) => ({ value: str, id: parseInt(str) }));
                // console.log(_activeStdsObjs)
                _activeStdsObjs.forEach(function(_activeStdsObj, index) {
                    _activeStdsObj.providers = {
                        "number": 10
                    }
                    var _numProviders = 10
                    if(_activeStdsObj.id > 0 && _activeStdsObj.id <= 100 ) {
                        _numProviders = 9
                    } else if(_activeStdsObj.id > 100 && _activeStdsObj.id <= 200 ) {
                        _numProviders = 7
                    } else if(_activeStdsObj.id > 200 && _activeStdsObj.id <= 300 ) {
                        _numProviders = 5
                    } else if(_activeStdsObj.id > 300 && _activeStdsObj.id <= 400 ) {
                        _numProviders = 3
                    } else if(_activeStdsObj.id > 400 && _activeStdsObj.id <= 500 ) {
                        _numProviders = 2
                    } else if(_activeStdsObj.id > 500) {
                        _numProviders = 1
                    }
                    _activeStdsObj.providers.number = _numProviders

                });
                _newStandards.list.forEach(function(_standard, index) {
                    _activeStdsObjs.forEach(function(_standardID, index) {
                        if(_standard.larsCode == _standardID.id){
                            _standard.providers = _standardID.providers
                        }
                    });
                    // Number overrides
                    if(_standard.title.toUpperCase().indexOf("RETAIL".trim().toUpperCase()) != -1){
                        _standard.providers.number = 0
                    }
                });
                console.log(JSON.stringify(_newStandards)) 
            } 
        });
    }

    // ALSO pull back
    // - closing date?

}