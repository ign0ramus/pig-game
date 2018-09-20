$(() => {
  const toggleHide = (selector) => () => $(selector).toggleClass("hide");
  const changeText = (selector, newtext) => $(selector).text(newtext);
  const toggleActivePlayer = () => $(".panel").toggleClass("active");
  const timersArray = [];
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
    let timer = 3200;
    const rotateDice = (diceSide) => {
      let directX = 720;
      let directY = 720;
      switch(diceSide) {
        case 1: 
            directX += 360;
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
      setTimeout(() => {
        $(".cube").css({"transition" : "transform 3s cubic-bezier(.01,.27,.56,.98)","transform" : "rotateX(" + directX + "deg) rotateY(" + directY + "deg)"});
      }, 30);
      $(".cube").css({"transition" : "none","transform" : "rotateX(0deg) rotateY(0deg)"});
      $("#roll").css({"pointer-events" : "none"});
      $("#hold").css({"pointer-events" : "none"});
      let timerRollClick = setTimeout(() => $("#roll").css({"pointer-events" : "auto"}), timer);
      timersArray.push(timerRollClick);
      let timerHoldClick = setTimeout(() => $("#hold").css({"pointer-events" : "auto"}), timer);
      timersArray.push(timerHoldClick);

    }
    if (totalScore < 100) {
      rotateDice(diceSide);
      $("#hold").click((event) => {
      event.stopImmediatePropagation(event);
      totalScore += valToInt(currentScoreSelector);
      changeText(currentScoreSelector, 0);
      changeText(totalScoreSelector, totalScore);
      if (totalScore >= 100) { 
         $(".active .win").removeClass("winner-text-hide");
         $(".cube").hide();
      } else {
        toggleActivePlayer();
      }
      $("#hold").off("click");
      $("#roll").show();
      $(".unlucky").addClass("roll-close");
      });
      if (diceSide !== 1) {
        let currentScore = valToInt(currentScoreSelector) + diceSide;
        let timerCurrScore = setTimeout(() => changeText(currentScoreSelector, currentScore), timer);
        timersArray.push(timerCurrScore);
      } else {
        let timerCurrTo0 = setTimeout(() => changeText(currentScoreSelector, 0), timer);
        timersArray.push(timerCurrTo0);
        let timerRollHide = setTimeout(() => $("#roll").hide(), timer);
        timersArray.push(timerRollHide);
        let timerUnluckyShow = setTimeout(() => $(".unlucky").removeClass("roll-close"), timer);
        timersArray.push(timerUnluckyShow);
      }
    }
  });
  $("#new-game").click(() => {
    $(".cube").css({"transition" : "none","transform" : "rotateX(0deg) rotateY(0deg)"}).show();
    timersArray.map(id => clearTimeout(id));
    $("#roll").css({"pointer-events" : "auto"});
    for (let i = 1; i <= $(".panel").length; i++) {
      changeText(".player-" + i + " .total-score span", 0);
      changeText(".player-" + i + " .current-box .current-score", 0);
    }
    $("#roll").show();
    $(".unlucky").addClass("roll-close");
    $(".active .win").addClass("winner-text-hide");
    $(".player-2").hasClass("active") ? toggleActivePlayer() : 0;
  });
});
