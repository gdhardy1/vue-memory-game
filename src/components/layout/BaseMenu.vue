<template>
  <div class="menu">
    <input type="checkbox" class="menu__toggle" v-model="checked" />
    <div class="toggle-icon">
      <div class="toggle-icon__line" :class="{ 'cross--top': checked }"></div>
      <div
        class="toggle-icon__line"
        :class="{ 'cross--center': checked }"
      ></div>
      <div
        class="toggle-icon__line"
        :class="{ 'cross--bottom': checked }"
      ></div>
    </div>

    <div class="menu__content" :class="{ visible: checked }">
      <div class="menu__overlay" :class="{ scale: checked }">
        <div class="menu__overlay-inner" :class="{ fadeIn: checked }">
          <div class="menu__items">
            <button class="btn reset" @click="restart()">
              New Game
            </button>
            <button
              class="btn difficulty"
              v-for="(level, index) in difficultyLevels"
              @click="changeDifficulty(level)"
              :class="{ active: currentLevel == level }"
              :key="index"
            >
              {{ level }}
            </button>
          </div>
        </div>
      </div>
    </div>
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
  private checked_: boolean = false;
  @Prop() readonly currentLevel!: string;

  constructor() {
    super();
  }

  get checked() {
    return this.checked_;
  }

  set checked(value: boolean) {
    this.checked_ = value;
  }

  changeDifficulty(level: string) {
    this.$emit("difficulty", level);
    this.$emit("restart");
    this.checked = false;
  }

  restart() {
    this.$emit("restart");
    this.checked = false;
  }
}
</script>

<style lang="scss">
.toggle-icon {
  display: grid;
  position: relative;
  top: 0;
  left: calc(100vw - 60px);

  z-index: 2;
  width: 60px;
  height: 60px;
  padding: 16px;
  background: #34495e;

  align-items: center;

  &__line {
    position: relative;
    background: #fff;
    height: 2px;
    width: 100%;
    border: none;
    transition: all 0.7s ease;
    top: 0;
    left: 0;
  }
  @media only screen and (min-width: 601px) {
    display: none;
  }
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;

  &__content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    @media only screen and (min-width: 601px) {
      display: block;
      visibility: visible;
      height: auto;
    }
  }

  &__items {
    display: grid;
    /* grid-template-columns: repeat(4, 1fr); */
    width: 220px;
    grid-gap: 10px;
    padding: 10px;
    background: #41b883;

    @media only screen and (min-width: 601px) {
      grid-template-columns: repeat(4, 1fr);
      width: 100vw;
    }
  }

  &__overlay {
    background-color: rgba(52, 73, 94, 0.8);
    border-radius: 50%;
    width: 210vw;
    height: 210vw;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    transform: scale(0);
    transition: all 0.7s ease;

    &-inner {
      text-align: center;
      max-width: 90vw;
      max-height: 100vh;
      opacity: 0;
      transition: opacity 0.4s ease;

      @media only screen and (min-width: 601px) {
        opacity: 1;
        transition: none;
      }
    }

    @media only screen and (min-width: 601px) {
      display: block;
      border-radius: 0;
      height: auto;
      width: auto;
      background: transparent;
      transform: scale(1);
      transition: none;
    }
  }

  &__toggle {
    position: absolute;
    top: 0;
    left: calc(100vw - 60px);
    z-index: 3;
    cursor: pointer;
    width: 60px;
    height: 60px;
    opacity: 0;

    @media only screen and (min-width: 601px) {
      display: none;
    }
  }
}

// Utility classes

.visible {
  visibility: visible;
}

.cross--top {
  top: 9px;
  left: 0;
  transform: rotate(135deg);
}

.cross--center {
  transform: rotate(135deg);
}

.cross--bottom {
  top: -9px;
  left: 0;
  transform: rotate(-135deg);
}

.scale {
  transform: scale(1);
  transition-duration: 1s;
}

.fadeIn {
  opacity: 1;
  transition: opacity 0.4s ease 0.4s;
}

/* Buttons */
button,
.button {
  display: inline-block;
  height: 38px;
  padding: 0 5px;
  color: #000000;
  background-color: #fff;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  text-decoration: none;

  border-radius: 4px;
  border: 1px solid #bbb;
  cursor: pointer;

  &:hover,
  &:focus {
    color: #fff;
    border-color: #888;
    background-color: #34495e;
    outline: 0;
  }
}
</style>
