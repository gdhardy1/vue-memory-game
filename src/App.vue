<template>
  <div>
    <BaseMenu
      @difficulty="setDifficulty"
      @restart="restartGame"
      :currentLevel="difficulty"
      :deck="deck"
    />
    <transition name="fade">
      <div class="you-win" v-if="winState">
        <p class="you-win__text">You Win!!!</p>
      </div>
    </transition>
    <section
      ref="memoryGame"
      id="memory-game"
      class="memory-game"
      :class="difficultyStyles"
    >
      <div class="card-wrapper" v-for="card in deck" :key="`${card.id}-1`">
        <PlayingCard
          :cardData="card"
          :stack="1"
          :restart="restart"
          :gameState="gameState"
          @flip="flipCard"
        />
      </div>
      <div class="card-wrapper" v-for="card in deck" :key="`${card.id}-2`">
        <PlayingCard
          :cardData="card"
          :stack="2"
          :restart="restart"
          :gameState="gameState"
          @flip="flipCard"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import BaseMenu from "./components/layout/BaseMenu.vue";
import PlayingCard from "./components/PlayingCard.vue";
import { Deck } from "./Cards";
import { v4 as uuid } from "uuid";
import { CardData } from "./interfaces";

@Component({
  name: "App",
  components: { BaseMenu, PlayingCard }
})
export default class App extends Vue {
  firstIsFlipped: boolean = false; // indicates whether a  card has already been flipped
  firstCard: PlayingCard | null = null;
  secondCard: PlayingCard | null = null; // first and second card clicked
  lockBoard: boolean = false; // Use to determine if player should be allowed to flip cards
  turns: number = 0; // counts number of turns taken
  matches: number = 0; // used to determine if win condition has been met
  disabled: string[] = [];
  cardsDisabled: boolean = false;
  cards!: Element[]; // Initialized on component mount
  difficulty: string = "Easy";
  restart: number = 0;
  winState: boolean = false;
  cardDeck: CardData[] = Deck;

  constructor() {
    super();
  }

  get deck() {
    let cardPairs: number;
    // choose deck size based on difficulty level
    switch (this.difficulty) {
      case "Easy":
        cardPairs = 8;
        break;
      case "Medium":
        cardPairs = 18;
        break;
      case "Hard":
        cardPairs = 32;
        break;
      default:
        cardPairs = 8;
    }

    return this.cardDeck.slice(0, cardPairs);
  }

  get gameState() {
    return {
      firstIsFlipped: this.firstIsFlipped,
      firstCard: this.firstCard,
      secondCard: this.secondCard,
      lockBoard: this.lockBoard,
      turns: this.turns,
      matches: this.matches,
      disabled: this.disabled
    };
  }

  get difficultyStyles() {
    return {
      "memory-game--hard": this.difficulty == "Hard",
      "memory-game--medium": this.difficulty == "Medium"
    };
  }

  // called when BaseMenue emits custom @difficult event
  setDifficulty(level: string) {
    this.difficulty = level;
    this.restartGame();
  }

  // called when PlayingCard emits custom @flip event
  flipCard(clickedCard: PlayingCard) {
    // If first card has not been flipped
    if (!this.firstIsFlipped) {
      // Set the first card flipped
      this.firstIsFlipped = true;
      this.firstCard = clickedCard;
    } else {
      // Set second card flipped
      this.secondCard = clickedCard;
      // Reset firstIsFlipped for next turn
      this.firstIsFlipped = false;
      // Increase turn counter
      this.turns++;
      // check if first and second cards match
      this.checkForMatch();
    }
  }

  checkForMatch() {
    // Executes after second card is flipped
    let isMatch: boolean =
      this.firstCard!.cardData.id === this.secondCard!.cardData.id;

    // If cards match
    if (isMatch) {
      // Disable cards so they can't be flipped again
      this.disabled.push(this.firstCard!.cardData.id);
      // increase match counter
      this.matches++;
    } else {
      // Turn cards back over
      this.unflipCards();
    }
    // Once player matches all cards, the game is won
    if (this.matches == this.deck.length) {
      this.winState = true;
    }
  }

  unflipCards() {
    this.lockBoard = true; // prevent player from clicking cards

    // Turn cards back to face down
    setTimeout(() => {
      this.firstCard!.reveal = false;
      this.secondCard!.reveal = false;

      this.resetBoard();
    }, 1500);
  }

  // Resets intial conditions for game
  resetBoard() {
    [this.firstIsFlipped, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }

  restartGame() {
    this.resetBoard();
    // PlayingCards watch this value to know when game has restarted
    this.restart += 1;
    // Reset to default values
    this.matches = 0;
    this.turns = 0;
    this.winState = false;
    this.disabled = [];
    this.shuffle(700);
  }

  // youWin() {}

  // Shuffle position of cards
  shuffle(delay: number = 0) {
    let callback: Function = () => {
      // Assert non-null since function only excutes on app mount or
      // after card flip animation completes
      Array.from(
        document.getElementsByClassName("memory-game")[0]!.children
      ).forEach(value => {
        let randomPos: string = Math.floor(Math.random() * 100).toString();
        let card: HTMLElement = value as HTMLElement;
        card.style.order = randomPos;
      });
    };

    setTimeout(callback, delay);
  }

  sizeGameBoard() {
    let gameBoard: HTMLElement = this.$refs.memoryGame as HTMLElement;
    let winHeight: number = window.innerHeight;
    let winWidth: number = window.innerWidth;

    if (winHeight <= winWidth) {
      gameBoard.style.paddingLeft =
        ((winWidth - winHeight + 100) / 2).toString() + "px";
      gameBoard.style.paddingRight =
        ((winWidth - winHeight + 100) / 2).toString() + "px";
    } else {
      gameBoard.style.paddingLeft = "30px";
      gameBoard.style.paddingRight = "30px";
    }
  }

  mounted() {
    this.shuffle();
    this.sizeGameBoard();

    window.onresize = this.sizeGameBoard;
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.sizeGameBoard);
  }
}
</script>

<style lang="scss">
/* Reset */
body {
  font-family: system-ui;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.play-area {
  position: relative;
  width: 100%;
}

.memory-game {
  position: fixed;
  top: 70px;
  left: 10px;
  right: 10px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);

  grid-gap: 5px;
  place-items: start;

  perspective: 1000px;

  &--medium {
    grid-template-columns: repeat(6, 1fr);
  }

  &--hard {
    grid-template-columns: repeat(8, 1fr);
  }
}

.card-wrapper {
  position: relative;
  width: 100%;

  &::after {
    content: "";
    display: inline-block;
    width: 0;
    height: 0;
    /* padding-bottom: calc(100% * 3.5 / 2.25); */
    padding-bottom: 100%;
  }
}

.you-win {
  display: flex;
  align-items: center;
  position: fixed;
  background: rgba(65, 184, 131, 0.8);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;

  &__text {
    color: #fff;
    margin: auto;
    font-size: 60px;
    padding: 20px;
    border-radius: 10px;
    background-color: #34495e;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, font-size 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
