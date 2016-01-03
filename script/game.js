 $(document).ready(function() {

  var square= 1;
  var j = 0;
  var k = square;
  var l = 1;
  var nbSliders = square * square;

    // Variables pour la partie
    var music = new Audio('script/media/jingle_bell.mp3');
    music.volume = 0.2;
    var snowing = false;

    var score = 0;
    var clicks = 0;
    var timer = 300;
    var timerOriginal = 300;
    var playing = false;

    var rand3 = 50;
    var width = rand3 * square;

    var $mosaic = $("#mosaic_holder");
    var message;

    function startTimer() {

      playing = true;
      var game = setInterval(function() {

        // J'affiche le temps restant toutes les secondes
        $(".victory").html("Vite, il ne vous reste plus que " + timer / 10 + " s");

        // Lorsque la partie est finie d'une maniere ou d'une autre
        if (timer < 1 || score === k) {

          // On stop le chrono
          clearInterval(game);
          if (score === k) {

            endGame(true);

          } else {

            endGame(false);

          };

        };

        timer--;

      }, 100);

    }

    function endGame(victory) {

      // On vide la div score et on desactive les clicks
      $(".slider").off();

      $(".header_intro").fadeOut(2000);
      $mosaic.fadeOut(2000);
      $(".victory").fadeOut(2000, function() {

        if (victory) {

          $(".header_intro").html("<p class='header_text'>" + message + "</p>");
          $(".header_intro").append("<a href='index.html' class='retry_link'>Rejouer ?</a>");


        } else {

          $(".header_intro").html("<p class='header_text'>Quel dommage, vous n'etes pas parvenu  a recuperer tous les cadeaux</p>");
          $(".header_intro").append("<a href='index.html' class='retry_link'>Reesayer ?</a>");

        };

        $(".header_intro").fadeIn(1500);

      });

    }


    function getMessage() {

      $.ajax({

        url: "wishcard.php",
        type: "GET",

        success: function(resultat) {

          message = resultat;

        }

      });

    }

    function displayIntro() {

      $header = $(".header_intro");

      $para = $('<p class="header_text"></p>').css({display: "none"});
      $para2 = $('<p class="header_text"></p>').css({display: "none"});
      $para.appendTo($header);
      $para2.appendTo($header);

      $(".victory").css({display : "none"});
      $(".victory").html("A vous de jouer !");


      $para.html("Oh non, tous les cadeaux sont tombes du traineau...");
      $para2.html("Aidez vite le Pere Noel a les ramasser avant la fin du temps imparti.");

      $para.fadeIn(4000, function() {

        $para2.fadeIn(4000, function() {

          santaPop();
          reindeerPop();
          $mosaic.fadeIn(4000, function() {

            $(".victory").fadeIn(2000, function() {

              startGame();

            });

          });

        });

      });

    }

    function generateGameMarkup() {

      // Generation du markup
      for (var i = 0; i < square; i++) {

        var $li = $('<li class="mosaic"></li>');

        for (j = l; j <= k ; j++) {

          var $slider = $('<span id="slider' + j + '" class="slider"></span>').appendTo($li);

        };

        l = k + 1;
        k = k + square;

        $li.appendTo($mosaic);
        $mosaic.css({display : "none"});
      };


      j = k = square * square;

      // On définit la largeur des differents elements pour un rendu pas trop dégueu...
      // $(".wrapper").width(width + 200);
      $mosaic.width(width);
      $(".mosaic").width(width);

      generateGameSliders(j, k);

    }

    function generateGameSliders(j, k) {

      for (var i = 0; i <= k; i++) {

        var rand = Math.random() * (1000 - 500) + 500;
        var rand2 = Math.random() * (1000 - 500) + 500;

        // On creer tous les sliders, avec des valeurs randoms, sans controls
        $("#slider" + i).glissant({
          imgs: ["style/images/gift_red.png", "style/images/gift_blue.png", "style/images/gift_green.png", "style/images/gift_yellow.png", "style/images/gift_purple.png"],
          animationStyle: "fade",
          sliderWidth: rand3,
          sliderHeight: rand3,
          manualControls: false,
          bullets: false,
          thumbnails: false,
          captions: false,
          timeBetweenSlide: rand,
          animationDelay: rand2
        });

        // On desactive le drag lors du cliqué déplacé
        $("#slider" + i).mousedown(function(e) {

          e.preventDefault();

        });

        j--;

      };

    }

    function startGame() {

      for (var i = 1; i <= nbSliders; i++) {
        // On ajoute un listener par slider
        $("#slider" + i).on("click", function() {

          // Si le slider n'est pas checked, je remplace son contenu par une croix rouge et j'incremente le score
          if ($(this).attr("status") !== "checked") {

            var $img = $('<img src="style/images/tick.png" alt="tick" />').width(rand3);
            $(this).html($img);
            $(this).attr("status", "checked");

            // On incremente le score et on l'affiche
            score++;
          };

          // Pour le debut de partie, j'afficher le timer une premiere fois et je lance le chrono
          if (!playing) {

            $(".victory").html("Temps restant : " + timer + " s");
            startTimer();

          };

        });

      };

    }

    function snow() {

      if (!snowing) {

        $(document).snowfall({

          maxSize: 10,
          round: true,
          shadow: true,
          flakeCount: 70

        });

        snowing = true;

      };

    }

    function santaPop() {

      $santa = $("<img src='style/images/santa_small.png' alt='santa' />");
      $santa.css({

        position: "fixed",
        bottom: 100,
        right: -400

      });

      $santa.appendTo($("body"));

      $santa.animate({

        right: 160

      }, 3000);

    }

    function reindeerPop() {

      $reindeer = $("<img src='style/images/reindeer.png' alt='reindeer'/>");
      $reindeer.css({

        position: "absolute",
        top: 150,
        left: -300

      });

      $reindeer.appendTo($("body"));

      $reindeer.animate({

        left: 120

      }, 2000);

    }

    // OH OH OH
    setTimeout(function() {

      getMessage();
      // snow();
      music.play();
      displayIntro();
      generateGameMarkup();

    }, 1250)

    // On repete la musique comme un sagouin
    music.onended = function() {
      music.play();
    };
  })