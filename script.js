$(() => {
  const toggleHide = (selector) => () => $(selector).toggleClass("hide");
  const changeText = (selector, newtext) => {
    $(selector).text(newtext);
  };

  $(".ok").click(toggleHide("#welcome-div"));
  $("#rules").click(toggleHide("#welcome-div"));
  $(".lang").click(toggleHide(".label"));
  $(".lang").click(toggleHide($("#welcome-div").children()));
  $(".lang").click(() => {
    // меняет дефолтное имя игрока в соответствии с выбранным языком
    const player1 = $("#player1");
    const player2 = $("#player2");
    if ( player1.val() === "Игрок 1" && player2.val() === "Игрок 2") {
      player1.val("Player 1");
      player2.val("Player 2");
    } else {
      player1.val("Игрок 1");
      player2.val("Игрок 2");
    }
  });

  $("#roll").click(() => {
    // обрабатывает бросок кости, становится доступным удержание счета
    const valToInt = (selector) => Number.parseInt($(selector).text());
    const showDice = () => {
      $("#dice-img").attr("src", "images/dice-" + diceSide.toString() + ".png").removeClass("hide");
    };
    const toggleActivePlayer = () => {
      $(".panel").toggleClass("active");
    };
    const offHoldBtn = () => {
      $("#hold").off("click");
    };
    let totalScoreSelector = ".active .total-score span";
    let currentScoreSelector = ".active .current-box .current-score";
    let totalScore = valToInt(totalScoreSelector);

    let diceSide = Math.floor(Math.random() * 6) + 1;
    if (totalScore < 100) {
      if (diceSide !== 1) {
        let currentScore= valToInt(currentScoreSelector);
        currentScore += diceSide;
        showDice();
        changeText(currentScoreSelector, currentScore);

        $("#hold").click((event) => {
          event.stopImmediatePropagation(event);
          totalScore += valToInt(currentScoreSelector);
          changeText(currentScoreSelector, "0");
          changeText(totalScoreSelector, totalScore);
          if (totalScore >= 100) {
            $(".active .win").removeClass("winner-text-hide");
          } else {
            toggleActivePlayer();
          }
          $("#dice-img").addClass("hide");
          offHoldBtn();
        });

      } else {
        showDice();
        changeText(currentScoreSelector, 0);
        offHoldBtn();
        toggleActivePlayer();
      }
    }
  });
  $("#new-game").click(() => {
    changeText(".player-1 .total-score span", 0);
    changeText(".player-1 .current-box .current-score", 0);
    changeText(".player-2 .total-score span", 0);
    changeText(".player-2 .current-box .current-score", 0);
    if ($(".player-2").hasClass("active")) {
      $(".panel").toggleClass("active");
    }
    if (!$("#dice-img").hasClass("hide")) {
      $("#dice-img").addClass("hide");
    }
    $(".active .win").addClass("winner-text-hide");
  });
});
