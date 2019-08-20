import PlayingCard from "./components/PlayingCard.vue";

export interface SelectedCard {
  clickedCard?: PlayingCard; // Only needed when emitting flip event from selected card
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
