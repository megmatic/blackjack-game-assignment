// MOVED SCRIPT TAG TO END OF HTML DOCUMENT
// window.addEventListener('DOMContentLoaded', function() {
//   // Execute after page load
// })

// SAVING DOM ELEMENTS TO VARIABLES
const playerTable = document.getElementById("player-hand")
const dealerTable = document.getElementById("dealer-hand")
const dealBtnRow = document.getElementById("deal-btn-only")
const hitStandBtnRow = document.getElementById("hit-stand-btns")
const rematchBtnRow = document.getElementById("rematch-btns")
const startBtnRow = document.getElementById("start-game-btn")

// INITIALIZE GLOBAL VARIABLES
let deck = [];
let playerScore;
let dealerScore;
let message;
let playerWins = 0;
let dealerWins = 0;

// RUNS WHEN THE PLAYER CLICKS EITHER THE 'START GAME' OR 'PLAY AGAIN' BUTTON, SETS OR RESETS SCORES TO 0, INITIALIZES A NEW DECK, CHANGES BUTTON DISPLAY, REMOVES IMAGES OF CARDS FROM PREVIOUS ROUNDS
function startGame() {
    playerScore = 0;
    dealerScore = 0;
    message = ''
    deck = buildDeck();
    startBtnRow.style.display = "none";
    dealBtnRow.style.display = "flex";
    rematchBtnRow.style.display = "none";
    document.querySelectorAll("img")
      .forEach(img => img.remove());
    document.getElementById("messages").innerHTML = "A new deck has been shuffled for this round."
    displayScore();
}

// BUILD A DECK OF 52 CARDS
function buildDeck() {
  for(i=1; i <= 13; i++) {
    deck.push({rank: i, suit: 'hearts'})
  }
  for(i=1; i <= 13; i++) {
    deck.push({rank: i, suit: 'spades'})
  }
  for(i=1; i <= 13; i++) {
    deck.push({rank: i, suit: 'diamonds'})
  }
  for(i=1; i <= 13; i++) {
    deck.push({rank: i, suit: 'clubs'})
  }
  return deck;
}

// REMOVES A RANDOM CARD OBJECT FROM THE DECK AND SAVES IT TO A VARIABLE 
// SETS THE RANK NAME (FOR PULLING THE CORRECT PNG FILE) AND THE NUMBER OF POINTS ASSOCIATED WITH IT
// ADDS AN IMAGE TO THE NEWCARDOBJECT AND SETS THE SOURCE TO THE CORRECT PNG
// RETURNS THE NEW CARD OBJECT
function pullCard() {
  const newCardObj = deck.splice(Math.floor(Math.random()*deck.length), 1).pop();
  switch (newCardObj.rank) {
    case 1:
      newCardObj.rankName = "ace";
      newCardObj.points = 11;
      break;
    case 11:
      newCardObj.rankName = "jack";
      newCardObj.points = 10;
      break;
    case 12:
      newCardObj.rankName = "queen";
      newCardObj.points = 10;
      break;
    case 13:
      newCardObj.rankName = "king";
      newCardObj.points = 10;
      break
    default:
      newCardObj.rankName = newCardObj.rank;
      newCardObj.points = newCardObj.rank;
  }
  newCardObj.image = new Image;
  newCardObj.image.src = `images/${newCardObj.rankName}_of_${newCardObj.suit}.png`
  newCardObj.image.alt = `${newCardObj.rankName} of ${newCardObj.suit}`
  return newCardObj;
}

// CALCULATES THE POINTS THE PLAYER OR DEALER RECEIVES FROM THE CARD
function calculatePoints(card, person) {
  if (person == "dealer") {
    dealerScore += card.points;
  } else if (person == "player") {
    playerScore += card.points;
  }
}

// DISPLAYS THE SCORE ON THE GAME BOARD
function displayScore() {
  document.getElementById("player-points").innerHTML = `\u00A0| Score: ${playerScore}`;
  document.getElementById("dealer-points").innerHTML = `\u00A0| Score: ${dealerScore}`;
}

// PLAYS A CARD TO THE PLAYER, UPDATES THE SCORE, AND DISPLAYS THE NEW SCORE AND THE IMAGE OF THE CARD
function playCardToPlayer() {
  let playerCard = pullCard();
  calculatePoints(playerCard, "player")
  playerTable.append(playerCard.image)
  displayScore()
}

