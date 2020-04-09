function filterVisibilityToggle(_filtersApplied){

    var _viewIs = (jQuery(window).width() < 641) ? "mobile" : "desktop",
        _viewWas = _viewIs,
        _firstLoad = true,
        _filterContainer = jQuery(".fat-filter"),
        _filterHeader = jQuery(".fat-filter__header"),
        _filterToggleContainer = jQuery("<div class='fat-filter__togle-container closed'></div>"),
        _filterOptions = _filterContainer.find(".fat-filter__options"),
        _buttonTextClosed = _filtersApplied ? "Show filter options" : "Show filter",
        _buttonTextOpen = _filtersApplied ? "Hide filter options" : "Hide filter",
        _toggleButton = jQuery("<button class='govuk-button govuk-button--secondary fat-filter__toggle' type='button' >" + _buttonTextClosed + "</button>"),
        _optionsVisible = true;

    if (!_filtersApplied) {
        _filterToggleContainer.addClass("filters-not-applied")
    }

    _filterToggleContainer.insertAfter(_filterContainer)
    _filterToggleContainer.append(_toggleButton)

    // On window resize
    jQuery(window).on( "resize", function() {
        _viewIs = (jQuery(window).width() < 641) ? "mobile" : "desktop"
        if((_viewWas != _viewIs) || _firstLoad){
            hideShowPanel()
            if(_viewIs == "mobile") {
                _toggleButton.show() 
            } else {
                _toggleButton.hide()
            }
        }
        _viewWas = _viewIs
        _firstLoad = false
    }).trigger("resize");

    // On toggle click
    _toggleButton.on( "click", function() {
        hideShowPanel()
    });

    function hideShowPanel(){
        if(!_optionsVisible || _viewIs == "desktop"){
            _toggleButton.text(_buttonTextOpen)
            _filterToggleContainer.removeClass("closed")
            _optionsVisible = true
            _filterOptions.show()
            if(!_filtersApplied){
                _filterHeader.show()
            } 
        } else {
            _toggleButton.text(_buttonTextClosed)
            _filterToggleContainer.addClass("closed")
            _optionsVisible = false 
            _filterOptions.hide()
            if(!_filtersApplied){
                _filterHeader.hide()
            }
        }
    }

}
