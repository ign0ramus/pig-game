$(() => {
  const toggleHide = (selector) => () => $(selector).toggleClass("hide");
  const changeText = (selector, newtext) => $(selector).text(newtext);
  const toggleActivePlayer = () => $(".panel").toggleClass("active");

  $(".ok").click(toggleHide("#welcome-div"));
  $("#rules").click(toggleHide("#welcome-div"));
  $(".lang").click(toggleHide(".label")).click(toggleHide($("#welcome-div").children())).click(() => {
    // устанавливает дефолтное имя игрока в соответствии с выбранным языком
    for (let i = 1; i <= $(".panel").length; i++) {
      let player = $("#player" + i);
      if ( player.val() === "Игрок " + i) {
        player.val("Player " + i);
      } else {
        player.val("Игрок " + i);
      }
    }
  });
  $("#roll").click(() => {
    /* обрабатывается бросок кости и все связанные процессы в счете,
    становится доступным удержание счета */
    const valToInt = (selector) => Number.parseInt($(selector).text());
    let totalScoreSelector = ".active .total-score span";
    let currentScoreSelector = ".active .current-box .current-score";
    let totalScore = valToInt(totalScoreSelector);
    let diceSide = Math.floor(Math.random() * 6) + 1;
    const dice3d = (diceSide) => {
      let directX = 720;
      let directY = 720;
      switch(diceSide) {
        case 1: 
            break; 
        case 2: 
            directX += 270;
            break;
        case 5:
            directX += 90;
            break;
        case 6: 
            directX += 180;
        }
        switch(diceSide) {
            case 3: 
                directY += 90;
                break;
            case 4:
                directY += 270;
                break;
      }
      $(".cube").css({"transition" : "none","transform" : "rotateX(0deg) rotateY(0deg)"});
      $("#roll").css({"pointer-events" : "none"});
      setTimeout(() => {
        $(".cube").css({"transition" : "transform 4s cubic-bezier(.01,.27,.56,.98)","transform" : "rotateX(" + directX + "deg) rotateY(" + directY + "deg)"});
        $(".cube").removeClass("backt-to-1");
      });
      setTimeout(() => $("#roll").css({"pointer-events" : "auto"}), 4000);
    }
    if (totalScore < 100) {
      dice3d(diceSide);
      setTimeout(() => {
        $("#hold").click((event) => {
        event.stopImmediatePropagation(event);
        totalScore += valToInt(currentScoreSelector);
        changeText(currentScoreSelector, 0);
        changeText(totalScoreSelector, totalScore);
        totalScore >= 100 ? $(".active .win").removeClass("winner-text-hide") : toggleActivePlayer();
        $("#hold").off("click");
        $("#roll").show();
        $(".unlucky").addClass("roll-close");
        });
      }, 4200);
      if (diceSide !== 1) {
        let currentScore = valToInt(currentScoreSelector) + diceSide;
        setTimeout(() => changeText(currentScoreSelector, currentScore), 4000);
      } else {
        setTimeout(() => changeText(currentScoreSelector, 0), 4000);
        setTimeout(() => $("#roll").hide(), 4000);
        setTimeout(() => $(".unlucky").removeClass("roll-close"), 4000);
      }
    }
  });
  $("#new-game").click(() => {
    for (let i = 1; i <= $(".panel").length; i++) {
      changeText(".player-" + i + " .total-score span", 0);
      changeText(".player-" + i + " .current-box .current-score", 0);
    }
    $(".active .win").addClass("winner-text-hide");
    $(".player-2").hasClass("active") ? toggleActivePlayer() : 0;
  });
});
