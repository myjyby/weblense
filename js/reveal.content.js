//Set intital divs to be hidden
//$("tbody tr").addClass("noshow");
var contentNumber = 0;

function reveal() {
    var constraintNumber = contentNumber + 6;
    //IMPORTANT - DO NOT DELETE
    $(window).trigger('resize');
    //IMPORTANT - DO NOT DELETE
    for (i = contentNumber; i < constraintNumber; i++) {
        //Get the nth div of class content, where n is the contentNumber, and make it shown
        $('tbody>tr').eq(contentNumber).removeClass("noshow");
        contentNumber ++;
    }
}

//Window scroll function
$(window).scroll(function() {
   if ($(window).scrollTop() == $(document).height() - $(window).height() )
    {
        reveal();
    }
});
//reveal();