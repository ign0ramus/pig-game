$(() => {
  const toggleHide = (selector) => () => $(selector).toggleClass("hide");
  const changeText = (selector, newtext) => $(selector).text(newtext);
  const toggleActivePlayer = () => $(".panel").toggleClass("active");
  const hideDiceImg = () => $("#dice-img").addClass("hide");

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

    if (totalScore < 100) {
      $("#dice-img").attr("src", "images/dice-" + diceSide + ".png").removeClass("hide");
      $("#hold").click((event) => {
        event.stopImmediatePropagation(event);
        totalScore += valToInt(currentScoreSelector);
        changeText(currentScoreSelector, 0);
        changeText(totalScoreSelector, totalScore);
        totalScore >= 100 ? $(".active .win").removeClass("winner-text-hide") : toggleActivePlayer();
        hideDiceImg();
        $("#hold").off("click");
        $("#roll").show();
        $(".unlucky").addClass("roll-close");
      });
      if (diceSide !== 1) {
        let currentScore= valToInt(currentScoreSelector) + diceSide;
        changeText(currentScoreSelector, currentScore);
      } else {
        changeText(currentScoreSelector, 0);
        $("#roll").hide();
        $(".unlucky").removeClass("roll-close");
      }
    }
  });
  $("#new-game").click(() => {
    for (let i = 1; i <= $(".panel").length; i++) {
      changeText(".player-" + i + " .total-score span", 0);
      changeText(".player-" + i + " .current-box .current-score", 0);
    }
    $(".active .win").addClass("winner-text-hide");
    hideDiceImg();
    $(".player-2").hasClass("active") ? toggleActivePlayer() : 0;
  });
});
