<template>
  <div class="menu">
    <button
      class="btn difficulty"
      v-for="level in difficultyLevels"
      @click="changeDifficulty(level)"
      :class="{active: currentLevel == level}"
    >{{level}}</button>
    <button
      class="btn reset"
      @click="$emit('restart')"
    >New Game</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  name: "BaseMenu"
})
export default class BaseMenu extends Vue {
  difficultyLevels: string[] = ["Easy", "Medium", "Hard"];
  @Prop() readonly currentLevel!: string;

  constructor() {
    super();
  }

  changeDifficulty(level: string) {
    this.$emit("difficulty", level);
    this.$emit("restart");
  }
}
</script>

<style>
</style>
