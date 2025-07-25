// minigame4.js - Keep the Sum Between 1 and 20 Game (Popup Version)
// This minigame challenges the player to keep a running total score
// within a specified range (1 to 20) by choosing positive or negative cards.

function showMinigame4(switchId, onSuccessCallback) {
    // --- Game Configuration ---
    const MIN_SCORE_LIMIT = 1;
    const MAX_SCORE_LIMIT = 20;
    const TOTAL_UNIQUE_CARDS = 14; // Total cards available in the game pool
    const CARDS_TO_SHOW_PER_TURN = 2; // Number of cards shown to player at a time (2 cards)
    
    // Initial score for player (random between 1 and 19)
    let currentScore = Math.floor(Math.random() * 19) + 1; // Random number from 1 to 19

    // --- Game State Variables ---
    let cardsInPlayPool = []; // All unique cards that haven't been permanently removed from the game
    let cardsUsedTotal = 0;   // Count of cards that have been chosen by the player (out of 14)
    let currentlyDisplayedCardsValues = []; // The values of the 2 cards currently shown to the player
    let cardElements = []; // References to the 2 card divs displayed on screen (static elements)
    let cardsClickedInCurrentSet = 0; // Tracks how many cards in the *current set of 2* have been clicked
    let isGameActive = true; // Control game flow

    // --- Create Popup Container (NO CHANGES HERE) ---
    const popup = document.createElement('div');
    popup.id = 'minigame-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = 'rgba(255, 255, 255, 0.98)';
    popup.style.padding = '25px';
    popup.style.borderRadius = '15px';
    popup.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)';
    popup.style.zIndex = '1000';
    popup.style.textAlign = 'center';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.alignItems = 'center';
    popup.style.gap = '15px';
    popup.style.maxWidth = '600px';
    popup.style.width = '90%';
    popup.style.fontFamily = 'Inter, sans-serif';
    popup.style.color = '#333';

    // --- Close Button (NO CHANGES HERE) ---
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.8em';
    closeBtn.style.color = '#555';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.lineHeight = '1';
    closeBtn.style.padding = '5px';
    function _closeConfirmationHandler() {
        if (confirm('Are you sure you want to quit this minigame? Your progress will be lost.')) {
            closeMinigame4();
        }
    }
    closeBtn.addEventListener('click', _closeConfirmationHandler);
    popup.appendChild(closeBtn);

    // --- Title (NO CHANGES HERE) ---
    const title = document.createElement('h3');
    title.textContent = 'Card Sum Challenge';
    title.style.fontSize = '1.8em';
    title.style.margin = '0 0 10px 0';
    title.style.color = '#4a4a4a';
    popup.appendChild(title);

    // --- Instruction Text (CHANGED TO REFLECT 1-20) ---
    const instructionText = document.createElement('p');
    instructionText.textContent = `Keep the sum between ${MIN_SCORE_LIMIT} and ${MAX_SCORE_LIMIT} to win!`;
    instructionText.style.fontSize = '1.1em';
    instructionText.style.fontWeight = 'bold';
    instructionText.style.color = '#333';
    instructionText.style.marginBottom = '10px';
    popup.appendChild(instructionText);

    // --- Cards Used Display (NO CHANGES HERE) ---
    const cardsUsedDisplay = document.createElement('p');
    cardsUsedDisplay.style.fontSize = '1em';
    cardsUsedDisplay.style.color = '#555';
    cardsUsedDisplay.textContent = `Cards Used: ${cardsUsedTotal}/${TOTAL_UNIQUE_CARDS}`;
    popup.appendChild(cardsUsedDisplay);

    // --- Playable Cards Area (for 2 cards) (NO CHANGES HERE, just logic) ---
    const cardsArea = document.createElement('div');
    cardsArea.style.display = 'flex';
    cardsArea.style.justifyContent = 'center';
    cardsArea.style.gap = '20px';
    cardsArea.style.margin = '10px auto';
    cardsArea.style.width = '100%';
    cardsArea.style.maxWidth = '300px';
    popup.appendChild(cardsArea);
    
    // Create the two card slots (DOM elements) (NO CHANGES HERE)
    for(let i = 0; i < CARDS_TO_SHOW_PER_TURN; i++) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card playable-card';
        cardDiv.style.width = '120px';
        cardDiv.style.height = '180px';
        cardDiv.style.borderRadius = '15px';
        cardDiv.style.display = 'flex';
        cardDiv.style.alignItems = 'center';
        cardDiv.style.justifyContent = 'center';
        cardDiv.style.fontSize = '3em';
        cardDiv.style.fontWeight = 'bold';
        cardDiv.style.cursor = 'pointer';
        cardDiv.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
        cardDiv.style.transition = 'transform 0.1s ease-out, opacity 0.3s ease-out, background-color 0.1s ease-out';
        cardDiv.dataset.slotIndex = i;
        cardDiv.textContent = ' ';
        cardsArea.appendChild(cardDiv);
        cardElements.push(cardDiv);
    }
    
    // --- Current Score Display (NO CHANGES HERE) ---
    const scoreText = document.createElement('div');
    scoreText.textContent = `${currentScore}`;
    scoreText.style.fontSize = '3.5em';
    scoreText.style.fontWeight = 'bold';
    scoreText.style.color = '#000';
    scoreText.style.textShadow = '1px 1px 2px rgba(0,0,0,0.2)';
    scoreText.style.marginTop = '15px';
    popup.appendChild(scoreText);

    // --- Range Display (1 --- 20) (CHANGED TO REFLECT 1-20) ---
    const rangeDisplay = document.createElement('div');
    rangeDisplay.style.width = '90%';
    rangeDisplay.style.maxWidth = '350px';
    rangeDisplay.style.height = '25px';
    rangeDisplay.style.position = 'relative';
    rangeDisplay.style.marginTop = '10px';
    popup.appendChild(rangeDisplay);

    const rangeBar = document.createElement('div');
    rangeBar.style.position = 'absolute';
    rangeBar.style.width = '100%';
    rangeBar.style.height = '100%';
    rangeBar.style.border = '2px dashed #999';
    rangeBar.style.borderRadius = '12px';
    rangeBar.style.boxSizing = 'border-box';
    rangeDisplay.appendChild(rangeBar);

    const scoreMarker = document.createElement('div');
    scoreMarker.style.position = 'absolute';
    scoreMarker.style.width = '18px';
    scoreMarker.style.height = '18px';
    scoreMarker.style.background = '#4CAF50';
    scoreMarker.style.borderRadius = '50%';
    scoreMarker.style.left = '50%';
    scoreMarker.style.top = '50%';
    scoreMarker.style.transform = 'translate(-50%, -50%)';
    rangeDisplay.appendChild(scoreMarker);

    const lowerLimitLabel = document.createElement('span');
    lowerLimitLabel.textContent = `${MIN_SCORE_LIMIT}`;
    lowerLimitLabel.style.position = 'absolute';
    lowerLimitLabel.style.left = '0';
    lowerLimitLabel.style.bottom = '-20px';
    lowerLimitLabel.style.fontSize = '0.9em';
    lowerLimitLabel.style.fontWeight = 'bold';
    lowerLimitLabel.style.color = '#F44336';
    rangeDisplay.appendChild(lowerLimitLabel);

    const upperLimitLabel = document.createElement('span');
    upperLimitLabel.textContent = `${MAX_SCORE_LIMIT}`;
    upperLimitLabel.style.position = 'absolute';
    upperLimitLabel.style.right = '0';
    upperLimitLabel.style.bottom = '-20px';
    upperLimitLabel.style.fontSize = '0.9em';
    upperLimitLabel.style.fontWeight = 'bold';
    upperLimitLabel.style.color = '#F44336';
    rangeDisplay.appendChild(upperLimitLabel);

    document.body.appendChild(popup);

    // --- Game Functions ---
    // Generates values for the initial 14 cards (7 positive, 7 negative, unique values 1-7)
    function generateInitialCardPool() {
        let pool = [];
        let magnitudes = [1, 2, 3, 4, 5, 6, 7]; // Use 1-7 for balanced values

        // Create 7 positive and 7 negative cards
        let positiveCards = [...magnitudes]; // 1, 2, 3, 4, 5, 6, 7
        let negativeCards = magnitudes.map(val => -val); // -1, -2, -3, -4, -5, -6, -7

        // Combine positive and negative cards
        pool = [...positiveCards, ...negativeCards];

        // Shuffle the pool to mix positive and negative values
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        
        console.log("Generated Card Pool (14 balanced cards):", pool); // For debugging
        return pool;
    }

    // Draws CARDS_TO_SHOW_PER_TURN (2) cards from the pool onto the display area
    function drawCardsForTurn() {
        // If no more cards left in the original pool to draw a new set of 2, then it's game over.
        if (cardsInPlayPool.length < CARDS_TO_SHOW_PER_TURN) {
            // Check if there are any remaining cards to draw (e.g., 1 card left)
            if (cardsInPlayPool.length === 0) {
                   // Game over via card exhaustion. Check final score.
                   if (isGameActive) { // Ensure not already lost by score limit
                     if (currentScore >= MIN_SCORE_LIMIT && currentScore <= MAX_SCORE_LIMIT) {
                         endGame(true); // Win
                     } else {
                         endGame(false); // Lose
                     }
                   }
                   return; // No cards to display, exit
            }
            // If some cards are left but less than CARDS_TO_SHOW_PER_TURN (e.g., 1 card left for a 2-card draw)
            // This is the very last turn, draw whatever is left
            currentlyDisplayedCardsValues = [...cardsInPlayPool]; // Take all remaining cards
        } else {
            // --- MODIFICATION START ---
            let positiveCards = cardsInPlayPool.filter(card => card > 0);
            let negativeCards = cardsInPlayPool.filter(card => card < 0);
            currentlyDisplayedCardsValues = [];

            // Ensure we can draw one positive and one negative card
            if (positiveCards.length > 0 && negativeCards.length > 0) {
                // Pick one random positive card
                const randomPositiveIndex = Math.floor(Math.random() * positiveCards.length);
                const positiveCard = positiveCards[randomPositiveIndex];
                currentlyDisplayedCardsValues.push(positiveCard);

                // Pick one random negative card
                const randomNegativeIndex = Math.floor(Math.random() * negativeCards.length);
                const negativeCard = negativeCards[randomNegativeIndex];
                currentlyDisplayedCardsValues.push(negativeCard);

                // Shuffle the order of the two selected cards so they don't always appear in the same slot
                for (let i = currentlyDisplayedCardsValues.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [currentlyDisplayedCardsValues[i], currentlyDisplayedCardsValues[j]] = [currentlyDisplayedCardsValues[j], currentlyDisplayedCardsValues[i]];
                }
            } else {
                // Fallback: If we can't get one positive and one negative (e.g., only positives left),
                // then draw any two cards. This case should only happen very late in the game if
                // the initial pool logic and card removal works as expected to keep balance.
                // For a robust game, you might want to adjust `generateInitialCardPool` or
                // `handleCardClick` to ensure an even distribution or re-shuffle if necessary.
                // For now, it will simply draw any two remaining cards if the desired combination isn't possible.
                let tempPoolCopy = [...cardsInPlayPool];
                currentlyDisplayedCardsValues = [];
                for (let i = 0; i < CARDS_TO_SHOW_PER_TURN; i++) {
                    if (tempPoolCopy.length > 0) {
                        const randomIndex = Math.floor(Math.random() * tempPoolCopy.length);
                        currentlyDisplayedCardsValues.push(tempPoolCopy[randomIndex]);
                        tempPoolCopy.splice(randomIndex, 1);
                    }
                }
                console.warn("Could not draw one positive and one negative card. Drawing available cards.");
            }
            // --- MODIFICATION END ---
        }

        // Reset click counter for this new set of cards
        cardsClickedInCurrentSet = 0; 
        
        // Now, populate the actual DOM card elements with values and make them visible
        cardElements.forEach((cardDiv, index) => { // Use cardElements directly
            if (currentlyDisplayedCardsValues[index] !== undefined) {
                const value = currentlyDisplayedCardsValues[index];
                cardDiv.textContent = value > 0 ? `+${value}` : `${value}`;
                cardDiv.dataset.value = value;
                cardDiv.style.backgroundColor = value > 0 ? '#2196F3' : '#F44336'; // Blue for positive, Red for negative
                cardDiv.style.color = 'white';
                cardDiv.style.opacity = '1'; // Make visible
                cardDiv.style.pointerEvents = 'auto'; // Enable clicks
                cardDiv.addEventListener('click', handleCardClick); // Attach listener for this card
            } else {
                // Hide unused slots if fewer than CARDS_TO_SHOW_PER_TURN cards left for the very last turn
                cardDiv.style.opacity = '0';
                cardDiv.style.pointerEvents = 'none';
                cardDiv.textContent = '';
                cardDiv.dataset.value = '0';
            }
        });
    }

    // This function is called when a player clicks one of the displayed cards
    function handleCardClick(event) {
        if (!isGameActive) return; // Ensure game is active

        const clickedCardDiv = event.currentTarget; // The card div that was clicked
        const valueChosen = parseInt(clickedCardDiv.dataset.value);
        
        currentScore += valueChosen; // Add chosen card value to score
        
        // Remove the selected card's value from the main `cardsInPlayPool` permanently
        const indexInPoolOfChosen = cardsInPlayPool.indexOf(valueChosen);
        if (indexInPoolOfChosen > -1) {
            cardsInPlayPool.splice(indexInPoolOfChosen, 1); // Remove from the main pool
        } else {
            console.warn(`Chosen card value ${valueChosen} not found in cardsInPlayPool for removal. This should not happen.`);
        }
        
        cardsUsedTotal++; // Increment count of total cards USED by player
        cardsUsedDisplay.textContent = `Cards Used: ${cardsUsedTotal}/${TOTAL_UNIQUE_CARDS}`;

        updateScoreDisplay(); // Check for win/lose after score update
        
        // Visually hide the clicked card and disable it
        clickedCardDiv.style.opacity = '0'; // Fade out
        clickedCardDiv.style.pointerEvents = 'none'; // Disable further clicks on this specific card
        clickedCardDiv.removeEventListener('click', handleCardClick); // Remove its listener

        cardsClickedInCurrentSet++; // Increment counter for clicks in this 2-card set

        // Check if all cards in the current set (2 or less for final turn) have been clicked
        if (cardsClickedInCurrentSet === currentlyDisplayedCardsValues.length) {
            // All cards in this set have been processed (clicked).
            // Now, draw the next set of cards (after a short delay for visual effect).
            
            // Wait briefly before drawing new cards for the next turn
            setTimeout(() => {
                if (isGameActive) { // Only draw next turn if game is still active (not ended by score)
                    drawCardsForTurn();
                }
            }, 300); // Small delay for visual effect
        }
        // If not all cards in the current set have been clicked, the game simply waits for the next click on the remaining cards.
    }

    function updateScoreDisplay() {
        scoreText.textContent = `${currentScore}`;
        // Update marker position on the range bar
        const rangeWidth = rangeBar.offsetWidth;
        const scoreRange = MAX_SCORE_LIMIT - MIN_SCORE_LIMIT;
        let normalizedScore = (currentScore - MIN_SCORE_LIMIT) / scoreRange;
        let markerLeft = normalizedScore * rangeWidth;

        markerLeft = Math.max(0, Math.min(rangeWidth, markerLeft)); // Clamp within bounds
        scoreMarker.style.left = `${markerLeft}px`;

        // Change marker color and check for game over
        if (currentScore < MIN_SCORE_LIMIT || currentScore > MAX_SCORE_LIMIT) {
            scoreMarker.style.background = '#F44336'; // Red if out of bounds
            endGame(false); // Player loses immediately
        } else {
            scoreMarker.style.background = '#4CAF50'; // Green if in bounds
        }
    }

    function endGame(hasWon) {
        if (!isGameActive) return; // Prevent multiple calls
        isGameActive = false;

        // Disable all card interactions
        cardElements.forEach(card => card.style.pointerEvents = 'none');

        let message = '';
        let messageColor = '';
        if (hasWon) {
            message = `VICTORY! Your final score is ${currentScore}.`;
            messageColor = '#4CAF50'; // Green
        } else {
            message = `DEFEAT! Your final score is ${currentScore}.`;
            messageColor = '#F44336'; // Red
        }

        instructionText.textContent = message;
        instructionText.style.color = messageColor;
        instructionText.style.fontSize = '1.4em'; // Make it stand out

        setTimeout(() => {
            alert(message);
            closeMinigame4(); // Close the minigame popup
            if (onSuccessCallback && hasWon) { // Only call onSuccess if player won
                onSuccessCallback(switchId);
            }
        }, 1500); // Small delay before alert and closing
    }

    function resetGame() {
        currentScore = Math.floor(Math.random() * 19) + 1; // Random number from 1 to 19
        cardsInPlayPool = generateInitialCardPool(); // Generate all 14 cards once
        cardsUsedTotal = 0;
        isGameActive = true;
        
        instructionText.textContent = `Keep the sum between ${MIN_SCORE_LIMIT} and ${MAX_SCORE_LIMIT} to win!`;
        instructionText.style.color = '#333';
        instructionText.style.fontSize = '1.1em';

        updateScoreDisplay(); // Update score display based on new currentScore
        cardsUsedDisplay.textContent = `Cards Used: ${cardsUsedTotal}/${TOTAL_UNIQUE_CARDS}`;
        drawCardsForTurn(); // Draw the first 2 cards
    }

    // --- Initial Setup Call ---
    resetGame(); // Call reset to set up initial game state

    // --- Cleanup function for when minigame closes ---
    function closeMinigame4() {
        isGameActive = false; // Ensure game logic stops
        closeBtn.removeEventListener('click', _closeConfirmationHandler); // Remove close button listener

        // Remove listeners from currently displayed card elements
        cardElements.forEach(card => {
            card.removeEventListener('click', handleCardClick); // Remove the specific handler
            // Reset their state for next potential game.
            card.style.opacity = '0';
            card.style.pointerEvents = 'none';
        });
        
        // Remove the entire popup from the DOM
        if (document.body.contains(popup)) {
            document.body.removeChild(popup);
        }
    }
}