function filterVisibilityToggle(_filtersApplied){

    var _filterContainer = jQuery(".fat-filter"),
        _filterHeader = jQuery(".fat-filter__header"),
        _filterToggleContainer = jQuery("<div class='fat-filter__togle-container closed'></div>"),
        _filterOptions = _filterContainer.find(".fat-filter__options"),
        _buttonTextClosed = _filtersApplied ? "Show filter options" : "Show filter",
        _buttonTextOpen = _filtersApplied ? "Close filter options" : "Close filter",
        _toggleButton = jQuery("<button class='govuk-button govuk-button--secondary fat-filter__toggle' type='button' >" + _buttonTextClosed + "</button>"),
        _optionsVisible = true;
        
    if (!_filtersApplied) {
        _filterToggleContainer.addClass("filters-not-applied")
    }

    _filterToggleContainer.insertAfter(_filterContainer)
    _filterToggleContainer.append(_toggleButton)

    // On window resize
    jQuery(window).on( "resize", function() {
        toggleMobileView()
    }).trigger("resize");

    // On toggle click
    _toggleButton.on( "click", function() {
        hideShowPanel()
    });

    function hideShowPanel(){
        if(_optionsVisible){
            _optionsVisible = false
            _filterOptions.hide()
            _toggleButton.text(_buttonTextClosed)
            _filterToggleContainer.addClass("closed")
            if(!_filtersApplied){
                _filterHeader.hide()
            }
        } else {
            _optionsVisible = true
            _filterOptions.show()
            _toggleButton.text(_buttonTextOpen)
            _filterToggleContainer.removeClass("closed")
            if(!_filtersApplied){
                _filterHeader.show()
            }
        }
    }

    function toggleMobileView(){
        if(jQuery(window).width() < 641){
            _toggleButton.show()
            _filterOptions.hide()
            if(!_filtersApplied){
                _filterHeader.hide()
            }
            _optionsVisible = false
        } else {
            _toggleButton.hide()
            _filterOptions.show()
            if(!_filtersApplied){
                _filterHeader.show()
            }
            _optionsVisible = true
        }
    }

}



