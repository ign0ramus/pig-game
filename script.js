$(() => {

  // Модуль взаимодействия с пользовательским интерфейсом
  const uiController = (() => {
    // массив для сбора таймеров
    const timersArray = [];
    // время анимации + 100мс задержка
    const timer = 3100;

    const dom = {
      okBtn: ".ok",
      welcomeDiv: "#welcome-div",
      rulesBtn: "#rules",
      languageBtn: ".lang",
      btnLabel: ".label",
      hideCls: "hide",
      panelCls: ".panel",
      activeCls: "active",
      activeTtlScr: ".active .total_score",
      activeCurrScr: ".active .current_box .current_score",
      cube: ".cube",
      roll: "#roll",
      hold: "#hold",
      activeWinner: ".active .win",
      hideWinTxt: "winner_text_hide",
      unluckyDiv: ".unlucky",
      closeRollBtn: "roll_close",
      newGameBtn: "#new_game"
    };

    return {

      toggleHide(selector) {
        return () => $(selector).toggleClass(dom.hideCls);
      },

      defaultNames() {
        // устанавливает дефолтное имя игрока в соответствии с выбранным языком
        for (let i = 1; i <= $(dom.panelCls).length; i++) {
          let player = $("#player" + i);
          if ( player.val() === "Игрок " + i) {
            player.val("Player " + i);
          } else {
            player.val("Игрок " + i);
          }
        }
      },

      rollDice() {
        // Бросок кости
        let diceSide = dataController.getDiceSide();
        // Переменные для визуального броска перед показом выпавшей стороны
        let directX = 720;
        let directY = 720;
        // Добавляется угол поворота к соответствующей выпавшей стороне
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
              break
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
          $(dom.cube).css({"transition" : "transform 3s cubic-bezier(.01,.27,.56,.98)","transform" : "rotateX(" + directX + "deg) rotateY(" + directY + "deg)"});
        }, 30);
        // Перед началом анимации куб возвращается в начальное положение
        this.startPosition();
        // Блокируются кнопки на время анимации
        this.btnsOff();
        let timersClick = setTimeout(this.btnsOn, timer);
        timersArray.push(timersClick);

        return diceSide;
      },

      startPosition() {
        $(dom.cube).css({"transition" : "none","transform" : "rotateX(0deg) rotateY(0deg)"});
      },

      btnsOff() {
        $(dom.roll).css({"pointer-events" : "none"});
        $(dom.hold).css({"pointer-events" : "none"});
      },

      btnsOn() {
        $(dom.roll).css({"pointer-events" : "auto"});
        $(dom.hold).css({"pointer-events" : "auto"});
      },

      getDom() {
        return dom;
      },
      
      changeText(selector, newtext) {
        $(selector).text(newtext);
      },

      removeClass(selector, cls) {
        $(selector).removeClass(cls);
      },
      
      addClass(selector, cls) {
        $(selector).addClass(cls);
      },

      hide(selector) {
        $(selector).hide();
      },

      show(selector) {
        $(selector).show();
      },
      
      toggleActivePlayer() {
        $(dom.panelCls).toggleClass(dom.activeCls);
      },

      getTimersArr() {
        return timersArray;
      },

      allScoresToZero() {
        for (let i = 1; i <= $(dom.panelCls).length; i++) {
          uiController.changeText("#player" + i + " .total_score", dataController.initScore);
          uiController.changeText("#player" + i + " .current_box .current_score", dataController.initScore);
        }
      },

      getTimer() {
        return timer;
      }
    }
  })();

  // Модуль взаимодействия с данными в игре
  const dataController = (() => {
    // Данные необходимые для игры
    const valToInt = (selector) => Number.parseInt($(selector).text());
    const dom = uiController.getDom();
    return {
      initScore: 0,
      getTotalScore() {
        return valToInt(dom.activeTtlScr);
      },
      getDiceSide() {
        return Math.floor(Math.random() * 6) + 1;
      },
      getCurrentScore() {
        return valToInt(dom.activeCurrScr);
      }
    }
  })();

  // Модуль управления игрой
  const gameController = (() => {
    const timersArray = [];
    const dom = uiController.getDom();
    const timer = uiController.getTimer();

    const setupEventListeners = () => {

      $(dom.okBtn).click(uiController.toggleHide(dom.welcomeDiv));

      $(dom.rulesBtn).click(uiController.toggleHide(dom.welcomeDiv));

      $(dom.languageBtn).click(uiController.toggleHide(dom.btnLabel))
      $(dom.languageBtn).click(uiController.toggleHide($(dom.welcomeDiv).children()));
      $(dom.languageBtn).click(uiController.defaultNames);

      $(dom.roll).click(() => {

        let totalScore = dataController.getTotalScore();

        if (totalScore < 100) {
          let diceSide = uiController.rollDice();
          
          $(dom.hold).click((event) => {

            event.stopImmediatePropagation(event);

            totalScore += dataController.getCurrentScore();
            uiController.changeText(dom.activeCurrScr, dataController.initScore);
            uiController.changeText(dom.activeTtlScr, totalScore);

            if (totalScore >= 100) {
              
              uiController.removeClass(dom.activeWinner, dom.hideWinTxt);
              uiController.hide(dom.cube);

            } else {
              uiController.toggleActivePlayer();
            }

            $(dom.hold).off("click");
            uiController.show(dom.roll);
            uiController.addClass(dom.unluckyDiv, dom.closeRollBtn);
          });

          if (diceSide !== 1) {

            let currentScore = dataController.getCurrentScore() + diceSide;
            let timerCurrScore = setTimeout(() => uiController.changeText(dom.activeCurrScr, currentScore), timer);
            timersArray.push(timerCurrScore);

          } else {

            let timerCurrTo0 = setTimeout(() => uiController.changeText(dom.activeCurrScr, dataController.initScore), timer);
            timersArray.push(timerCurrTo0);
            let timerRollHide = setTimeout(() => uiController.hide(dom.roll), timer);
            timersArray.push(timerRollHide);
            let timerUnluckyShow = setTimeout(() => uiController.removeClass(dom.unluckyDiv, dom.closeRollBtn), timer);
            timersArray.push(timerUnluckyShow);
          }
        }
      });

      $(dom.newGameBtn).click(() => {

        uiController.startPosition();
        uiController.show(dom.cube);
        timersArray.forEach(id => clearTimeout(id));
        uiController.getTimersArr().forEach(id => clearTimeout(id));

        uiController.btnsOn();
        uiController.allScoresToZero();
        uiController.show(dom.roll);

        uiController.addClass(dom.unluckyDiv, dom.closeRollBtn);
        uiController.addClass(dom.activeWinner, dom.hideWinTxt);
        $("#player2").hasClass("active") ? uiController.toggleActivePlayer() : 0;
      });
    };

    return {
      init() {
        return setupEventListeners();
      }
    };
  })();

  
  gameController.init();
});
