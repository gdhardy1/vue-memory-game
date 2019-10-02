import { shallowMount } from "@vue/test-utils";
import PlayingCard from "@/components/PlayingCard.vue";

import { CombinedVueInstance } from "vue/types/vue";

describe("PlayingCard.vue", () => {
  test("flip() returns 'Board Locked' when board is locked", () => {
    const wrapper: any = shallowMount(PlayingCard, {
      propsData: {
        cardData: { image: "./assets/svg/android.svg", id: "1" },
        gameState: { lockBoard: true }
      }
    });
    expect(wrapper.vm.flip()).toMatch("Board Locked");
  });

  test("flip() returns 'Card matched already' if card is disabled", () => {
    const wrapper: any = shallowMount(PlayingCard, {
      propsData: {
        cardData: { image: "./assets/svg/android.svg", id: "1" },
        gameState: { disabled: ["1"], lockBoard: false }
      }
    });
    expect(wrapper.vm.flip()).toMatch("Card matched already");
  });

  test("flip() returns 'Click a different card' if firstCard is same as second card", () => {
    const wrapper: any = shallowMount(PlayingCard, {
      propsData: {
        // second card ckicked
        cardData: { image: "./assets/svg/android.svg", id: "1" },
        // stack that second card came from
        stack: "1",
        gameState: {
          // first card clicked
          firstCard: {
            image: "./assets/svg/android.svg",
            cardData: { id: "1" },
            stack: "1"
          },
          disabled: [],
          lockBoard: false
        }
      }
    });
    expect(wrapper.vm.flip()).toMatch("Click a different card");
  });
});
