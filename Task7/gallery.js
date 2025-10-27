$(document).ready(function(){
    const $slider = $('.gallery-slider');
    const $currentPage = $('#currentPage');
    const $totalPages = $('#totalPages');
    const totalSlides = 8;
    const slidesToShow = window.innerWidth < 768 ? 1 : 3;
    const totalPages = Math.ceil(totalSlides / slidesToShow);
    
    $totalPages.text(totalPages);
    
    $slider.slick({
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToShow,
        infinite: false,
        arrows: true,
        dots: false,
        speed: 300,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
    
    function updatePager() {
        const currentSlide = $slider.slick('slickCurrentSlide');
        const currentPage = Math.floor(currentSlide / slidesToShow) + 1;
        $currentPage.text(currentPage);
    }
    
    $slider.on('afterChange', function(event, slick, currentSlide){
        updatePager();
    });
    
    $(window).on('resize', function(){
        const newSlidesToShow = window.innerWidth < 768 ? 1 : 3;
        const newTotalPages = Math.ceil(totalSlides / newSlidesToShow);
        $totalPages.text(newTotalPages);
        updatePager();
    });
    
    updatePager();
});