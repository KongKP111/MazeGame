// minigame1.js - Water Color Sort Puzzle Minigame
// This script creates a modal minigame for color matching puzzle.
// It can be integrated into the main maze game by calling showMinigame1(switchId) when stepping on a switch.

const COLORS_MG1 = ['#FF0000', '#FFFF00', '#00FF00', '#0000FF', '#800080', '#000000']; // Red, Yellow, Green, Blue, Purple, Black

let bottomRow_mg1 = [];
let topRow_mg1 = [];
let currentSwitchId_mg1 = null;
let onSuccessCallback_mg1 = null;
let selectedIndex_mg1 = null; // เก็บตำแหน่งที่เลือกครั้งแรก

// Shuffle function for minigame1
function shuffle_mg1(array) {
  let copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Calculate number of matches for minigame1
function getMatches_mg1() {
  let matches = 0;
  for (let i = 0; i < topRow_mg1.length; i++) {
    if (topRow_mg1[i] === bottomRow_mg1[i]) matches++;
  }
  return matches;
}

// Update the match label for minigame1
function updateLabel_mg1() {
  const label = document.getElementById('match-label');
  if (label) {
    const matches = getMatches_mg1();
    label.textContent = `${matches} colors match their positions!`;
    if (matches === COLORS_MG1.length) {
      label.textContent += ' - You win!';
      setTimeout(() => {
        closeMinigame1(); // Call the specific close function
        if (onSuccessCallback_mg1) onSuccessCallback_mg1(currentSwitchId_mg1);
      }, 1000);
    }
  }
}

// Create bottle element for minigame1
function createBottle_mg1(color, isTop, index) {
  const bottle = document.createElement('div');
  bottle.style.width = '60px';
  bottle.style.height = '120px';
  bottle.style.backgroundColor = isTop ? color : '#808080'; // Gray for bottom
  bottle.style.border = '2px solid #000';
  bottle.style.borderRadius = '10px';
  bottle.style.margin = '10px';
  bottle.style.position = 'relative';
  bottle.style.overflow = 'hidden';
  bottle.style.cursor = 'pointer';
  bottle.style.transition = 'transform 0.3s ease-in-out';
  bottle.style.pointerEvents = 'auto';
  bottle.dataset.index = index;

  // Add liquid effect
  const liquid = document.createElement('div');
  liquid.style.width = '100%';
  liquid.style.height = '80%';
  liquid.style.backgroundColor = isTop ? color : 'transparent';
  liquid.style.position = 'absolute';
  liquid.style.bottom = '0';
  liquid.style.pointerEvents = 'auto';
  bottle.appendChild(liquid);

  return bottle;
}

// Handle click event for minigame1
function handleClick_mg1(e) {
  const bottle = e.target.closest('[data-index]');
  if (!bottle) return;
  const index = parseInt(bottle.dataset.index);

  if (selectedIndex_mg1 === null) {
    // เลือกสีแรก
    selectedIndex_mg1 = index;
    bottle.style.transform = 'scale(1.1)';
    bottle.style.borderColor = '#00ff00';
  } else if (selectedIndex_mg1 !== index) {
    // สลับตำแหน่งเมื่อคลิกสีที่สอง
    [topRow_mg1[selectedIndex_mg1], topRow_mg1[index]] = [topRow_mg1[index], topRow_mg1[selectedIndex_mg1]];
    drawRows_mg1(); // อัปเดต UI
    updateLabel_mg1();

    // รีเซ็ตการเลือก
    const prevSelected = document.querySelector(`[data-index="${selectedIndex_mg1}"]`);
    if (prevSelected) {
      prevSelected.style.transform = 'scale(1)';
      prevSelected.style.borderColor = '#000';
    }
    selectedIndex_mg1 = null;
  } else {
    // คลิกซ้ำที่สีเดิม รีเซ็ตการเลือก
    bottle.style.transform = 'scale(1)';
    bottle.style.borderColor = '#000';
    selectedIndex_mg1 = null;
  }
}

// Draw the rows for minigame1
function drawRows_mg1() {
  const topRowDiv = document.getElementById('top-row');
  const bottomRowDiv = document.getElementById('bottom-row');
  if (!topRowDiv || !bottomRowDiv) return;

  topRowDiv.innerHTML = '';
  topRow_mg1.forEach((color, index) => {
    const bottle = createBottle_mg1(color, true, index);
    topRowDiv.appendChild(bottle);
  });

  bottomRowDiv.innerHTML = '';
  bottomRow_mg1.forEach((color, index) => {
    bottomRowDiv.appendChild(createBottle_mg1(color, false, index));
  });

  // Add event listener with event delegation
  // Remove existing listener to prevent duplicates if drawRows_mg1 is called multiple times
  topRowDiv.removeEventListener('click', handleClick_mg1);
  topRowDiv.addEventListener('click', handleClick_mg1);
}

// Create the modal for minigame1
function createModal_mg1() {
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
  title.textContent = 'Color Match Puzzle';
  content.appendChild(title);

  const desc = document.createElement('p');
  desc.textContent = 'Click two bottles to swap them and match the hidden bottom row. The label shows how many are correct.';
  content.appendChild(desc);

  const topRowDiv = document.createElement('div');
  topRowDiv.id = 'top-row';
  topRowDiv.style.display = 'flex';
  topRowDiv.style.justifyContent = 'center';
  topRowDiv.classList.add('row'); // Add class for common styling
  content.appendChild(topRowDiv);

  const bottomRowDiv = document.createElement('div');
  bottomRowDiv.id = 'bottom-row';
  bottomRowDiv.style.display = 'flex';
  bottomRowDiv.style.justifyContent = 'center';
  bottomRowDiv.classList.add('row'); // Add class for common styling
  content.appendChild(bottomRowDiv);

  const label = document.createElement('p');
  label.id = 'match-label';
  label.style.fontSize = '1.2em';
  label.style.marginTop = '20px';
  content.appendChild(label);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.onclick = closeMinigame1; // Call the specific close function
  content.appendChild(closeBtn);

  modal.appendChild(content);
  document.body.appendChild(modal);
}

// Show the minigame (GLOBAL FUNCTION)
function showMinigame1(switchId, callback) {
  currentSwitchId_mg1 = switchId;
  onSuccessCallback_mg1 = callback;
  bottomRow_mg1 = shuffle_mg1(COLORS_MG1);
  topRow_mg1 = shuffle_mg1(COLORS_MG1);
  createModal_mg1();
  drawRows_mg1();
  updateLabel_mg1();
}

// Close the minigame (GLOBAL FUNCTION)
function closeMinigame1() {
  const modal = document.getElementById('minigame-modal');
  if (modal) modal.remove();
  selectedIndex_mg1 = null;
}