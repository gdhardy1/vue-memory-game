import PlayingCard from "./components/PlayingCard.vue";

export interface CardData {
  image: NodeRequire;
  id: string;
}

export interface GameState {
  disabled: string[];
  firstCard: PlayingCard | null;
  lockBoard: boolean;
}
