import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";

describe("App.vue", () => {
  test.each([["Easy", 8], ["Medium", 18], ["Hard", 32]])(
    "deck(%s) returns %i cards",
    (difficulty, cardCount) => {
      cardCount = cardCount as number;
      const wrapper: any = shallowMount(App);
      wrapper.vm.difficulty = difficulty;
      expect(wrapper.vm.deck).toHaveLength(cardCount);
    }
  );
});
