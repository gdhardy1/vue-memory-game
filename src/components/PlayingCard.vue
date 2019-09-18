<template>
  <div
    class="memory-card"
    :class="{ flip: reveal }"
    :data-framework="cardData.framework"
    @click="flip"
  >
    <img class="front-face" :src="cardData.image" :alt="cardData.framework" />
    <img class="back-face" src="../assets/vue.svg" alt="JS Badge" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { GameState, CardData } from "../interfaces";
import { Prop, Watch } from "vue-property-decorator";

@Component({
  name: "PlayingCard"
})
export default class PlayingCard extends Vue {
  reveal: boolean = false;
  // Props, assert initialization when component created
  @Prop() readonly gameState!: GameState;
  @Prop() readonly stack!: string;
  @Prop() readonly cardData!: CardData;
  @Prop() readonly restart!: number;
  @Watch("restart", { immediate: true, deep: true })
  unclipCard(val: string, oldval: string) {
    this.reveal = false;
  }

  constructor() {
    super();
  }

  flip(e: MouseEvent) {
    // Player should not be able to flip cards when the board is locked
    if (this.gameState.lockBoard) return;
    // Don't flip card if it has already been matched
    if (this.gameState.disabled.includes(this.cardData.id)) return;
    // Prevent player from flipping the same card twice in a row
    if (
      this.cardData.id === this.gameState.firstCard.id &&
      this.stack === this.gameState.firstCard.stack
    ) {
      return;
    }

    let clickedCard: PlayingCard = this; // Pass the card in the payload so it can be flipped back over
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
  border: 2px solid #0e0b0b;
  border-radius: 5px;

  position: absolute;
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
  background: rgb(255, 255, 255);
  border-radius: 5px;
  padding: 5px;
  width: 100%;
  height: 100%;

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
