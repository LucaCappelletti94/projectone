$(document).on("ready", function () {
  var $eventGallery = $(".eventContainer");
  var $events = $eventGallery.find("li");
  var $manouver = $events.eq(0);
  var selectedEventIndex = $eventGallery.find(".selected").index();
  var $arrowLeft = $eventGallery.find(".arrowLeft");
  var $arrowRight = $eventGallery.find(".arrowRight");
  var arrowAnimationSpeed = 300;
  var scrollAnimationSpeed = 300;
  var $eventInfoContainer = $("#eventInfoContainer li");

  var newMargin = 0;

  var showLeftArrow = function () {
    $arrowLeft.stop(true, false).animate({
      "margin-left": 0
    }, arrowAnimationSpeed);
  };

  var hideLeftArrow = function () {
    $arrowLeft.stop(true, false).animate({
      "margin-left": -$arrowLeft.width()
    }, arrowAnimationSpeed);
  };

  var showRightArrow = function () {
    $arrowRight.stop(true, false).animate({
      "margin-right": 0
    }, arrowAnimationSpeed);
  };

  var hideRightArrow = function () {
    $arrowRight.stop(true, false).animate({
      "margin-right": -$arrowRight.width()
    }, arrowAnimationSpeed);
  };

  var updateManouver = function (delta) {

    var center = false;

    if ($eventGallery.width() >= $events.length * $events.width()) {
      $eventGallery.css({
        "max-width": $events.length * $manouver.width() + "px"
      });
      center = true;
    } else {
      $eventGallery.css({
        "max-width": "90%"
      });
    }

    newMargin += delta;

    if (center) {
      hideLeftArrow();
      hideRightArrow();
    } else if (delta > 0) {
      // Moving towards left
      showRightArrow();
    } else {
      // Moving towards right
      showLeftArrow();
    }

    if (newMargin > 0) {
      newMargin = 0;
      hideLeftArrow();
    }

    if (newMargin < $eventGallery.width() - $events.length * $manouver.width()) {
      newMargin = $eventGallery.width() - $events.length * $manouver.width();
      hideRightArrow();
    }

    $manouver.stop(true, false).animate({
      "margin-left": newMargin
    }, scrollAnimationSpeed);
  };

  var calculateDelta = function (selectedElementIndex) {
    var visibleElementsNumber = $eventGallery.width() / $manouver.width();
    var delta = -(selectedElementIndex - visibleElementsNumber / 2) * $manouver.width();
    return delta;
  };

  updateManouver(calculateDelta(selectedEventIndex));

  var resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      selectedEventIndex = $eventGallery.find(".selected").index();

      updateManouver(calculateDelta(selectedEventIndex));
    }, 250);
  });

  $eventGallery.on("click", "li", function () {
    $events.removeClass("selected");
    $(this).addClass("selected");
    updateManouver(calculateDelta($(this).index()));
    $eventInfoContainer.stop(true, false).hide(400);
    $eventInfoContainer.eq($(this).index()).stop(true, false).show(400);
  });

  $arrowLeft.on("click", function () {
    updateManouver($eventGallery.width());
  });

  $arrowRight.on("click", function () {
    updateManouver(-$eventGallery.width());
  });

});