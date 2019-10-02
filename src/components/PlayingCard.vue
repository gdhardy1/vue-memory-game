<template>
  <div class="memory-card" :class="{ flip: reveal }" @click="flip">
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
  unflipCard(val: string, oldval: string) {
    this.reveal = false;
  }

  constructor() {
    super();
  }

  flip(e: MouseEvent) {
    // Player should not be able to flip cards when the board is locked
    if (this.gameState.lockBoard) return "Board Locked";
    // Don't flip card if it has already been matched
    if (this.gameState.disabled.includes(this.cardData.id))
      return "Card matched already";
    // Prevent player from flipping the same card twice in a row
    if (
      this.gameState.firstCard && // first card has been selected
      this.cardData.id === this.gameState.firstCard.cardData.id &&
      this.stack === this.gameState.firstCard.stack
    ) {
      return "Click a different card";
    }

    this.$emit("flip", this); // Pass the card in the payload so it can be flipped back over
    this.reveal = !this.reveal;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.memory-card {
  width: 100%;
  height: 100%;
  border: 2px solid #0e0b0b;
  border-radius: 5px;

  position: absolute;
  transform: scale(1);
  transform-style: preserve-3d;
  transition: transform 0.5s;

  &:active {
    transform: scale(0.97);
    transition: transform 0.2s;
  }

  &.flip {
    transform: rotateY(180deg);
    transition: 0.5s;
  }
}

.front-face,
.back-face {
  position: absolute;
  background: #fff;
  border-radius: 5px;
  padding: 5px;
  width: 100%;
  height: 100%;

  backface-visibility: hidden;
}

.front-face {
  transform: rotateY(180deg);
}
</style>
