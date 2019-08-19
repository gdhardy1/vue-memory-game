<template>
  <div class="menu">
    <button
      class="difficulty"
      v-for="level in difficultyLevels"
      @click="$emit('difficulty', level)"
      :class="{active: currentLevel == level}"
    >{{level}}</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  name: "BaseMenu",
  props: ["currentLevel"]
})
export default class BaseMenu extends Vue {
  difficultyLevels: string[] = ["Easy", "Medium", "Hard"];

  constructor() {
    super();
  }
  setLevel(level: string) {
    this.$emit("difficulty", level);
  }
}
</script>

<style>
</style>
