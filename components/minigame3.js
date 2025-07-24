// minigame3.js
// This script creates a popup minigame for pulling a sword from the stone using the provided image.
// The sword design is based on the uploaded pixel art image.
// Presses on 'X' pull it out gradually, filling a progress bar, with resistance pushing back. When full, show success message and close.

function showMinigame3(onSuccessCallback) {
  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'minigame-popup';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.background = 'rgba(255, 255, 255, 0.9)';
  popup.style.padding = '20px';
  popup.style.borderRadius = '10px';
  popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  popup.style.zIndex = '1000';
  popup.style.textAlign = 'center';

  // Canvas for the game scene
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  canvas.style.cursor = 'pointer';
  popup.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Load the sword in stone image
  const img = new Image();
  img.src = '/assets/sword_in_stone.png'; // Adjust path as needed
  img.onload = function() {
    drawScene(); // Initial draw after image loads
  };

  // Progress bar
  const progressContainer = document.createElement('div');
  progressContainer.style.width = '200px';
  progressContainer.style.height = '10px';
  progressContainer.style.background = '#ccc';
  progressContainer.style.marginTop = '10px';
  progressContainer.style.borderRadius = '5px';
  const progressFill = document.createElement('div');
  progressFill.style.height = '100%';
  progressFill.style.width = '0%';
  progressFill.style.background = 'linear-gradient(to right, #4caf50, #8bc34a)';
  progressFill.style.borderRadius = '5px';
  progressContainer.appendChild(progressFill);
  popup.appendChild(progressContainer);

  // Instruction text
  const instruction = document.createElement('p');
  instruction.textContent = 'Press X rapidly to pull the sword out!';
  instruction.style.fontFamily = 'Arial, sans-serif';
  instruction.style.fontSize = '14px';
  instruction.style.margin = '10px 0 0';
  popup.appendChild(instruction);

  // Game variables
  let progress = 0;
  const maxProgress = 100; // Increased for smoother experience with key presses
  let swordY = 0; // Sword pull offset (negative to pull up)
  const maxPull = 100; // Max pixels to pull the sword up
  let pushBackInterval;

  // Draw the scene function
  function drawScene(showSuccess = false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showSuccess) {
      // Draw the base image with the sword moving upward
      ctx.drawImage(img, 0, swordY, 200, 200, 0, 0, 200, 200);
    } else {
      // Success state: Show the sword fully pulled (simulate by shifting image up and adding text)
      ctx.drawImage(img, 0, -maxPull, 200, 200, 0, 0, 200, 200); // Adjust offset to show sword out
      ctx.fillStyle = '#0000FF'; // Blue
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Congratulations!', 20, 80);
      ctx.fillText('You pulled the sword', 20, 100);
      ctx.fillText('from the stone!', 20, 120);
    }

    // Update progress bar
    progressFill.style.width = `${(progress / maxProgress) * 100}%`;
  }

  // Key press event for 'X'
  function handleKeyDown(event) {
    if (event.key.toUpperCase() === 'X') {
      if (progress < maxProgress) {
        progress += 2; // Increase per press (adjust for difficulty)
        if (progress > maxProgress) progress = maxProgress;
        swordY = - (progress / maxProgress) * maxPull;
        drawScene();
        checkWin();
      }
    }
  }

  // Push back mechanism
  pushBackInterval = setInterval(() => {
    if (progress > 0 && progress < maxProgress) {
      progress -= 1; // Decrease per interval (adjust for difficulty)
      if (progress < 0) progress = 0;
      swordY = - (progress / maxProgress) * maxPull;
      drawScene();
    }
  }, 100); // Every 100ms (adjust speed)

  // Check if won
  function checkWin() {
    if (progress >= maxProgress) {
      clearInterval(pushBackInterval);
      instruction.textContent = 'Success!';
      drawScene(true); // Show success state
      setTimeout(() => {
        closeMinigame();
        if (onSuccessCallback) onSuccessCallback();
      }, 3000); // Close after 3 seconds
      document.removeEventListener('keydown', handleKeyDown);
    }
  }

  // Add keydown listener
  document.addEventListener('keydown', handleKeyDown);

  // Cleanup function
  function closeMinigame() {
    clearInterval(pushBackInterval);
    document.removeEventListener('keydown', handleKeyDown);
    document.body.removeChild(popup);
  }

  // Append to body
  document.body.appendChild(popup);
}

// Export or call as needed, e.g., in main game: showMinigame3(() => { /* activate switch */ });