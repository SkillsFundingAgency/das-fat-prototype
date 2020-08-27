function shortlistingSticky(_clear){

    $(window).bind('scroll', function() {
        if($(window).scrollTop() >= $('.view-shortlist').offset().top + $('.view-shortlist').outerHeight()) {
            $('.view-shortlist-fixed').removeClass("view-shortlist--hidden")
        } else {
            $('.view-shortlist-fixed').addClass("view-shortlist--hidden")
        }
    }).trigger("scroll");

    $(window).on('resize', function() {
        $('.view-shortlist-fixed').width($('.view-shortlist-fixed').parent().width() + 0)
    }).trigger("resize");

}