function shortlisting(_clear, _populateShortlist,_countShortlist){

    // Shortlist
    // add-shortlist
    var _shortlistLabelJS = $(".shortlist-label-js"),
        _addButtons = $(".shortlist-label-js .add-shortlist"),
        _removeButtons = $(".shortlist-label-js .remove-shortlist"),
        _shortlistTotalLabel = $(".shortlist-total"),
        _total = _countShortlist

    if(_countShortlist != 0 && !_countShortlist){
        _total = _countShortlist || (Number(localStorage.getItem('shortlistTotal')) || 0)
    }

    if (_clear) {
        // localStorage.setItem("shortlistTotal", 0)
        // _total = Number(localStorage.getItem('shortlistTotal'))
    }

    if(_populateShortlist){
        _total = _total + 1
        localStorage.setItem("shortlistTotal", JSON.stringify(_total));
    }

    //for shortlist page
    if (_total == 0){
        $(".favsList").hide()
        $(".favsEmpty").show()
    } else {
        $(".favsList").show()
        $(".favsEmpty").hide()
    }

    _shortlistTotalLabel.text(_total)

    $(".shortlist-label-non-js").hide()
    _shortlistLabelJS.show()

    // For provider page
    // $(".add-shortlist-button").on( "click", function() {
    //     _total = _total + 1
    //     localStorage.setItem("shortlistTotal", JSON.stringify(_total));
    // });
    // $(".remove-shortlist-button").on( "click", function() {
    //     _total = _total - 1
    //     localStorage.setItem("shortlistTotal", JSON.stringify(_total));
    // });

    function animateTotal(_shortlistTotalLabel,_total){
        
        _shortlistTotalLabel.animate({backgroundColor: '#ffdd00'}, 'fast', function() {
            _shortlistTotalLabel.animate({backgroundColor: '#1d70b8'}, 'fast');
            _shortlistTotalLabel.text(_total)
        });
        // _shortlistTotalLabel.animate({opacity: '0.5'}, 'fast', function() {
        //     _shortlistTotalLabel.animate({opacity: '1'}, 'fast');
        //     _shortlistTotalLabel.text(_total)
        // });
    }

    _addButtons.on( "click", function() {

        _total = _total + 1
        localStorage.setItem("shortlistTotal", JSON.stringify(_total));
        
        animateTotal(_shortlistTotalLabel,_total)

        event.preventDefault();
        var _this = $(this)
        _this.hide()
        _this.parent().find(".remove-elements").show()        
    });
    _removeButtons.on( "click", function() {

        _total = _total - 1
        localStorage.setItem("shortlistTotal", JSON.stringify(_total));

        animateTotal(_shortlistTotalLabel,_total)

        event.preventDefault();
        var _this = $(this)
        _this.parent().parent().find(".add-shortlist").show()        
        _this.parent().parent().find(".remove-elements").hide()
    });

}