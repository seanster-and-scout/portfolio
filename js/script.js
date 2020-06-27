
$(document).ready(function () {
    $('.carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3
    });

    $(document).on('scroll', (e) => {
        if (window.scrollY > 50) {
            $('.navbar').addClass('navbar-scrolling')
        } else {
            $('.navbar').removeClass('navbar-scrolling')
        }
    })
});