// SAVING DOM ELEMENTS TO VARIABLES
const playerTable = document.getElementById("player-hand")
const dealerTable = document.getElementById("dealer-hand")
const dealBtnRow = document.getElementById("deal-btn-only")
const hitStandBtnRow = document.getElementById("hit-stand-btns")
const rematchBtnRow = document.getElementById("rematch-btns")
const startBtnRow = document.getElementById("start-game-btn")

// INITIALIZE GLOBAL VARIABLES
let message
let playerWins = 0
let dealerWins = 0
let playerHand
let dealerHand

// INITIALIZE CLASSES
class Card {
    constructor(rank, suit) {
        this.rank = rank
        this.suit = suit
        this.image = new Image
        switch (this.rank) {
            case 1:
                this.rankName = "ace"
                this.points = 11
                break
            case 11:
                this.rankName = "jack"
                this.points = 10
                break
            case 12:
                this.rankName = "queen"
                this.points = 10
                break
            case 13:
                this.rankName = "king"
                this.points = 10
                break
            default:
                this.rankName = this.rank
                this.points = this.rank
        }
        this.image.src = `images/${this.rankName}_of_${this.suit}.png`
        this.image.alt = `${this.rankName} of ${this.suit}`
    }
    getImageUrl() {
        return this.image.src
    }
}

class Hand {
    constructor() {
        this.hand = []
        this.totalPoints = 0
    }
    addCard(Card) {
        this.hand.push(Card)
        this.totalPoints += Card.points
    }
    getPoints() {
        return this.totalPoints
    }
}

class Deck {
    constructor() {
        this.deck = []
        let suits = ['hearts', 'spades', 'diamonds', 'clubs']
        for(let i=0; i < 4; i++) {
            for(let j=1; j <= 13; j++) {
                this.deck.push(new Card(j, suits[i]))
            }
        }
    }
    draw() {
        let newCard = this.deck.splice(Math.floor(Math.random()*this.deck.length), 1).pop()
        return newCard
    }
    shuffle() {
        let count = this.deck.length
        while(count) {
            this.deck.push(this.deck.splice(Math.floor(Math.random() * count), 1) [0])
            count -= 1
        }
    }
    numCardsLeft() {
        return this.deck.length
    }
}

//
// GAME PLAY FUNCTIONS
//


// RUNS WHEN THE PLAYER CLICKS EITHER THE 'START GAME' OR 'PLAY AGAIN' BUTTON, SETS OR RESETS SCORES TO 0, INITIALIZES A NEW DECK, CHANGES BUTTON DISPLAY, REMOVES IMAGES OF CARDS FROM PREVIOUS ROUNDS
function startGame() {
    message = ''
    deck = new Deck()
    dealerHand = new Hand()
    console.log(dealerHand.getPoints())
    playerHand = new Hand()
    console.log(playerHand.getPoints())
    startBtnRow.style.display = "none"
    dealBtnRow.style.display = "flex"
    rematchBtnRow.style.display = "none"
    document.querySelectorAll("img")
      .forEach(img => img.remove())
    document.getElementById("messages").innerHTML = "A new deck has been shuffled for this round."
    displayScore()
}

// RUNS WHEN THE PLAYER CLICKS THE 'DEAL' BUTTON, DEALS THE FIRST FOUR CARDS, CHANGES THE BUTTONS AVAILABLE, CHECKS FOR BLACKJACKS, AND ASKS PLAYER FOR THEIR NEXT MOVE
function deal() {
  dealCards()
  dealBtnRow.style.display = "none"
  if (playerHand.getPoints() == 21 || dealerHand.getPoints() == 21) {
    blackjack()
    return
  }
  document.getElementById("messages").innerHTML = "Would you like to hit or stand?"
  hitStandBtnRow.style.display = "flex"   
}

// RUNS WHEN THE PLAYER CLICKS THE 'HIT' BUTTON, DEALS A CARD TO THE PLAYER AND CHECKS FOR A BUST, DEALS A CARD TO THE DEALER IF NO BUST, CHECKS THE SCORE
function hit() {
  playCardToPlayer()
  if (playerHand.getPoints() > 21) {
    determineGame()
    return
  }
  playCardToDealer()
  determineGame()
}

// RUNS WHEN THE PLAYER CLICKS THE 'STAND' BUTTON, DEALS CARDS TO THE DEALER UNTIL THE DEALER REACHES 17 POINTS, CHECKS THE SCORE
function stand() {
  while (dealerHand.getPoints() < 17) {
    playCardToDealer()
  }
  determineGame()
}

