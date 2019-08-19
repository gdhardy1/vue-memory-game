import PlayingCard from "./components/PlayingCard.vue";

export interface SelectedCard {
  clickedCard?: PlayingCard;
  id: string;
  stack: string;
}

export interface CardData {
  image: NodeRequire;
  id: string;
}

export interface GameState {
  disabled: string[];
  firstCard: SelectedCard;
  lockBoard: boolean;
}
