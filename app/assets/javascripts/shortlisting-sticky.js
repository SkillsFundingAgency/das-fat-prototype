function shortlistingSticky(_offset){
    
    var offset = _offset || 0

    $(window).bind('scroll', function() {
        if($(window).scrollTop() >= $('.view-shortlist').offset().top + $('.view-shortlist').outerHeight()) {
            $('.view-shortlist-fixed').removeClass("view-shortlist--hidden")
        } else {
            $('.view-shortlist-fixed').addClass("view-shortlist--hidden")
        }
    }).trigger("scroll");

    $(window).on('resize', function() {
        $('.view-shortlist-fixed').width($('.view-shortlist-fixed').parent().width() - offset)
    }).trigger("resize");

}