(function($) {
    "use strict";
    $.fn.wrapStart = function(numWords) {
        return this.each(function() {
            var $this = $(this);
            var node = $this.contents().filter(function() {
                    return this.nodeType == 3;
                }).first(),
                text = node.text().trim(),
                first = text.split(' ', 1).join(" ");
            if (!node.length) return;
            node[0].nodeValue = text.slice(first.length);
            node.before('<b>' + first + '</b>');
        });
    };

    jQuery(document).ready(function() {
        $('.mod-heading .widget-title > span').wrapStart(1);

        function init_owl() {
            $(".owl-carousel[data-carousel=owl]").each(function() {
                var config = {
                    loop: false,
                    nav: $(this).data('nav'),
                    dots: $(this).data('pagination'),
                    items: 4,
                    navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>']
                };

                var owl = $(this);
                if ($(this).data('items')) {
                    config.items = $(this).data('items');
                }

                if ($(this).data('large')) {
                    var desktop = $(this).data('large');
                } else {
                    var desktop = config.items;
                }
                if ($(this).data('medium')) {
                    var medium = $(this).data('medium');
                } else {
                    var medium = config.items;
                }
                if ($(this).data('smallmedium')) {
                    var smallmedium = $(this).data('smallmedium');
                } else {
                    var smallmedium = config.items;
                }
                if ($(this).data('extrasmall')) {
                    var extrasmall = $(this).data('extrasmall');
                } else {
                    var extrasmall = 2;
                }
                if ($(this).data('verysmall')) {
                    var verysmall = $(this).data('verysmall');
                } else {
                    var verysmall = 1;
                }
                config.responsive = {
                    0: {
                        items: verysmall
                    },
                    320: {
                        items: extrasmall
                    },
                    768: {
                        items: smallmedium
                    },
                    980: {
                        items: medium
                    },
                    1280: {
                        items: desktop
                    }
                }
                if ($('html').attr('dir') == 'rtl') {
                    config.rtl = true;
                }
                $(this).owlCarousel(config);
                // owl enable next, preview
                var viewport = jQuery(window).width();
                var itemCount = jQuery(".owl-item", $(this)).length;

                if (
                    (viewport >= 1280 && itemCount <= desktop) //desktop
                    ||
                    ((viewport >= 980 && viewport < 1280) && itemCount <= medium) //desktop
                    ||
                    ((viewport >= 768 && viewport < 980) && itemCount <= smallmedium) //tablet
                    ||
                    ((viewport >= 320 && viewport < 768) && itemCount <= extrasmall) //mobile
                    ||
                    (viewport < 320 && itemCount <= verysmall) //mobile
                ) {
                    $(this).find('.owl-prev, .owl-next').hide();
                }
            });
        }
        init_owl();
        // Fix owl in bootstrap tabs
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            var target = $(e.target).attr("href");
            var carousel = $(".owl-carousel[data-carousel=owl]", target).data('owlCarousel');

            if ($(".owl-carousel[data-carousel=owl]", target).length > 0) {
                carousel._width = $(".owl-carousel[data-carousel=owl]", target).width();
                carousel.invalidate('width');
                carousel.refresh();
            }
            initProductImageLoad();
        });

        // loading ajax
        $('[data-load="ajax"] a').click(function() {
            var $href = $(this).attr('href');
            var self = $(this);
            var main = $($href);
            if (main.length > 0 && main.data('loaded') == false) {
                var height = main.parent().find('.tab-pane').first().height();

                main.data('loaded', 'true');
                var loading = $('<div class="ajax-loading"></div>');
                loading.css('height', height);
                main.html(loading);
                $.ajax({
                    url: studylms_ajax.ajaxurl,
                    type: 'POST',
                    dataType: 'html',
                    data: 'action=studylms_get_products&columns=' + main.data('columns') + '&product_type=' + main.data('product_type') + '&number=' + main.data('number') +
                        '&categories=' + main.data('categories') + '&layout_type=' + main.data('layout_type')
                }).done(function(reponse) {
                    main.html(reponse);
                    if (main.find('.owl-carousel')) {
                        init_owl();
                    }
                    initProductImageLoad();
                });
                return true;
            }
        });

        setTimeout(function() {
            initProductImageLoad();
        }, 500);

        function initProductImageLoad() {
            $(window).off('scroll.unveil resize.unveil lookup.unveil');
            var $images = $('.image-wrapper:not(.image-loaded) .unveil-image'); // Get un-loaded images only
            if ($images.length) {
                var scrollTolerance = 1;
                $images.unveil(scrollTolerance, function() {
                    $(this).parents('.image-wrapper').first().addClass('image-loaded');
                });
            }

            var $images = $('.product-image:not(.image-loaded) .unveil-image'); // Get un-loaded images only
            if ($images.length) {
                var scrollTolerance = 1;
                $images.unveil(scrollTolerance, function() {
                    $(this).parents('.product-image').first().addClass('image-loaded');
                });
            }
        }

        // testimonial
        $("[data-testimonial=content]").each(function() {
            var self = $(this);
            var owl = $(this).find('.owl-carousel');
            setTimeout(function() {
                owl.find('.testimonials-body').removeClass('active');
                owl.find('.owl-item.active').eq(2).find('.testimonials-body').addClass('active');
                self.find('.testimonial-content').html('').fadeOut(300);
                self.find('.testimonial-content').html(owl.find('.owl-item.active').eq(2).find('.description').html()).fadeIn(300);
            }, 100);
            owl.on('changed.owl.carousel', function(property) {
                setTimeout(function() {
                    owl.find('.testimonials-body').removeClass('active');
                    owl.find('.owl-item.active').eq(2).find('.testimonials-body').addClass('active');
                    self.find('.testimonial-content').html('').fadeOut(300);
                    self.find('.testimonial-content').html(owl.find('.owl-item.active').eq(2).find('.description').html()).fadeIn(300);
                }, 100);
            });

            $(this).find('.testimonials-body').click(function() {
                self.find('.testimonials-body').removeClass('active');
                $(this).addClass('active');
                self.find('.testimonial-content').html('').fadeOut(300);
                self.find('.testimonial-content').html($(this).find('.description').html()).fadeIn(300);
            });
        });

        //Offcanvas Menu
        $('[data-toggle="offcanvas"], .btn-offcanvas').on('click', function() {
            $('.row-offcanvas').toggleClass('active')
        });
        $("#main-menu-offcanvas .caret").on('click', function() {
            $("#main-menu-offcanvas .dropdown").removeClass('open');
            $(this).parent().addClass('open');
            return false;
        });

        //counter up
        if ($('.counterUp').length > 0) {
            $('.counterUp').counterUp({
                delay: 10,
                time: 800
            });
        }

        /*---------------------------------------------- 
         * Play Isotope masonry
         *----------------------------------------------*/
        jQuery('.isotope-items,.blog-masonry').each(function() {
            var $container = jQuery(this);

            $container.isotope({
                itemSelector: '.isotope-item',
                transformsEnabled: true // Important for videos
            });
        });
        /*---------------------------------------------- 
         *    Apply Filter        
         *----------------------------------------------*/
        jQuery('.isotope-filter li a').on('click', function() {

            var parentul = jQuery(this).parents('ul.isotope-filter').data('related-grid');
            jQuery(this).parents('ul.isotope-filter').find('li a').removeClass('active');
            jQuery(this).addClass('active');
            var selector = jQuery(this).attr('data-filter');
            jQuery('#' + parentul).isotope({
                filter: selector
            }, function() {});

            return (false);
        });

        //Sticky Header
        setTimeout(function() {
            change_margin_top();
        }, 100);
        $(window).resize(function() {
            change_margin_top();
        });

        function change_margin_top() {
            if ($(window).width() > 991) {
                if ($('.main-sticky-header').length > 0) {
                    var header_height = $('.main-sticky-header').outerHeight() + 1;
                    $('.main-sticky-header-wrapper').css({
                        'height': header_height
                    });
                }
            }
        }
        var main_sticky = $('.main-sticky-header');

        if (main_sticky.length > 0) {
            var _menu_action = main_sticky.offset().top;
            var Apus_Menu_Fixed = function() {
                "use strict";
                if ($(document).scrollTop() > _menu_action) {
                    main_sticky.addClass('sticky-header');
                } else {
                    main_sticky.removeClass('sticky-header');
                }
            }
            if ($(window).width() > 991) {
                $(window).scroll(function(event) {
                    Apus_Menu_Fixed();
                });
                Apus_Menu_Fixed();
            }
        }

        var back_to_top = function() {
            jQuery(window).scroll(function() {
                if (jQuery(this).scrollTop() > 400) {
                    jQuery('#back-to-top').addClass('active');
                } else {
                    jQuery('#back-to-top').removeClass('active');
                }
            });
            jQuery('#back-to-top').on('click', function() {
                jQuery('html, body').animate({
                    scrollTop: '0px'
                }, 800);
                return false;
            });
        };
        back_to_top();

        // popup
        $(document).ready(function() {
            $(".popup-image").magnificPopup({
                type: 'image'
            });
            $('.popup-video').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });
            $('.popup-gallery').magnificPopup({
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
        });

        // mobile menu
        $('[data-toggle="offcanvas"], .btn-offcanvas').on('click', function(e) {
            e.stopPropagation();
            $('#wrapper-container').toggleClass('active');
            $('#apus-mobile-menu').toggleClass('active');
        });

        $('body').click(function() {
            if ($('#wrapper-container').hasClass('active')) {
                $('#wrapper-container').toggleClass('active');
                $('#apus-mobile-menu').toggleClass('active');
            }
        });
        $('#apus-mobile-menu').click(function(e) {
            e.stopPropagation();
        });

        $("#main-mobile-menu .icon-toggle").on('click', function() {
            $(this).parent().find('.sub-menu').first().slideToggle();
            if ($(this).find('i').hasClass('fa-angle-right')) {
                $(this).find('i').removeClass('fa-angle-right').addClass('fa-angle-up');
            } else {
                $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-right');
            }
            return false;
        });

        // preload page
        var $body = $('body');
        if ($body.hasClass('apus-body-loading')) {

            setTimeout(function() {
                $body.removeClass('apus-body-loading');
                $('.apus-page-loading').fadeOut(250);
            }, 300);
        }

        // full width video
        // Find all YouTube videos
        iframe_full_width();

        function iframe_full_width() {
            var $fluidEl = $(".pro-fluid-inner");
            var $videoEls = $(".pro-fluid-inner iframe");
            $videoEls.each(function() {
                $(this).data('aspectRatio', this.height / this.width)
                    .removeAttr('height')
                    .removeAttr('width');
            });

            $(window).resize(function() {
                $fluidEl.each(function() {
                    var newWidth = $(this).width();
                    var $videoEl = $(this).find("iframe");
                    $videoEl.each(function() {
                        var $el = $(this);
                        $el.width(newWidth).height(newWidth * $el.data('aspectRatio'));
                    });
                });
            }).resize();
        }

        $('.apus-mfp-close').click(function() {
            magnificPopup.close();
        });

        // search form
        $('.close-search-form').click(function() {
            $('.full-top-search-form').removeClass('show');
            $('#searchverlay').removeClass('show');
        });
        // full top search
        $('.button-show-search').click(function() {
            $('.full-top-search-form').toggleClass('show');
            $('#searchverlay').toggleClass('show');
        });

        // review
        if ($('.comment-form-rating').length > 0) {
            var $star = $('.comment-form-rating .filled');
            var $review = $('#apus_input_rating');
            $star.find('li').on('mouseover',
                function() {
                    $(this).nextAll().find('span').removeClass('fa-star').addClass('fa-star-o');
                    $(this).prevAll().find('span').removeClass('fa-star-o').addClass('fa-star');
                    $(this).find('span').removeClass('fa-star-o').addClass('fa-star');
                    $review.val($(this).index() + 1);
                }
            );
        }

        $('body').on('mouseenter', '.accept-account', function() {
            $('.accept-account a[data-toggle=dropdown]').click();
        }).on('mouseleave', '.accept-account', function() {
            $('.accept-account a[data-toggle=dropdown]').click();
        });

        // course lesson sidebar
        $('.course-lesson-sidebar-btn').click(function(e) {
            e.preventDefault();
            $('.course-lesson-sidebar-wrapper').toggleClass('active');
        });

        // Bookmark Course
        $("body").on("click", ".apus-bookmark-add", function(e) {
            e.preventDefault();
            if ($(this).hasClass('loading')) {
                return false;
            }
            var self = $(this);
            self.addClass('loading');
            var post_id = self.data('id');
            var url = studylms_ajax.ajaxurl + '?action=studylms_add_bookmark&post_id=' + post_id;

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
            }).done(function(reponse) {
                self.removeClass('apus-bookmark-add').removeClass('loading').addClass('apus-bookmark-added');
                self.text(studylms_ajax.bookmark_view_text);
            });
        });

        $("body").on("click", ".apus-bookmark-not-login", function(e) {
            e.preventDefault();
            $('.bookmark-not-login').show();
        });
        // bookmark remove
        $("body").on("click", ".apus-bookmark-remove", function(e) {
            e.preventDefault();
            var self = $(this);
            self.addClass('loading');

            var post_id = $(this).data('id');
            var url = studylms_ajax.ajaxurl + '?action=studylms_remove_bookmark&post_id=' + post_id;
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
            }).done(function(reponse) {
                if (reponse.status) {
                    var parent = $('#bookmark-course-' + post_id).parent().parent();
                    if ($('.bookmark-item', parent).length <= 1) {
                        location.reload();
                    } else {
                        $('#bookmark-course-' + post_id).parent().remove();
                    }
                } else {
                    $.magnificPopup.open({
                        mainClass: 'apus-mfp-zoom-small-in',
                        items: {
                            src: reponse.msg,
                            type: 'inline'
                        }
                    });
                }
            });
        });
        // send message to instructor
        $('form#send-message-instructor').on('submit', function(e) {
            e.preventDefault();
            var self = $(this);
            $('.btn-send-message', self).addClass('loading').attr('disabled', 'disabled');

            $.ajax({
                type: 'POST',
                url: studylms_ajax.ajaxurl,
                dataType: 'json',
                data: {
                    'action': 'studylms_send_message',
                    'sender-name': $('form#send-message-instructor #sender-name').val(),
                    'sender-email': $('form#send-message-instructor #sender-email').val(),
                    'sender-subject': $('form#send-message-instructor #sender-subject').val(),
                    'sender-message': $('form#send-message-instructor #sender-message').val(),
                    'instructor-email': $('form#send-message-instructor #instructor-email').val(),
                    'instructor-security': $('form#send-message-instructor #instructor-security').val()
                },
                success: function(data) {
                    $('.btn-send-message', self).removeClass('loading').removeAttr('disabled');
                    $('form#send-message-instructor .message-res').html('<div class="' + data.class + '">' + data.message + '</div>');
                }
            });

        });

        // gmap 3
        $('.apus-google-map').each(function() {
            var lat = $(this).data('lat');
            var lng = $(this).data('lng');
            var zoom = $(this).data('zoom');
            var id = $(this).attr('id');
            if ($(this).data('marker_icon')) {
                var marker_icon = $(this).data('marker_icon');
            } else {
                var marker_icon = '';
            }
            $('#' + id).gmap3({
                map: {
                    options: {
                        "draggable": true,
                        "mapTypeControl": true,
                        "mapTypeId": google.maps.MapTypeId.ROADMAP,
                        "scrollwheel": false,
                        "panControl": true,
                        "rotateControl": false,
                        "scaleControl": true,
                        "streetViewControl": true,
                        "zoomControl": true,
                        "center": [lat, lng],
                        "zoom": zoom,
                        'styles': $(this).data('style')
                    }
                },
                marker: {
                    latLng: [lat, lng],
                    options: {
                        icon: marker_icon,
                    }
                }
            });
        });


        $('.main-menu li.dropdown a').click(function() {
            window.location = $(this).attr('href');
        });

        $('#course-program .edr-lessons .lesson').each(function() {
            var self = $(this);
            if ($('.lesson-excerpt', self).length > 0) {
                $('.lessin-wrapper .lesson-icon .expand-lesson', self).click(function() {
                    self.toggleClass('active');
                    if ($(this).find('i').hasClass('mn-icon-193')) {
                        $(this).find('i').removeClass('mn-icon-193').addClass('mn-icon-195');
                    } else {
                        $(this).find('i').removeClass('mn-icon-195').addClass('mn-icon-193');
                    }
                    $('.lesson-excerpt', self).slideToggle();
                });
            }
        });

        // sticky
        if ($(window).width() > 991) {
            if ($('.sticky-this').length > 0) {
                $('.sticky-this').stick_in_parent({
                    parent: ".sticky-v-wrapper",
                    spacer: false
                });
            }
        }
    });
})(jQuery)

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}