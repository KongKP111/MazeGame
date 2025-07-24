// minigame2.js - Star Matching Puzzle Minigame
// This script creates a modal minigame for matching star cards.
// It can be integrated into the main maze game by calling showMinigame2(switchId) when stepping on a switch.

const STARS_MG2 = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]; // Pairs of stars from 1 to 5

let cards_mg2 = [];
let currentSwitchId_mg2 = null;
let onSuccessCallback_mg2 = null;
let flippedCards_mg2 = [];
let matchedPairs_mg2 = 0;

// Shuffle function for minigame2
function shuffle_mg2(array) {
  let copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Create card element for minigame2
function createCard_mg2(value) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.value = value;
  // 3. Increase card size for a better look and more space for stars
  card.style.width = '90px'; // Increased width
  card.style.height = '120px'; // Increased height
  card.style.margin = '10px';
  card.style.backgroundColor = '#ccc';
  card.style.borderRadius = '10px';
  card.style.display = 'flex';
  card.style.alignItems = 'center';
  card.style.justifyContent = 'center';
  card.style.fontSize = '2em'; // This will be overridden for individual stars
  card.style.cursor = 'pointer';
  card.style.transition = 'transform 0.6s';
  card.style.transformStyle = 'preserve-3d';
  card.style.position = 'relative';
  card.style.overflow = 'hidden'; // Crucial to keep content inside

  const front = document.createElement('div');
  front.className = 'front';
  front.style.position = 'absolute';
  front.style.width = '100%';
  front.style.height = '100%';
  front.style.backfaceVisibility = 'hidden';
  front.style.display = 'flex';
  front.style.flexWrap = 'wrap'; // Allows stars to wrap to the next line
  front.style.alignContent = 'center'; // Distribute rows of stars nicely
  front.style.justifyContent = 'center'; // Center stars horizontally
  front.style.backgroundColor = '#fff';
  front.style.border = '1px solid #000';
  front.style.borderRadius = '10px';
  front.style.transform = 'rotateY(180deg)';
  front.style.padding = '5px'; // Padding to keep stars away from edges

  // 1. Reduce star size and 2. Arrange stars beautifully within the card
  for (let i = 0; i < value; i++) {
    const starSpan = document.createElement('span');
    starSpan.textContent = '⭐';
    starSpan.style.fontSize = '1.3em'; // Smaller stars
    starSpan.style.margin = '2px'; // Small margin between stars

    // Advanced arrangement based on the number of stars
    if (value === 1) {
        starSpan.style.flexBasis = '100%'; // Center a single star
    } else if (value === 2) {
        starSpan.style.flexBasis = '45%'; // Two stars side by side
    } else if (value === 3) {
        starSpan.style.flexBasis = '30%'; // Three stars in a row
    } else if (value === 4) {
        starSpan.style.flexBasis = '45%'; // Two rows of two stars
    } else if (value === 5) {
        // Arrange 5 stars as 3 on top, 2 on bottom
        if (i < 3) { // First 3 stars
            starSpan.style.flexBasis = '30%';
        } else { // Last 2 stars
            starSpan.style.flexBasis = '45%';
        }
    }
    front.appendChild(starSpan);
  }

  const back = document.createElement('div');
  back.className = 'back';
  back.style.position = 'absolute';
  back.style.width = '100%';
  back.style.height = '100%';
  back.style.backfaceVisibility = 'hidden';
  back.style.display = 'flex';
  back.style.alignItems = 'center';
  back.style.justifyContent = 'center';
  back.style.backgroundColor = '#667eea'; /* A nice back color */
  back.style.border = '2px solid #667eea';
  back.style.borderRadius = '10px';
  back.textContent = '?';

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', handleCardClick_mg2);

  return card;
}

// Handle card click for minigame2
function handleCardClick_mg2(e) {
  const card = e.currentTarget;
  if (flippedCards_mg2.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
    card.classList.add('flipped');
    flippedCards_mg2.push(card);
    if (flippedCards_mg2.length === 2) {
      checkMatch_mg2();
    }
  }
}

// Check if flipped cards match for minigame2
function checkMatch_mg2() {
  const [card1, card2] = flippedCards_mg2;
  if (card1.dataset.value === card2.dataset.value) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs_mg2++;
    if (matchedPairs_mg2 === STARS_MG2.length / 2) {
      setTimeout(() => {
        closeMinigame2(); // Call the specific close function
        if (onSuccessCallback_mg2) onSuccessCallback_mg2(currentSwitchId_mg2);
      }, 1000);
    }
    flippedCards_mg2 = [];
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards_mg2 = [];
    }, 1000);
  }
}

// Draw the cards for minigame2
function drawCards_mg2() {
  const gridDiv = document.getElementById('card-grid');
  if (!gridDiv) return; // Ensure gridDiv exists
  gridDiv.innerHTML = '';
  cards_mg2.forEach(value => {
    gridDiv.appendChild(createCard_mg2(value));
  });
  // Update grid columns to match the new, larger card width
  gridDiv.style.gridTemplateColumns = `repeat(5, 90px)`; // Adjusted to new card width
}

// Create the modal for minigame2
function createModal_mg2() {
  // Check if modal already exists to prevent duplicates
  let modal = document.getElementById('minigame-modal');
  if (modal) {
    modal.remove(); // Remove existing modal if any
  }

  modal = document.createElement('div');
  modal.id = 'minigame-modal'; // This ID is shared, but only one modal instance should be active.
  modal.style.display = 'flex';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.background = 'rgba(0,0,0,0.5)';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '200';

  const content = document.createElement('div');
  content.style.background = 'white';
  content.style.padding = '20px';
  content.style.borderRadius = '10px';
  content.style.textAlign = 'center';
  content.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';

  const title = document.createElement('h2');
  title.textContent = 'Star Matching Puzzle';
  content.appendChild(title);

  const desc = document.createElement('p');
  desc.textContent = 'Click to flip cards and match pairs of stars (1 to 5). Match all to win!';
  content.appendChild(desc);

  const gridDiv = document.createElement('div');
  gridDiv.id = 'card-grid';
  gridDiv.style.display = 'grid';
  // Update grid columns to match the new, larger card width
  gridDiv.style.gridTemplateColumns = 'repeat(5, 90px)'; // Adjusted for wider cards
  gridDiv.style.justifyContent = 'center';
  content.appendChild(gridDiv);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.onclick = closeMinigame2; // Call the specific close function
  content.appendChild(closeBtn);

  modal.appendChild(content);
  document.body.appendChild(modal);
}

// Show the minigame (GLOBAL FUNCTION)
function showMinigame2(switchId, callback) {
  currentSwitchId_mg2 = switchId;
  onSuccessCallback_mg2 = callback;
  cards_mg2 = shuffle_mg2(STARS_MG2);
  flippedCards_mg2 = [];
  matchedPairs_mg2 = 0;
  createModal_mg2();
  drawCards_mg2();
}

// Close the minigame (GLOBAL FUNCTION)
function closeMinigame2() {
  const modal = document.getElementById('minigame-modal');
  if (modal) modal.remove();
}