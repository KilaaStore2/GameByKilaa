/*
   Created By Ruzx
   Contact : https://wa.me/6288980698613
   Channel : https://whatsapp.com/channel/0029VbARtDPGpLHPdJIvI73a

   Mau pakai tapi tidak bisa? tonton video cara deploy code dengan gratis di youtube admin
   https://youtube.com/@zxruzx
   
   Menerima jasa bikin website seperti portofolio, store, dll ( Use HTML, CSS, JS )
   Langsung saja chat contact admin.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Game state
    let cards = [];
    let flippedIndexes = [];
    let matches = 0;
    let isChecking = false;
    const totalPairs = 6;

    // DOM elements
    const cardsGrid = document.getElementById('cards-grid');
    const matchesCounter = document.getElementById('matches-counter');
    const resetButton = document.getElementById('reset-button');
    const toast = document.getElementById('toast');

    // Icon configurations
    const iconConfigs = [
        { name: 'heart', color: '#fb7185' },
        { name: 'star', color: '#fbbf24' },
        { name: 'sun', color: '#facc15' },
        { name: 'moon', color: '#c084fc' },
        { name: 'cloud', color: '#38bdf8' },
        { name: 'flower-2', color: '#34d399' }
    ];

    // Create and shuffle cards
    function createCards() {
        cards = [];
        
        iconConfigs.forEach((config, index) => {
            cards.push(
                { id: index * 2, iconName: config.name, color: config.color, isMatched: false },
                { id: index * 2 + 1, iconName: config.name, color: config.color, isMatched: false }
            );
        });
        
        // Shuffle cards
        cards.sort(() => Math.random() - 0.5);
        
        // Reset game state
        flippedIndexes = [];
        matches = 0;
        isChecking = false;
        
        // Update UI
        updateMatchesCounter();
        renderCards();
    }

    // Render cards to the grid
    function renderCards() {
        cardsGrid.innerHTML = '';
        
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.isMatched ? 'matched' : ''}`;
            cardElement.dataset.index = index;
            
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back">
                        <i data-lucide="${card.iconName}" class="card-icon" style="color: ${card.color}"></i>
                    </div>
                </div>
            `;
            
            cardElement.addEventListener('click', () => handleCardClick(index));
            cardsGrid.appendChild(cardElement);
        });
        
        // Initialize icons in the newly created elements
        lucide.createIcons();
    }

    // Update the matches counter
    function updateMatchesCounter() {
        matchesCounter.textContent = `Matches found: ${matches} of ${totalPairs}`;
    }

    // Handle card click
    function handleCardClick(clickedIndex) {
        // Prevent clicking if already checking or card is already matched
        if (isChecking || cards[clickedIndex].isMatched) return;
        // Prevent clicking if card is already flipped
        if (flippedIndexes.includes(clickedIndex)) return;
        // Prevent clicking if two cards are already flipped
        if (flippedIndexes.length === 2) return;

        // Add clicked card to flipped cards
        flippedIndexes.push(clickedIndex);
        
        // Update UI to show flipped card
        const cardElement = document.querySelector(`.card[data-index="${clickedIndex}"]`);
        cardElement.classList.add('flipped');

        // If we now have two cards flipped, check for a match
        if (flippedIndexes.length === 2) {
            isChecking = true;
            const [firstIndex, secondIndex] = flippedIndexes;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard.iconName === secondCard.iconName) {
                // Match found
                setTimeout(() => {
                    // Mark cards as matched
                    cards[firstIndex].isMatched = true;
                    cards[secondIndex].isMatched = true;
                    
                    // Update UI
                    document.querySelector(`.card[data-index="${firstIndex}"]`).classList.add('matched');
                    document.querySelector(`.card[data-index="${secondIndex}"]`).classList.add('matched');
                    
                    // Reset flipped indexes
                    flippedIndexes = [];
                    matches++;
                    updateMatchesCounter();
                    isChecking = false;
                    
                    // Check for game completion
                    if (matches === totalPairs) {
                        showToast();
                    }
                }, 500);
            } else {
                // No match - reset after delay
                setTimeout(() => {
                    // Flip cards back
                    document.querySelector(`.card[data-index="${firstIndex}"]`).classList.remove('flipped');
                    document.querySelector(`.card[data-index="${secondIndex}"]`).classList.remove('flipped');
                    
                    // Reset flipped indexes
                    flippedIndexes = [];
                    isChecking = false;
                }, 1000);
            }
        }
    }

    // Show congratulations toast
    function showToast() {
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 5000);
    }

    // Reset game
    function resetGame() {
        createCards();
        toast.classList.add('hidden');
    }

    // Event listeners
    resetButton.addEventListener('click', resetGame);

    // Initialize game
    createCards();
});