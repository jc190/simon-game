var Simon = {
  simonOn: false,
  timeID: undefined,
  strictMode: false,
  isPlayerTurn: false,
  playerCount: 0,
  turnCounter: 0,
  options: ['blue', 'red', 'green', 'yellow'],
  moves: [],
  wrong: new Audio('./audio/wrong.wav'),

  blue: {
    sound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
  },
  red: {
    sound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
  },
  green: {
    sound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
  },
  yellow: {
    sound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
  },

  playSound: function(color) {
    Simon[color].sound.currentTime = 0;
    Simon[color].sound.play();
  },

  playBack: function(currentMoves) {
    $('.simon-circle').addClass('disable');
    if (!currentMoves) {
      currentMoves = Simon.moves;
    }

    function timedPlayBack(i) {
      Simon.timeID = setTimeout(function() {
        if (Simon.simonOn === false) {
          return false;
        }
        Simon.playSound(currentMoves[i]);
        $('#' + currentMoves[i]).addClass('active-simon');
        if (i === currentMoves.length - 1) {
          setTimeout(function() {
            Simon.isPlayerTurn = true;
            $('.simon-circle').removeClass('disable');
          }, 500);
        }
        setTimeout(function() {
          $('#' + currentMoves[i]).removeClass('active-simon');
        }, 500);
      }, i * 800);
    }
    for (var i = 0; i < currentMoves.length; i++) {

      timedPlayBack(i);
    }
  },

  chooseMove: function() {
    if (Simon.turnCounter === 20) {
      alert('You win!');
      Simon.reset();
      return;
    }
    var temp = getRandomInt(0, Simon.options.length - 1);
    Simon.moves.push(Simon.options[temp]);
    Simon.playBack(Simon.moves);
    Simon.turnCounter++;
    turnCount();
    Simon.playerCount = 0;
  },

  reset: function() {
    Simon.moves = [];
    Simon.turnCounter = 0;
    Simon.chooseMove();
  }
};

function turnCount() {
  if (Simon.turnCounter < 10) {
    $('#turn-count').text('0' + Simon.turnCounter);
  } else {
    $('#turn-count').text(Simon.turnCounter);
  }
}

$('.simon-circle').on('click', function() {
  if (Simon.isPlayerTurn === true) {
    if (this.id === Simon.moves[Simon.playerCount]) {
      Simon.playerCount++;
      Simon.playSound(this.id);
      if (Simon.playerCount === Simon.moves.length) {
        Simon.isPlayerTurn = false;
        setTimeout(Simon.chooseMove, 1000);
      }
    } else {
      if (Simon.strictMode === true) {
        $('#turn-count').text('!!');
        Simon.wrong.play();
        Simon.playerCount = 0;
        Simon.isPlayerTurn = false;
        setTimeout(Simon.reset, 1000);
      } else {
        $('#turn-count').text('!!');
        setTimeout(turnCount, 1000);
        Simon.wrong.play();
        Simon.playerCount = 0;
        Simon.isPlayerTurn = false;
        setTimeout(Simon.playBack, 1000);
      }
    }
  }
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

$('#on-off').on('click', function() {
  if (Simon.simonOn === false) {
    $('#turn-count').addClass('score-on');
    $('#strict-mode').removeClass('disable');
    $('.simon-circle').removeClass('disable');
    $('#on-off').addClass('active-switch');
    Simon.simonOn = true;
    Simon.reset();
  } else {
    $('#turn-count').removeClass('score-on');
    $('.simon-circle').addClass('disable');
    $('#on-off').removeClass('active-switch');
    if (Simon.strictMode === true) {
      $('#strict-mode').click();
    }
    $('#strict-mode').addClass('disable');
    Simon.simonOn = false;
    Simon.isPlayerTurn = false;
    $('#turn-count').text('--');
    clearTimeout(Simon.timeID);
    Simon.timeID = undefined;
  }
});

$('#strict-mode').on('click', function() {
  if (Simon.strictMode === false) {
    $('#strict-mode').addClass('active-switch');
    Simon.strictMode = true;
  } else {
    $('#strict-mode').removeClass('active-switch');
    Simon.strictMode = false;
  }
});
