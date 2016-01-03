(function($){
    $.fn.glissant = function(parameters) {

        // Valeurs par defaut
        var defaults = {

            // Parametres de l'auto-slide
            auto: true,
            timeBetweenSlide: 3000,

            // Parametres des images
            sliderWidth: 640,
            sliderHeight: 480,
            imgClass: "slider_img",

            // Parametres des captions
            captions: true,
            captionsClass: "slider_caption",
            captionsDefault: "Lorem ipsum dolor sit amet...",
            captionsText: [],

            // Parametres des animations
            animationStyle: "slide",
            animationDelay: 500,

            // Parametres des controles
            manualControls: true,
            controlsClass: "slider_controls",
            previousClass : "slider_previous",
            nextClass: "slider_next",
            pauseClass : "slider_pause",

            // Parmetres des thumbnails
            manualThumbnails: true,
            thumbnails: true,
            thumbnailsContainerClass: "slider_thumbnails_holder",
            thumbnailsClass: "slider_thumbnails",
            thumbnailsWidth: 150,
            thumbnailsHeight: 112,

            // Parametres des bullets
            manualBullets: true,
            bullets: true,
            bulletsContainerClass: "slider_bullets_holder",
            bulletsClass: "slider_bullets"

        };

        // Merge avec les parameters de l'utilisateur
        var settings = $.extend({}, defaults, parameters);

        // Variables utlisées de maniere globales dans le plugin
        var $sliderContainer = this;
        var $sliderWindow;
        var $sliderContent;
        var $sliderImg;
        var $sliderControls;
        var $sliderBullets;
        var $sliderThumbnails;

        var allowMove = true;
        var sliderWidth;
        var autoSlide;
        var currentImg;
        var nextImg;
        var totalImg;
        var i = 0;

        // FONCTIONS

        function createMarkup() {

            $sliderWindow = $('<div class="slider_window"></div').css({
                position: "relative",
                overflow: "hidden",
                margin: "0 auto",
                width: settings.sliderWidth,
                height: settings.sliderHeight
            });
            $sliderContent = $('<ul class="slider_content"></ul>').css({position: "absolute"});
            // $sliderContent = $('<div class="slider_content"></div>').css({position: "absolute"});

            $sliderWindow.appendTo($sliderContainer);
            $sliderContent.appendTo($sliderWindow);

            // Compteur pour les captions
            $.each(settings.imgs, function() {

                var $li = $('<li></li>');
                var $img = $('<img src="' + this + '" alt="Slide" />').addClass(settings.imgClass);

                if (settings.captions) {

                    var $caption = $('<p></p>').addClass(settings.captionsClass);
                    if (typeof settings.captionsText[i] === "undefined") {

                        $caption.html(settings.captionsDefault);

                    } else {

                        $caption.html(settings.captionsText[i]);

                    };

                    $caption.appendTo($li);

                    // On incrémente le compteur pour les captions
                    i++;

                };

                $img.appendTo($li);
                $li.appendTo($sliderContent);

            })

            $sliderImg = $sliderContent.children("li").children("img");
            // $sliderImg = $sliderContent.children("img");
            $sliderImg.each(function() {

                $(this).width(settings.sliderWidth);
                $(this).height(settings.sliderHeight);

            });

            // Si on ative les controles manuels, on creer les bouttons et les events
            if (settings.manualControls) {

                createControls();

            };

            // Pareil pour les thumbnails
            if (settings.thumbnails) {

                createThumbnails();

            };

            // Pareil pour les bullets
            if (settings.bullets) {

                createBullets();

            };

        }

        function createThumbnails() {

            var $thumbnailsContainer = $('<ul></ul>').addClass(settings.thumbnailsContainerClass);
            $thumbnailsContainer.appendTo($sliderContainer);

            $.each(settings.imgs, function() {

                var $thumbnailLi = $('<li></li>');
                var $thumbnailImg = $('<img src ="' + this + '" alt="Thumbnail" />').addClass(settings.thumbnailsClass);
                $thumbnailImg.appendTo($thumbnailLi);
                $thumbnailLi.appendTo($thumbnailsContainer);

            })
            $sliderThumbnails = $thumbnailsContainer.children("li").children("img");

            if (settings.manualThumbnails) {

                // Controle par les thumbnails
                $sliderThumbnails.on("click", function() {

                    // Je recup la position de la bullets dans la liste (position de la LI parante au sein de la UL)
                    if (settings.animationStyle === "fade") {

                        var index = $(this).parent().index() + 1;

                    } else {

                        var index = $(this).parent().index() + 2;

                    };

                    // console.log("On click sur le thumbnail " + index);

                    // Si la cible est différente de la source
                    if (allowMove && currentImg != index) {

                        move("slider_next", index);

                    };

                });

            };

        }

        function createBullets() {

            var $bulletsContainer = $('<ul></ul>').addClass(settings.bulletsContainerClass);
            $bulletsContainer.appendTo($sliderContainer);

            $.each(settings.imgs, function() {

                var $bulletLi = $('<li></li>');
                var $bulletDiv = $('<div></div>').addClass(settings.bulletsClass);
                $bulletDiv.appendTo($bulletLi);
                $bulletLi.appendTo($bulletsContainer);

            })
            $sliderBullets = $bulletsContainer.children("li").children("div");

            if (settings.manualBullets) {

                // Controle par les bullets
                $sliderBullets.on("click", function() {

                    // Je recup la position de la bullets dans la liste (position de la LI parante au sein de la UL)
                    if (settings.animationStyle === "fade") {

                        var index = $(this).parent().index() + 1;

                    } else {

                        var index = $(this).parent().index() + 2;

                    };

                    // console.log("On click sur le thumbnail " + index);

                    // Si la cible est différente de la source
                    if (allowMove && currentImg != index) {

                        move("slider_next", index);

                    };

                });

            };

        }

        function createControls() {

            var $controlsContainer = $('<div></div>').addClass(settings.controlsClass);
            $controlsContainer.appendTo($sliderContainer);

            if (settings.auto) {
                var $controlsPause = $('<div></div>').addClass(settings.pauseClass).attr("data-control_action", settings.pauseClass);
                $controlsPause.appendTo($controlsContainer);
            };

            var $constrolsPrevious = $('<div></div>').addClass(settings.previousClass).attr("data-control_action", settings.previousClass);
            $constrolsPrevious.appendTo($controlsContainer);

            var $controlsNext = $('<div></div>').addClass(settings.nextClass).attr("data-control_action", settings.nextClass);
            $controlsNext.appendTo($controlsContainer);

            $sliderControls = $controlsContainer.children("div");

            // Controle par fleches + pause
            $sliderControls.on("click", function() {

                // Je recupere la direction du deplacement grace a la classe du bouton
                var direction = $(this).attr("data-control_action");

                if (allowMove && direction === "slider_previous")  {

                        move(direction);

                } else if (allowMove && direction === "slider_next") {

                        move(direction);

                } else if (direction === "slider_pause") {

                    pause();

                };

            });
        }

        function setSliderWidth() {

            totalImg = $sliderImg.length;
            $sliderContent.width(settings.sliderWidth * totalImg);

        }


        function pause() {

            if (settings.auto) {

                settings.auto = false;
                $sliderControls.eq(0).addClass("active");

            } else {

                settings.auto = true;
                $sliderControls.eq(0).removeClass("active");
                enableAutoSlide();

            };

        }

        function enableAutoSlide() {

            autoSlide =  setInterval(function() {

                if (settings.auto && allowMove) {

                    move("slider_next");

                };

            }, settings.timeBetweenSlide);
        }

        function activeBullet(nb) {

            $sliderBullets.removeClass("active");
            $sliderBullets.eq(nb - 1).addClass("active");

        }
        function activeThumbnail(nb) {

            $sliderThumbnails.removeClass("active");
            $sliderThumbnails.eq(nb - 1).addClass("active");

        }

        function setIndexes() {

            if (currentImg > totalImg) {

                currentImg = 1;

            } else if (currentImg < 1) {

                currentImg = totalImg;

            };

            if (nextImg > totalImg) {

                nextImg = 1;

            } else if (nextImg < 1) {

                nextImg = totalImg;

            };

        }


        function move(direction, targetSlide) {

            if (allowMove) {

                clearInterval(autoSlide);
                allowMove = false;

                if (settings.animationStyle === "fade") {

                    if (direction === "slider_next") {

                        if (targetSlide) {

                            nextImg = targetSlide;

                        } else {

                            nextImg = currentImg + 1;

                        };

                        setIndexes();
                        fade();

                    } else if (direction === "slider_previous") {

                        if (targetSlide) {

                            nextImg = targetSlide;

                        } else {

                            nextImg = currentImg - 1;

                        };

                        setIndexes();
                        fade();

                    };

                    currentImg = nextImg;
                    setIndexes();

                    if (settings.bullets) {

                        activeBullet(currentImg);

                    };

                    if (settings.thumbnails) {

                        activeThumbnail(currentImg);

                    };

                } else if (settings.animationStyle === "slide") {

                    if (direction === "slider_next") {

                        if (targetSlide) {

                            nextImg = targetSlide;

                        } else {

                            nextImg = currentImg + 1;

                        };

                        setIndexes();
                        slide();

                    } else if (direction === "slider_previous") {

                        if (targetSlide) {

                            nextImg = targetSlide;

                        } else {

                            nextImg = currentImg - 1;

                        };

                        setIndexes();
                        slide();

                    };

                    currentImg = nextImg;

                };


            };

        }

        function slide() {

            var distance = settings.sliderWidth * (nextImg - 1);

            $sliderContent.animate({
                "left": -distance
            }, settings.animationDelay, function() {

                if($sliderImg.parent().eq(currentImg - 1).attr("class") === "clonelast") {
                    $sliderContent.css({"left" : -(totalImg - 2) * settings.sliderWidth});
                    currentImg = totalImg - 1;

                } else if($sliderImg.parent().eq(currentImg - 1).attr("class") === "clonefirst") {

                    $sliderContent.css({"left" : -settings.sliderWidth});
                    currentImg = 2;

                };

                if (settings.bullets) {

                    activeBullet(currentImg - 1);

                };

                if (settings.thumbnails) {

                    activeThumbnail(currentImg - 1);

                };

                allowMove = true;

                enableAutoSlide();

            });

        }

        function fade() {

            $sliderImg.parent().eq(currentImg - 1).fadeOut(settings.animationDelay);
            $sliderImg.parent().eq(nextImg - 1).fadeIn(settings.animationDelay, function() {

                allowMove = true;

                enableAutoSlide();

            });
        }

       function setAnimationStyle() {

            clearInterval(autoSlide);

            // Pour le fade, les imgs sont empilées en absolute, je les masque toute sauf celle de départ
            if (settings.animationStyle === "fade") {

                currentImg = 1;
                nextImg = 2;
                $sliderContent.find(".clonefirst").remove();
                $sliderContent.find(".clonelast").remove();
                $sliderImg.parent().css({position: "absolute", display: "none", float: "none", "height": settings.sliderHeight});
                $sliderImg.parent().eq(currentImg - 1).css({display: "block"});
                $sliderContent.css({"left": 0});

                if (settings.bullets) {

                    activeBullet(currentImg);

                };

                if (settings.thumbnails) {

                    activeThumbnail(currentImg);

                };

            // Pour le slide, je les met en inline
        } else if (settings.animationStyle === "slide") {

            $clone_first = $sliderImg.parent().eq(0).clone();
            $clone_last = $sliderImg.parent().eq($sliderImg.length - 1).clone();

            $clone_first.addClass("clonefirst").appendTo($sliderContent);
            $clone_last.addClass("clonelast").prependTo($sliderContent);

            // On met a jour la liste des sliderImg pour rajouter les 2 clones
            $sliderImg = $sliderContent.children("li").children("img");

            $sliderContent.css({"left": -settings.sliderWidth});
            $sliderImg.parent().css({"float": "left", "display": "inline", "position": "relative", "height": settings.sliderHeight});

            currentImg = 2;
            nextImg = 3;

            if (settings.bullets) {

                activeBullet(currentImg - 1);

            };

            if (settings.thumbnails) {

                activeThumbnail(currentImg - 1);

            };
        };

        setSliderWidth();

        if (settings.auto) {

            enableAutoSlide();

        };

    }

        // APPELS !

        createMarkup();
        setAnimationStyle();

    };

})(jQuery);