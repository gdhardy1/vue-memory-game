import Card from "./components/Card.vue";

export interface SelectedCard {
  clickedCard?: Card;
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
