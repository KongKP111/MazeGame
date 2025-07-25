/**
 * Minigame 3: Path Puzzle
 * The user must draw a single continuous line connecting all 25 dots from start to finish.
 * MODIFIED: The path is no longer fixed. Any path that covers all dots from start to end is valid.
 */
function showMinigame3(switchId, successCallback) {
    // --- Game Configuration ---
    const GRID_SIZE = 5;
    const TOTAL_DOTS = GRID_SIZE * GRID_SIZE;

    // The predefined correct path has been removed.
    // We only need to define the start and end points now.
    const START_NODE = { r: 4, c: 0 }; // Bottom-left
    const END_NODE = { r: 0, c: 4 };   // Top-right

    let userPath = [];
    let isDrawing = false;
    let canvas, ctx;
    let dotRadius, dotSpacing;

    // --- UI Creation ---
    function createPopup() {
        const popup = document.createElement('div');
        popup.id = 'minigame-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        popup.style.padding = '30px';
        popup.style.borderRadius = '15px';
        popup.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        popup.style.zIndex = '1001';
        popup.style.textAlign = 'center';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.alignItems = 'center';
        popup.style.gap = '15px';
        popup.style.fontFamily = "'Inter', sans-serif";

        // --- ADDED: Close Button ---
        const closeButton = document.createElement('button');
        closeButton.textContent = '×'; // Using the 'times' character for the 'X'
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '15px';
        closeButton.style.background = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '28px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.color = '#888';
        closeButton.style.cursor = 'pointer';
        closeButton.style.lineHeight = '1';
        closeButton.onclick = closePopup; // Assign the existing close function
        // --- END: Close Button ---

        const title = document.createElement('h2');
        title.textContent = '🧩 Minigame: Path Puzzle';
        title.style.margin = '0';
        title.style.color = '#333';

        const instructions = document.createElement('p');
        instructions.id = 'minigame-status';
        instructions.textContent = 'ลากเส้นจากจุดเริ่มต้น (🟢) ผ่านทุกจุดไปยังทางออก (🔴)';
        instructions.style.margin = '0';
        instructions.style.color = '#555';
        instructions.style.fontWeight = '500';

        canvas = document.createElement('canvas');
        const canvasSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.6, 400);
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        canvas.style.border = '2px solid #667eea';
        canvas.style.borderRadius = '10px';
        canvas.style.cursor = 'pointer';
        
        popup.appendChild(closeButton); // Add the button to the popup
        popup.appendChild(title);
        popup.appendChild(instructions);
        popup.appendChild(canvas);
        document.body.appendChild(popup);

        ctx = canvas.getContext('2d');
        calculateMetrics();
        addEventListeners();
        drawBoard();
    }

    function closePopup() {
        const popup = document.getElementById('minigame-popup');
        if (popup) {
            removeEventListeners();
            popup.remove();
        }
    }

    // --- Drawing Logic ---
    function calculateMetrics() {
        dotSpacing = canvas.width / (GRID_SIZE + 1);
        dotRadius = dotSpacing * 0.15;
    }

    function getNodePixel(r, c) {
        const x = dotSpacing * (c + 1);
        const y = dotSpacing * (r + 1);
        return { x, y };
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw all dots
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const pos = getNodePixel(r, c);
                const isVisited = userPath.some(p => p.r === r && p.c === c);

                ctx.beginPath();
                ctx.arc(pos.x, pos.y, dotRadius, 0, 2 * Math.PI);
                ctx.fillStyle = isVisited ? '#667eea' : '#cccccc'; // Highlight visited dots
                ctx.fill();
            }
        }
        
        // Draw Start and End nodes distinctly
        const startPos = getNodePixel(START_NODE.r, START_NODE.c);
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, dotRadius * 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#2ecc71'; // Green for start
        ctx.fill();

        const endPos = getNodePixel(END_NODE.r, END_NODE.c);
        ctx.beginPath();
        ctx.arc(endPos.x, endPos.y, dotRadius * 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#e74c3c'; // Red for end
        ctx.fill();
        
        // Draw user's path
        if (userPath.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = dotRadius;
            const firstPos = getNodePixel(userPath[0].r, userPath[0].c);
            ctx.moveTo(firstPos.x, firstPos.y);
            for (let i = 1; i < userPath.length; i++) {
                const pos = getNodePixel(userPath[i].r, userPath[i].c);
                ctx.lineTo(pos.x, pos.y);
            }
            ctx.stroke();
        }
    }

    // --- Game Logic ---
    function getMouseNode(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const pos = getNodePixel(r, c);
                const distance = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
                if (distance < dotSpacing / 2) {
                    return { r, c };
                }
            }
        }
        return null;
    }

    function handleMouseDown(event) {
        const node = getMouseNode(event);
        if (node && node.r === START_NODE.r && node.c === START_NODE.c) {
            isDrawing = true;
            userPath = [node];
            document.getElementById('minigame-status').textContent = 'ลากเส้นต่อไปให้ครบทุกจุด...';
            drawBoard();
        }
    }

    function handleMouseMove(event) {
        if (!isDrawing) return;

        const node = getMouseNode(event);
        if (node) {
            const lastNode = userPath[userPath.length - 1];
            // Check if it's an adjacent, unvisited node
            const isAdjacent = Math.abs(node.r - lastNode.r) + Math.abs(node.c - lastNode.c) === 1;
            const isVisited = userPath.some(p => p.r === node.r && p.c === node.c);

            if (isAdjacent && !isVisited) {
                userPath.push(node);
                drawBoard();
            }
        }
    }

    function handleMouseUp() {
        if (!isDrawing) return;
        isDrawing = false;
        
        const lastNode = userPath[userPath.length - 1];
        const isAtEnd = lastNode.r === END_NODE.r && lastNode.c === END_NODE.c;
        const hasAllDots = userPath.length === TOTAL_DOTS;

        // **MODIFIED LOGIC**
        // The check is now much simpler. If the user's path ends on the correct node AND
        // they have visited every single dot, they win. The drawing logic already
        // prevents invalid moves (re-visiting dots, non-adjacent moves).
        if (isAtEnd && hasAllDots) {
            document.getElementById('minigame-status').textContent = 'สำเร็จ! ปลดล็อกประตูแล้ว! 🎉';
            setTimeout(() => {
                closePopup();
                successCallback(switchId);
            }, 1500);
        } else {
            // This handles failure cases: not ending at the goal, or not visiting all dots.
            failAndReset();
        }
    }
    
    function failAndReset() {
        const status = document.getElementById('minigame-status');
        status.textContent = 'เส้นทางไม่ถูกต้อง! ลองใหม่อีกครั้ง';
        status.style.color = 'red';
        setTimeout(() => {
            userPath = [];
            status.textContent = 'ลากเส้นจากจุดเริ่มต้น (🟢) ผ่านทุกจุดไปยังทางออก (🔴)';
            status.style.color = '#555';
            drawBoard();
        }, 1500);
    }

    function addEventListeners() {
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp); // Listen on document to catch mouseup outside canvas
    }
    
    function removeEventListeners() {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
    
    // --- Start the game ---
    createPopup();
}