<template>
  <div>
    <BaseMenu
      @difficulty="setDifficulty"
      :currentLevel="difficulty"
      :deck="deck"
    />
    <section
      id="memory-game"
      class="memory-game"
      :class="{'memory-game--hard':difficulty == 'Hard','memory-game--medium':difficulty == 'Medium'}"
    >
      <div
        class="card-wrapper"
        v-for="card in deck"
        :key="`${card.id}-1`"
      >
        <PlayingCard
          :cardData="card"
          :stack="1"
          :gameState="{isFlipped,firstCard,secondCard,lockBoard,turns,matches,disabled}"
          @flip="flipCard"
        />
      </div>
      <div
        class="card-wrapper"
        v-for="card in deck"
        :key="`${card.id}-2`"
      >
        <PlayingCard
          :cardData="
          card"
          :stack="2"
          :gameState="{isFlipped,firstCard,secondCard,lockBoard,turns,matches,disabled}"
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
  isFlipped: boolean = false; // indicates whether a  card has already been flipped
  firstCard: SelectedCard = { id: "null", stack: "1" };
  secondCard: SelectedCard = { id: "null", stack: "2" }; // first and second card clicked
  lockBoard: boolean = false; // Use to determine if player should be allowed to flip cards
  turns: number = 0; // counts number of turns taken
  matches: number = 0; // used to determine if win condition has been met
  disabled: string[] = [];
  cardsDisabled: boolean = false;
  cards!: Element[]; // Initialized on component mount
  difficulty: string = "Easy";

  cardDeck: CardData[] = Deck;

  constructor() {
    super();
  }

  get deck() {
    let cardPairs: number;
    // let newDeck = this.cardDeck.splice(0, this.cardDeck.length);

    switch (this.difficulty) {
      case "Easy":
        cardPairs = 6;
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

  setDifficulty(level: string) {
    this.difficulty = level;
  }

  flipCard(payload: SelectedCard) {
    let { clickedCard, id, stack } = payload;

    // If no card has been flipped
    if (!this.isFlipped) {
      // Set isFlipped condition to true
      this.isFlipped = true;
      this.firstCard = payload;
    } else {
      // If a card is already flipped
      this.isFlipped = false;
      this.secondCard = payload;
      this.turns++; // Increase turn counter

      // check if first and second cards match
      this.checkForMatch();
    }
  }

  checkForMatch() {
    // Executes after second card is flipped
    let isMatch: boolean = this.firstCard.id === this.secondCard.id;

    // If cards match
    if (isMatch) {
      this.disabled.push(this.firstCard.id);
      this.matches++; // increase match counter
    } else {
      this.unflipCards();
    }
    // Once player matches all cards, the game is won
    if (this.matches == this.deck.length) {
      console.log("YOU WIN!");
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
    [this.isFlipped, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [
      { id: "null", stack: "1" },
      { id: "null", stack: "2" }
    ];
  }

  // Shuffle position of cards on game load
  shuffle() {
    this.cards.forEach(value => {
      let randomPos: string = Math.floor(Math.random() * 100).toString();
      let card: HTMLElement = <HTMLElement>value;
      card.style.order = randomPos;
    });
    Math.random;
  }

  mounted() {
    // Assert non-null since we wait for mount
    this.cards = Array.from(document.getElementById("memory-game")!.children);

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
  padding-bottom: calc(100% * 3.5 / 2.25);
}
</style>