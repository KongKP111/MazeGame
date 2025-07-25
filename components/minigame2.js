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
  card.style.width = '90px';
  card.style.height = '120px';
  card.style.margin = '10px';
  card.style.backgroundColor = 'transparent';
  card.style.border = 'none';
  card.style.borderRadius = '8px'; // Keep border-radius consistent
  card.style.cursor = 'pointer';
  card.style.position = 'relative';

  const front = document.createElement('div');
  front.className = 'front';
  front.style.position = 'absolute';
  front.style.width = '100%';
  front.style.height = '100%';
  front.style.display = 'flex';
  front.style.flexWrap = 'wrap';
  front.style.alignContent = 'center';
  front.style.justifyContent = 'center';
  front.style.backgroundColor = '#fff'; // White background for the front
  front.style.border = '2px solid #FFBF00'; // Gold border for the front - matched to star color
  front.style.borderRadius = '8px'; // Keep border-radius consistent
  front.style.padding = '5px';

  // Generate individual star <span> elements with the darker color and black border
  for (let i = 0; i < value; i++) {
    const starSpan = document.createElement('span');
    starSpan.textContent = '⭐'; // ใช้ emoji ดาวปกติ
    starSpan.style.color = '#FFBF00'; // สีทองที่เข้มขึ้น

    // *** จุดที่แก้ไข: เพิ่ม text-shadow สำหรับขอบสีดำของดาว ***
    starSpan.style.textShadow = '0 0 2px black, 0 0 2px black, 0 0 2px black, 0 0 2px black';
    // '0 0 2px black' สร้างเงาขนาด 2px ไม่มี offset
    // การใส่ซ้ำๆ จะทำให้เงาดูหนาขึ้น (เหมือนเส้นขอบ)
    // คุณสามารถปรับขนาด 2px และจำนวนครั้งที่ใส่ซ้ำได้ตามความชอบ
    // *******************************************************

    starSpan.style.fontSize = '1.3em'; // Smaller stars for fitting
    starSpan.style.margin = '2px'; // Small margin between stars
    starSpan.style.lineHeight = '1em'; // Helps vertical alignment of emoji

    // Arrangement logic for different star counts
    if (value === 1) {
        starSpan.style.flexBasis = '100%';
    } else if (value === 2) {
        starSpan.style.flexBasis = '45%';
    } else if (value === 3) {
        starSpan.style.flexBasis = '30%';
    } else if (value === 4) {
        starSpan.style.flexBasis = '45%';
    } else if (value === 5) {
        if (i < 3) {
            starSpan.style.flexBasis = '30%';
        } else {
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
  back.style.display = 'flex';
  back.style.alignItems = 'center';
  back.style.justifyContent = 'center';
  back.style.backgroundColor = '#667eea';
  back.style.border = '2px solid #667eea';
  back.style.borderRadius = '8px';
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
        closeMinigame2();
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
  if (!gridDiv) return;
  gridDiv.innerHTML = '';
  cards_mg2.forEach(value => {
    gridDiv.appendChild(createCard_mg2(value));
  });
}

// Create the modal for minigame2
function createModal_mg2() {
  let modal = document.getElementById('minigame-modal');
  if (modal) {
    modal.remove();
  }

  modal = document.createElement('div');
  modal.id = 'minigame-modal';
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
  gridDiv.style.gridTemplateColumns = 'repeat(5, 90px)';
  gridDiv.style.justifyContent = 'center';
  gridDiv.style.gap = '15px';
  content.appendChild(gridDiv);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.onclick = closeMinigame2;
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