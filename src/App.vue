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
        <div class="you-win__text">You Win!!!</div>
      </div>
    </transition>
    <section id="memory-game" class="memory-game" :class="difficultyStyles">
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
import { SelectedCard, CardData } from "./interfaces";

@Component({
  name: "App",
  components: { BaseMenu, PlayingCard }
})
export default class App extends Vue {
  firstIsFlipped: boolean = false; // indicates whether a  card has already been flipped
  firstCard: SelectedCard = { id: "null", stack: "1" };
  secondCard: SelectedCard = { id: "null", stack: "2" }; // first and second card clicked
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
        cardPairs = 2;
        break;
      case "Medium":
        cardPairs = 12;
        break;
      case "Hard":
        cardPairs = 24;
        break;
      default:
        cardPairs = 6;
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

  setDifficulty(level: string) {
    this.difficulty = level;
    let callback = this.shuffle;

    // Shuffle cards when difficulty changes
    // Wait for card flip animation to complete so that
    // new card position is not revelead inadvertently
    setTimeout(() => {
      // wait for next tick to ensure all new cards have mounted
      this.$nextTick(callback);
    }, 700);
  }

  flipCard(payload: SelectedCard) {
    let { clickedCard, id, stack } = payload;

    // If first card has not been flipped
    if (!this.firstIsFlipped) {
      // Set the first card flipped
      this.firstIsFlipped = true;
      this.firstCard = payload;
    } else {
      // Set second card flipped
      this.secondCard = payload;
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
    let isMatch: boolean = this.firstCard.id === this.secondCard.id;

    // If cards match
    if (isMatch) {
      // Disable cards so they can't be flipped again
      this.disabled.push(this.firstCard.id);
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
      this.firstCard.clickedCard!.reveal = !this.firstCard.clickedCard!.reveal;
      this.secondCard.clickedCard!.reveal = !this.secondCard.clickedCard!
        .reveal;

      this.resetBoard();
    }, 1500);
  }

  // Resets intial conditions for game
  resetBoard() {
    [this.firstIsFlipped, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [
      { id: "null", stack: "1" },
      { id: "null", stack: "2" }
    ];
  }

  restartGame() {
    this.resetBoard();
    // PlayingCards watch this value to know when game has restarted
    this.restart += 1;
    // Reset to defaul values
    this.matches = 0;
    this.turns = 0;
    this.winState = false;
    this.disabled = [];
  }

  // youWin() {}

  // Shuffle position of cards on game load
  shuffle() {
    // Assert non-null since we wait for mount
    Array.from(
      document.getElementsByClassName("memory-game")[0]!.children
    ).forEach(value => {
      let randomPos: string = Math.floor(Math.random() * 100).toString();
      let card: HTMLElement = value as HTMLElement;
      card.style.order = randomPos;
    });
    Math.random;
  }

  mounted() {
    this.shuffle();
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* Reset */

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  height: 100vh;
  background-color: #d1d1d1;
}

.play-area {
  position: relative;
  width: 100%;
}

.memory-game {
  position: relative;
  padding: 10px 20% 0 20%;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 5px;
  place-items: start;

  perspective: 1000px;
}

.memory-game.memory-game--medium {
  grid-template-columns: repeat(6, 1fr);
}

.memory-game.memory-game--hard {
  grid-template-columns: repeat(8, 1fr);
}

.card-wrapper {
  position: relative;
  width: 100%;
}

.card-wrapper::after {
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  /* padding-bottom: calc(100% * 3.5 / 2.25); */
  padding-bottom: 100%;
}

.you-win {
  position: absolute;
}

.you-win__text {
  position: relative;

  margin: auto;
  font-size: 40px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, font-size 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
