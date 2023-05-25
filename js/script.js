// GLOBALS
/*global $:false, document:false, window:false, checkdata:false*/
var textInterval;

// Animating the alternating text in the splash screen
$(function () {
  "use strict";
  var $textList = $("#textList li"),
    n = $textList.length,
    i = 0;
  textInterval = setInterval(function () {
    $($textList[i]).fadeOut(300);
    i += 1;
    i = (i === n) ? 0 : i;
    $($textList[i]).fadeIn(300);
  }, 3000);
});

(function () {
  var throttle = function (type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function () {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  throttle("resize", "optimizedResize");
})();

$(document).on("ready", function () {
  // Get video

  var $highlighter = $("#highlighter"),
    $page = $("html, body"),
    $bandTextLi = $("#bandText li"),
    $instruments = $("#instruments"),
    offsetArray,
    scrollTimeout,
    oldIndex = 0;

  function setOffsetArray() {
    offsetArray = [$("#home").offset().top, $("#band").offset().top, $("#events").offset().top || 0, $("#gallery").offset().top];
  }

  setOffsetArray();

  function handleVideoLoad() {
    // Hiding splash screen
    $("#splash").fadeOut(400);
    // Stopping text animation intervall
    clearInterval(textInterval);
  }


  if (document.getElementById('video')) {
    var video = document.getElementById('video');
    video.load();
    video.addEventListener('loadeddata', function () {
      // Video is loaded and can be played
      handleVideoLoad();
      video.play();
    }, false);
  } else {
    handleVideoLoad();
  }

  function handleHightlighter(n) {
    $highlighter.stop(true, false).animate({
      "margin-left": 100 / offsetArray.length * n + "%"
    }, 500);
  }

  function handleScroll(n) {
    $page.stop(true, false).animate({
      scrollTop: offsetArray[n] - $("#nav").height()
    }, 500);
    handleHightlighter(n);
  }

  function bandAnimation(index) {
    $($bandTextLi[oldIndex]).stop(true, false).hide(300);
    $($bandTextLi[index]).stop(true, false).show(300);
    oldIndex = index;
  }

  $("#navigator ul#nav > li").on("click", function () {
    handleScroll($(this).index());
  });
  $("#scroll").on("click", function () {
    handleScroll(1);
  });

  $instruments.on("click", "li", function () {
    var $this = $(this);
    if ($this.hasClass("selected")) {
      bandAnimation(0);
    } else {
      $instruments.find(".selected").removeClass("selected");
      bandAnimation($(this).index() + 1);
    }
    $this.toggleClass("selected");

  });

  $(window).on("scroll", function () {
    var i, stop;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      for (i = 0, stop = 0; i < offsetArray.length && !stop; i += 1) {
        if (offsetArray[i] >= $(document).scrollTop()) {
          stop = 1;
          handleHightlighter(i);
        }
      }
    }, 500);
  });

  $("#toggleNav").on("click", function (e) {
    $("#nav").stop(true, false).toggle(500);
    $("#nav").toggleClass("visible");
    e.stopPropagation();
  });

  $("#nav").on("click", function (e) {
    e.stopPropagation();
  });

  $(window).on("click", function () {
    if ($("#nav").hasClass("visible")) {
      $("#nav").stop(true, false).hide(500);
    }
  });

  // Setup events to handle rotation and resize
  if (typeof window.orientation === 'undefined') {
    window.addEventListener("optimizedResize", setOffsetArray);
  } else {
    window.addEventListener("orientationchange", setOffsetArray);
  }

  $("#form").on("click", ".sendForm", function () {
    handleForm();
  });

  $("#gallery").justifiedGallery({
    rowHeight: 120,
    maxRowHeight: 200,
    lastRow: 'justify',
    refreshTime: 50,
    margins: 0
  }).on('jg.complete', function () {
    $('#gallery a').swipebox();
  });
});