function asYouTypeFilter(totalCount,itemTypeLabel,itemTypeLabelPlural,clearLocalStorage,searchapplied,_searchTerm){

    //
    // data attr elements already in HTML
    //

        // - non-js-list
        // - list

        // - list-search-filter



    var _displayedCount = totalCount,
        _listContainer = jQuery("[data-list]"),
        _listItems = _listContainer.find("[data-list-item]"),
        _searchContainer = jQuery("[data-list-search-filter]"),
        _search = _searchContainer.find("input"),
        _searchWrapper = _searchContainer.closest(".inner-form")

    // Remove form elements (form, button)
    _searchWrapper.unwrap()
    _searchContainer.addClass("search-wrapper-no-icon")
    _searchContainer.find(".search-input-submit-wrapper").remove()



    //Set Localstorage defaults and searchTerm
    if(clearLocalStorage){
        localStorage.setItem("searchTerm", JSON.stringify(""));
    }
    if(searchapplied) {
        localStorage.setItem("searchTerm", JSON.stringify(_searchTerm));
    }
    var searchTerm = JSON.parse(localStorage.getItem('searchTerm')) || "";
    // console.log(searchTerm)




    //
    // Clear filter
    //
    var _clearFilter = jQuery("[data-clear-filter]")
    var _clearFilterLink = _clearFilter.find("a")
    _clearFilterLink.on(
        'click',
        function(event){
            event.preventDefault();
            localStorage.setItem("searchTerm", JSON.stringify(""));
            _search.val("").trigger("input")
        }
    )
    jQuery("[data-clear-filter-non-js]").remove()
    


    //
    // Hide or show list items
    //
    function filterListItems(value){
        _displayedCount = totalCount
        var _valueUpper = value.toUpperCase().trim()
        localStorage.setItem("searchTerm", JSON.stringify(value));
        _listItems.each(function(index) {
            var _this = jQuery(this),
                _searchesToDo = _this.data("search-data"),
                _standardMatched = false
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
                    if(_thisItem.exact & _itemToSearch.toUpperCase() == _valueUpper){
                        _standardMatched = true
                    }
                    // Within check
                    if(_thisItem.within & _itemToSearch.toUpperCase().indexOf(_valueUpper) != -1){
                        _standardMatched = true
                    }
                }
            }
            if(_standardMatched) {
                // match
                showOrHideElement(_this, "show")		
            } else {
                //no match
                showOrHideElement(_this, "hide")
                _displayedCount--
            }
        });
    }



    //
    // Update count label
    //
    function updateMessage(){
        var label = (_displayedCount == 1) ? itemTypeLabel : itemTypeLabelPlural
        jQuery("[data-results-count]").text(_displayedCount + " " + label)
    }



    //
    // Search box checks on load
    //
    showOrHideElement(_listItems, "show")
    _search.val(searchTerm)
    var _valueUpper = searchTerm.toUpperCase().trim()
    if(_valueUpper.length != 0){
        filterListItems(searchTerm)
        showOrHideElement(_clearFilter, "show")
    } else {
        showOrHideElement(_clearFilter, "hide")
    }
    updateMessage()

    
    

    //
    //Search box checks on type
    //
    _search.on(
        "input",
        function(event){
            showOrHideElement(_listItems, "show")
            var _value = _search.val()
            var _valueUpper = _value.toUpperCase().trim()
            if(_valueUpper.length != 0){
                filterListItems(_valueUpper)
                showOrHideElement(_clearFilter, "show")
            } else {
                localStorage.setItem("searchTerm", JSON.stringify(""));
                _displayedCount = totalCount
                showOrHideElement(_clearFilter, "hide")
            }
            updateMessage()
        }
    )




    // Show/Hide
    function showOrHideElement(_this, showOrHide){
        if(showOrHide == "show"){
            // if show
            _this.removeClass("hidden")
            _this.attr("aria-hidden", false)
            _this.removeAttr("hidden")
        } else {
            // if hide				
            _this.addClass("hidden")
            _this.attr("aria-hidden", true)
            _this.attr("hidden", true)
        }
    }

}