// PLAYS A CARD TO THE DEALER, UPDATES THE SCORE, AND DISPLAYS THE NEW SCORE AND THE IMAGE OF THE CARD
function playCardToDealer() {
  let dealerCard = pullCard();
  calculatePoints(dealerCard, "dealer")
  dealerTable.append(dealerCard.image)
  displayScore()
}

// DEALS FOUR CARDS, ALTERNATING BETWEEN THE PLAYER AND DEALER
function dealCards() {
  playCardToPlayer()
  playCardToDealer()
  playCardToPlayer()
  playCardToDealer()
}

// DISPLAYS WINS ON THE GAME BOARD
function displayWins () {
  document.getElementById("player-wins").innerHTML = `Wins: ${playerWins}`
  document.getElementById("dealer-wins").innerHTML = `Wins: ${dealerWins}`
}

// PROVIDES FUNCTIONALITY WHEN A GAME IS DETERMINED TO BE WON, DISPLAYS THE WINS, UPDATES THE AVAILABLE BUTTONS, DISPLAYS END OF GAME MESSAGE
function gameOver(message) {
  displayWins();
  hitStandBtnRow.style.display = "none";
  rematchBtnRow.style.display = "flex";
  document.getElementById("messages").innerHTML = `${message}<br>Would you like to play again or cash out?`;
}

// PROVIDES FUNCTIONALITY FOR WHEN A BLACKJACK IS DEALT 
function blackjack() {
  if (playerScore == 21 && dealerScore == 21) {
    message = `WOW! A blackjack tie! No one wins. Keep your bets.`
    gameOver(message)
    return
  } else if (playerScore == 21) {
    message = `Player got a Blackjack, Player wins!`
    playerWins++
    gameOver(message)
    return
  } else if (dealerScore == 21) {
    message = `Dealer got a Blackjack, Dealer wins!`
    dealerWins++
    gameOver(message)
    return
  }
}

// PROVIDES LOGIC FOR WHO WINS THE GAME, SETS THE CORRECT MESSAGE, UPDATES THE WIN VARIABLES, RUNS THE GAMEOVER FUNCTION
function determineGame() {
  if (playerScore > 21 && dealerScore > 21) {
    message = `idk what the rules are`
    gameOver(message)
  } else if (dealerScore > 21) {
    message = `Dealer busts, Player wins!`
    playerWins++
    gameOver(message);
  } else if (playerScore > 21) {
    message = `Player busts, Dealer wins!`
    dealerWins++
    gameOver(message);
  } else if (dealerScore >= 17) {
    if (playerScore > dealerScore) {
      message = `Player has the higher score, Player wins!`
      playerWins++
      gameOver(message)
    } else if (dealerScore > playerScore) {
      message = `Dealer has the higher score, Dealer wins!`
      dealerWins++
      gameOver(message)
    } else {
      message = `Wow! A rare tie. No one wins, keep your bets.`
      gameOver(message)
    }
  }
}

// RUNS WHEN THE PLAYER CLICKS THE 'DEAL' BUTTON, DEALS THE FIRST FOUR CARDS, CHANGES THE BUTTONS AVAILABLE, CHECKS FOR BLACKJACKS, AND ASKS PLAYER FOR THEIR NEXT MOVE
function deal() {
  dealCards()
  dealBtnRow.style.display = "none";
  if (playerScore == 21 || dealerScore == 21) {
    blackjack()
    return
  }
  document.getElementById("messages").innerHTML = "Would you like to hit or stand?"
  hitStandBtnRow.style.display = "flex";   
}

// RUNS WHEN THE PLAYER CLICKS THE 'HIT' BUTTON, DEALS A CARD TO THE PLAYER AND CHECKS FOR A BUST, DEALS A CARD TO THE DEALER IF NO BUST, CHECKS THE SCORE
function hit() {
  playCardToPlayer();
  if (playerScore > 21) {
    determineGame();
    return
  }
  playCardToDealer();
  determineGame();
}

// RUNS WHEN THE PLAYER CLICKS THE 'STAND' BUTTON, DEALS CARDS TO THE DEALER UNTIL THE DEALER REACHES 17 POINTS, CHECKS THE SCORE
function stand() {
  while (dealerScore < 17) {
    playCardToDealer()
  }
  determineGame()
}

