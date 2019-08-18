<template>
  <div
    class="memory-card"
    :class="{flip: reveal}"
    :data-framework="cardData.framework"
    @click="flip"
  >
    <img
      class="front-face"
      :src="cardData.image"
      :alt="cardData.framework"
    />
    <img
      class="back-face"
      src="../assets/svg/topview.svg"
      alt="JS Badge"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { SelectedCard, GameState, CardData } from "../interfaces";

@Component({
  name: "Card",
  props: ["cardData", "gameState", "stack"]
})
export default class Card extends Vue {
  reveal: boolean = true;
  // Props, assert initialization when component created
  cardData!: CardData;
  gameState!: GameState;
  stack!: string;

  constructor() {
    super();
  }

  flip(e: MouseEvent) {
    // Player should not be able to flip cards when the board is locked
    if (this.gameState.lockBoard) return;
    // Don't flip card if it has already been matched
    if (this.gameState.disabled.includes(this.cardData.id)) return;
    if (
      this.cardData.id === this.gameState.firstCard.id &&
      this.stack === this.gameState.firstCard.stack
    ) {
      return;
    }

    let clickedCard: Card = this;
    let id: string = this.cardData.id;
    let stack: string = this.stack;

    this.$emit("flip", { clickedCard, id, stack });
    this.reveal = !this.reveal;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.memory-card {
  width: 100%;
  height: 100%;

  position: relative;
  transform: scale(1);
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.memory-card:active {
  transform: scale(0.97);
  transition: transform 0.2s;
}

.front-face,
.back-face {
  position: absolute;
  border: 2px solid #ffffff;
  padding: 5px;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: rgb(6, 125, 172);
  backface-visibility: hidden;
}

.front-face {
  transform: rotateY(180deg);
}

.memory-card.flip {
  transform: rotateY(180deg);
  transition: 0.5s;
}
</style>
