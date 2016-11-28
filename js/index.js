var Simon = (function() {
  // Define default state of game
  var state = {
    simonOn: false,
    strictMode: false,
    isPlayerTurn: false,
    playerCount: 0,
    turnCount: 0,
    moves: [],
    timeID: null,
    playbackSpeed: 800
  };
  // Define game button options
  var buttons = {
    options: ['blue', 'red', 'green', 'yellow']
  };
  // Define sound sources
  var sounds = {
    wrong: new Audio('./audio/wrong.wav'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
  };
  // Play sound clips
  function playSound(type) {
    sounds[type].currentTime = 0;
    sounds[type].play();
  }
  // Increment and check turn counter & increase speed after level 10
  function turnCount() {
    if (state.turnCounter < 10) {
      $('#turn-count').text('0' + state.turnCounter);
    } else {
      $('#turn-count').text(state.turnCounter);
      state.playbackSpeed = 500;
    }
  }
  // Random number generator
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // Playback moves taken so far
  function playBack(currentMoves) {
    $('.simon-circle').addClass('disable');
    if (!currentMoves) {
      currentMoves = state.moves;
    }
    // Define timed playback function
    function timedPlayBack(i) {
      state.timeID = setTimeout(function() {
        if (state.simonOn === false) {
          return false;
        }
        playSound(currentMoves[i]);
        $('#' + currentMoves[i]).addClass('active-simon');
        if (i === currentMoves.length - 1) {
          setTimeout(function() {
            state.isPlayerTurn = true;
            $('.simon-circle').removeClass('disable');
          }, 500);
        }
        setTimeout(function() {
          $('#' + currentMoves[i]).removeClass('active-simon');
        }, 500);
      }, i * state.playbackSpeed);
    }
    for (var i = 0; i < currentMoves.length; i++) {
      timedPlayBack(i);
    }
  }
  // Cpu choose move algo
  function chooseMove() {
    if (state.turnCounter === 20) {
      alert('You win!');
      return reset();
    }
    var choice = getRandomInt(0, buttons.options.length - 1);
    state.moves.push(buttons.options[choice]);
    playBack(state.moves);
    state.turnCounter++;
    turnCount();
    state.playerCount = 0;
  }
  // Resets game and restarts with cpu turn
  function reset() {
    state.moves = [];
    state.turnCounter = 0;
    chooseMove();
  }
  // Return object with public functions
  return {
    init: function() {
      // Event listener for color buttons
      $('.simon-circle').on('click', function() {
        if (state.isPlayerTurn === true) {
          if (this.id === state.moves[state.playerCount]) {
            state.playerCount++;
            playSound(this.id);
            if (state.playerCount === state.moves.length) {
              state.isPlayerTurn = false;
              setTimeout(chooseMove, 1000);
            }
          } else {
            $('#turn-count').text('!!');
            playSound('wrong');
            state.playerCount = 0;
            state.isPlayerTurn = false;
            if (state.strictMode === true) {
              setTimeout(reset, 1000);
            } else {
              setTimeout(turnCount, 1000);
              setTimeout(playBack, 1000);
            }
          }
        }
      });
      // Event listener for on / off button
      $('#on-off').on('click', function() {
        if (state.simonOn === false) {
          $('#turn-count').addClass('score-on');
          $('#strict-mode').removeClass('disable');
          $('.simon-circle').removeClass('disable');
          $('#on-off').addClass('active-switch');
          state.simonOn = true;
          reset();
        } else {
          $('#turn-count').removeClass('score-on');
          $('.simon-circle').addClass('disable');
          $('#on-off').removeClass('active-switch');
          if (state.strictMode === true) {
            $('#strict-mode').click();
          }
          $('#strict-mode').addClass('disable');
          state.simonOn = false;
          state.isPlayerTurn = false;
          $('#turn-count').text('--');
          clearTimeout(state.timeID);
          state.timeID = null;
        }
      });
      // Event listener for strict mode button
      $('#strict-mode').on('click', function() {
        if (state.strictMode === false) {
          $('#strict-mode').addClass('active-switch');
          state.strictMode = true;
        } else {
          $('#strict-mode').removeClass('active-switch');
          state.strictMode = false;
        }
      });
    }
  };
})();
// Start game
Simon.init();
