$(() => {
  const toggleHide = (selector) => () => $(selector).toggleClass("hide");
  const changeText = (selector, newtext) => $(selector).text(newtext);
  const toggleActivePlayer = () => $(".panel").toggleClass("active");

  $(".ok").click(toggleHide("#welcome-div"));
  $("#rules").click(toggleHide("#welcome-div"));
  $(".lang").click(toggleHide(".label")).click(toggleHide($("#welcome-div").children())).click(() => {
    // устанавливает дефолтное имя игрока в соответствии с выбранным языком
    for (let i = 1; i <= 2; i++) {
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
    const offHoldBtn = () => $("#hold").off("click");
    let totalScoreSelector = ".active .total-score span";
    let currentScoreSelector = ".active .current-box .current-score";
    let totalScore = valToInt(totalScoreSelector);
    let diceSide = Math.floor(Math.random() * 6) + 1;

    if (totalScore < 100) {
      $("#dice-img").attr("src", "images/dice-" + diceSide + ".png").removeClass("hide");
      if (diceSide !== 1) {
        let currentScore= valToInt(currentScoreSelector) + diceSide;
        changeText(currentScoreSelector, currentScore);

        $("#hold").click((event) => {
          event.stopImmediatePropagation(event);
          totalScore += valToInt(currentScoreSelector);
          changeText(currentScoreSelector, 0);
          changeText(totalScoreSelector, totalScore);
          totalScore >= 100 ? $(".active .win").removeClass("winner-text-hide") : toggleActivePlayer();
          $("#dice-img").addClass("hide");
          offHoldBtn();
        });

      } else {
        changeText(currentScoreSelector, 0);
        offHoldBtn();
        toggleActivePlayer();
      }
    }
  });
  $("#new-game").click(() => {
    for (let i = 1; i <= 2; i++) {
      changeText(".player-" + i + " .total-score span", 0);
      changeText(".player-" + i + " .current-box .current-score", 0);
    }
    $(".active .win").addClass("winner-text-hide");
    $("#dice-img").addClass("hide");
    $(".player-2").hasClass("active") ? toggleActivePlayer() : 0;
  });
});
