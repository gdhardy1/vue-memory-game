// const cards = document.querySelectorAll(".memory-card");

// // let isFlipped: Boolean = false; // indicates whether a  card has already been flipped
// // let firstCard: HTMLElement, secondCard: HTMLElement; // first and second card clicked
// // let lockBoard: Boolean = false; // Use to determine if player should be allowed to flip cards
// // let turns: Number = 0; // counts number of turns taken
// // let matches: Number = 0; // used to determine if win condition has been met

// interface myInterface {
//   myMethod: () =>
// }
// class GameService {

//     flipCard() {
//       // Executes when a card is clicked
//       console.log(this);

//       // Player should not be able to flip cards when the board is locked
//       if (this.lockBoard) return;

//       // If user clicks the same card twice it should not flip again
//       if (this === this.firstCard) return;

//       // Add class so card flips over
//       this.classList.toggle("flip");

//       // If no card has been flipped
//       if (!isFlipped) {
//         // Set isFlipped condition to true
//         isFlipped = true;
//         firstCard = this;
//       } else {
//         // If a card is already flipped
//         isFlipped = false;
//         secondCard = this;
//         turns++; // Increase turn counter
//         console.log(turns);

//         // check if first and second cards match
//         this.checkForMatch();
//       }
//     }

//     checkForMatch() {
//       // Executes after second card is flipped
//       let isMatch: Boolean =
//         firstCard.dataset.framework === secondCard.dataset.framework;

//       // If cards match
//       if (isMatch) {
//         this.disableCards();
//         matches++; // increase match counter
//       } else {
//         this.unflipCards();
//       }
//       // Once player matches all cards, the game is won
//       if (matches == 6) {
//         console.log("YOU WIN!");
//       }
//     }

//     unflipCards() {
//       this.lockBoard = true; // prevent player from clicking cards

//       // Turn cards back to face down
//       setTimeout(() => {
//         this.firstCard.classList.toggle("flip");
//         this.secondCard.classList.toggle("flip");

//         this.resetBoard();
//       }, 1500);
//     }

//     // Disables click action on cards that have been match
//     disableCards() {
//       console.log("Found a match!");
//       this.secondCard.removeEventListener("click", flipCard);
//       this.firstCard.removeEventListener("click", flipCard);
//       this.resetBoard();
//     }

//     // Resets intial conditions for game
//     resetBoard() {
//       [this.isFlipped, this.lockBoard] = [false, false];
//       [this.firstCard, this.secondCard] = [null, null];
//     }

//     // Shuffle position of cards on game load
//     // shuffle() {
//     //   cards.forEach(card => {
//     //     let randomPos = Math.floor(Math.random() * 12);
//     //     card.style.order = randomPos;
//     //   });
//     //   Math.random;
//     // },

//     // Add click event listeners to cards
//     // startGame() {
//     //   cards.forEach(card => card.addEventListener("click", flipCard));
//     // }
// }

// export default { GameService };