// RUNS WHEN THE PLAYER DECIDES TO CASH OUT INSTEAD OF OF PLAY AGAIN, REMOVES THE CARDS AND SCORES, DISPLAYS CASH OUT MESSAGE
function cashOut() {
  document.getElementById("player-points").innerHTML = `\u00A0`
  document.getElementById("dealer-points").innerHTML = `\u00A0`
  document.querySelectorAll("img")
      .forEach(img => img.remove())
  document.getElementById("messages").innerHTML = `You won ${playerWins} out of ${playerWins + dealerWins} games.<br>You are cashing out with $0.`
}

// PLAYS A CARD TO THE PLAYER, UPDATES THE SCORE, AND DISPLAYS THE NEW SCORE AND THE IMAGE OF THE CARD
function playCardToPlayer() {
    let playerCard = deck.draw()
    console.log(playerCard)
    playerHand.addCard(playerCard)
    console.log(playerHand.getPoints())
    playerTable.append(playerCard.image)
    displayScore()
}

// PLAYS A CARD TO THE DEALER, UPDATES THE SCORE, AND DISPLAYS THE NEW SCORE AND THE IMAGE OF THE CARD
function playCardToDealer() {
  let dealerCard = deck.draw()
  console.log(dealerCard)
  dealerHand.addCard(dealerCard)
  console.log(dealerHand.getPoints())
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

//
// GAME LOGIC FUNCTIONS
//

// PROVIDES FUNCTIONALITY WHEN A GAME IS DETERMINED TO BE WON, DISPLAYS THE WINS, UPDATES THE AVAILABLE BUTTONS, DISPLAYS END OF GAME MESSAGE
function gameOver(message) {
  displayWins()
  hitStandBtnRow.style.display = "none"
  rematchBtnRow.style.display = "flex"
  document.getElementById("messages").innerHTML = `${message}<br>Would you like to play again or cash out?`
}

// PROVIDES FUNCTIONALITY FOR WHEN A BLACKJACK IS DEALT 
function blackjack() {
  if (playerHand.getPoints() == 21 && dealerHand.getPoints() == 21) {
    message = `WOW! A blackjack tie! No one wins. Keep your bets.`
    gameOver(message)
    return
  } else if (playerHand.getPoints() == 21) {
    message = `Player got a Blackjack, Player wins!`
    playerWins++
    gameOver(message)
    return
  } else if (dealerHand.getPoints() == 21) {
    message = `Dealer got a Blackjack, Dealer wins!`
    dealerWins++
    gameOver(message)
    return
  }
}

// PROVIDES LOGIC FOR WHO WINS THE GAME, SETS THE CORRECT MESSAGE, UPDATES THE WIN VARIABLES, RUNS THE GAMEOVER FUNCTION
function determineGame() {
  if (playerHand.getPoints() > 21 && dealerHand.getPoints() > 21) {
    message = `idk what the rules are`
    gameOver(message)
  } else if (dealerHand.getPoints() > 21) {
    message = `Dealer busts, Player wins!`
    playerWins++
    gameOver(message)
  } else if (playerHand.getPoints() > 21) {
    message = `Player busts, Dealer wins!`
    dealerWins++
    gameOver(message)
  } else if (dealerHand.getPoints() >= 17) {
    if (playerHand.getPoints() > dealerHand.getPoints()) {
      message = `Player has the higher score, Player wins!`
      playerWins++
      gameOver(message)
    } else if (dealerHand.getPoints() > playerHand.getPoints()) {
      message = `Dealer has the higher score, Dealer wins!`
      dealerWins++
      gameOver(message)
    } else {
      message = `Wow! A rare tie. No one wins, keep your bets.`
      gameOver(message)
    }
  }
}

//
// RENDER FUNCTIONS
//

// DISPLAYS THE SCORE ON THE GAME BOARD
function displayScore() {
  document.getElementById("player-points").innerHTML = `\u00A0| Score: ${playerHand.getPoints()}`
  document.getElementById("dealer-points").innerHTML = `\u00A0| Score: ${dealerHand.getPoints()}`
}

// DISPLAYS WINS ON THE GAME BOARD
function displayWins () {
  document.getElementById("player-wins").innerHTML = `Wins: ${playerWins}`
  document.getElementById("dealer-wins").innerHTML = `Wins: ${dealerWins}`
}