// RUNS WHEN THE PLAYER DECIDES TO CASH OUT INSTEAD OF OF PLAY AGAIN, REMOVES THE CARDS AND SCORES, DISPLAYS CASH OUT MESSAGE
function cashOut() {
  document.getElementById("player-points").innerHTML = `\u00A0`;
  document.getElementById("dealer-points").innerHTML = `\u00A0`;
  document.querySelectorAll("img")
      .forEach(img => img.remove());
  document.getElementById("messages").innerHTML = `You won ${playerWins} ouT of ${playerWins + dealerWins} games.<br>You are cashing out with $0.`;
}

// FUNCTIONALITY FOR DISABLING BUTTONS IF NEEDED LATER:

// const dealBtn = document.getElementById("deal-button")
// const hitBtn = document.getElementById("hit-button")
// const standBtn = document.getElementById("stand-button")

// function disableBtns(...btns) {
//   btns.forEach(b => b.disabled = true)
// }

// function enableBtns(...btns) {
//   btns.forEach(b => b.disabled = false);
// }

// ARCHIVED CODE OF PREVIOUS ITERATIONS OF SOME FUNCTIONS:

// function deal() {
//   let cards = document.querySelectorAll("img");
//   let deal = document.getElementById("deal-button");

//   deal.addEventListener("click", () => {
//     cards.forEach(c => c.style.display = "inline-flex");
//   })
// }

// function deal() {
//   let card1 = new Image();
//   card1.src = "images/2_of_clubs.png"
//   let card2 = new Image();
//   card2.src = "images/3_of_clubs.png"
//   let card3 = new Image();
//   card3.src = "images/4_of_clubs.png"
//   let card4 = new Image();
//   card4.src = "images/5_of_clubs.png"
//   let card5 = new Image();
//   card5.src = "images/6_of_clubs.png"
//   let card6 = new Image();
//   card6.src = "images/7_of_clubs.png"
//   let card7 = new Image();
//   card7.src = "images/8_of_clubs.png"
//   let card8 = new Image();
//   card8.src = "images/9_of_clubs.png"
//   let playerHand = document.getElementById("player-hand")
//   let dealerHand = document.getElementById("dealer-hand")
//   playerHand.append(card1, card2, card3, card4);
//   dealerHand.append(card5, card6, card7, card8);
// }

// function pullCard() {
//   const newCardObj = deck.splice(Math.floor(Math.random()*deck.length), 1).pop();
//   switch (newCardObj.rank) {
//     case 1:
//       newCardObj.rank = "ace";
//       break;
//     case 11:
//       newCardObj.rank = "jack";
//       break;
//     case 12:
//       newCardObj.rank = "queen";
//       break;
//     case 13:
//       newCardObj.rank = "king";
//       break
//   }
//   const newCardImg = new Image;
//   newCardImg.src = `images/${newCardObj.rank}_of_${newCardObj.suit}.png`
//   return newCardImg;
// }

 // function deal() {
  //   const card1 = pullCard();
  //   const card2 = pullCard();
  //   const card3 = pullCard();
  //   const card4 = pullCard();
  //   const card5 = pullCard();
  //   const card6 = pullCard();
  //   const card7 = pullCard();
  //   const card8 = pullCard();

  //   playerScore = playerScore + card1.rank + card2.rank + card3.rank + card4.rank;
  //   playerTable.append(card1.image, card2.image, card3.image, card4.image);
  //   console.log(`Player score: ${playerScore}`);
  //   document.getElementById("player-points").innerHTML = ` | Score: ${playerScore}`;
  //   dealerScore = dealerScore + card5.rank + card6.rank + card7.rank + card8.rank;
  //   dealerTable.append(card5.image, card6.image, card7.image, card8.image);
  //   console.log(`Dealer score: ${dealerScore}`)
  //   document.getElementById("dealer-points").innerHTML = ` | Score: ${dealerScore}`;
  //   console.log(deck)
  // }

  //  function hit() {
  //   const playerCard = pullCard();
  //   const dealerCard = pullCard();
  //   playerTable.append(playerCard.image);
  //   playerScore += playerCard.rank;
  //   console.log(`Player score: ${playerScore}`);
  //   document.getElementById("player-points").innerHTML = ` | Score: ${playerScore}`;
  //   dealerTable.append(dealerCard.image);
  //   dealerScore += dealerCard.rank;
  //   console.log(`Dealer score: ${dealerScore}`)
  //   document.getElementById("dealer-points").innerHTML = ` | Score: ${dealerScore}`;
  //   console.log(deck)
  // }