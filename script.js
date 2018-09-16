$(() => {
  const toggleHide = (selector) => {
    return () => $(selector).toggleClass("hide");
  }

  $(".ok").click(toggleHide("#welcome-div"));
  $("#rules").click(toggleHide("#welcome-div"));
  $(".lang").click(toggleHide(".label"));
  $(".lang").click(toggleHide($("#welcome-div").children()));

  $(".lang").click(() => {
    // меняет дефолтное имя игрока в соответствии с выбранным языком
    let player1 = $("#player1");
    let player2 = $("#player2");
    if ( player1.val() === "Игрок 1" && player2.val() === "Игрок 2") {
      player1.val("Player 1");
      player2.val("Player 2");
    } else {
      player1.val("Игрок 1");
      player2.val("Игрок 2");
    }
  });
});
