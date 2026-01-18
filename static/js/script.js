document.addEventListener('DOMContentLoaded', () => {
    let currentWord = '';
    let currentScrambled = '';
    let hints = {
        definition: '',
        synonyms: [],
        antonyms: []
    };
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;

    const scrambledWordEl = document.getElementById('scrambled-word');
    const userInput = document.getElementById('user-input');
    const checkBtn = document.getElementById('check-btn');
    const hintBtn = document.getElementById('hint-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const hintContainer = document.getElementById('hint-container');
    const hintText = document.getElementById('hint-text');
    const messageEl = document.getElementById('message');
    const scoreEl = document.getElementById('score');
    const bestScoreEl = document.getElementById('best-score');
    const tabBtns = document.querySelectorAll('.tab-btn');

    bestScoreEl.textContent = bestScore;

    function scrambleWord(word) {
        let charList = word.split('');
        for (let i = charList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [charList[i], charList[j]] = [charList[j], charList[i]];
        }
        // Ensure the word is actually scrambled
        const scrambled = charList.join('');
        if (scrambled === word && word.length > 1) {
            return scrambleWord(word);
        }
        return scrambled;
    }

    // API Key is now loaded from static/js/config.js (which is gitignored)

    // 1. Function to fetch a random word using Wordnik
    async function fetchRandomWord() {
        try {
            // minCorpusCount checks usage frequency. minLength=4 to avoid too short words.
            const response = await fetch(
                `https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=8000&maxCorpusCount=-1&minDictionaryCount=3&maxDictionaryCount=-1&minLength=5&maxLength=10&api_key=${WORDNIK_API_KEY}`
            );

            if (response.status === 429) throw new Error('Rate Limit Exceeded');
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            return data.word.toLowerCase();
        } catch (error) {
            console.error('Error fetching random word:', error);
            const fallbackWords = ['puzzle', 'mystery', 'journey', 'galaxy', 'lantern', 'cactus', 'garden', 'ocean'];
            return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
        }
    }

    // 2. Function to get definition using Wordnik
    async function getDefinition(word) {
        try {
            // useCanonical=true helps find definitions for plurals/inflected forms
            const response = await fetch(
                `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=5&includeRelated=false&useCanonical=true&includeTags=false&api_key=${WORDNIK_API_KEY}`
            );

            if (response.status === 429) return 'Definition unavailable (Rate Limit)';
            if (!response.ok) return 'Definition not available.';

            const definitions = await response.json();
            if (definitions && definitions.length > 0) {
                const validDef = definitions.find(d => d.text);
                return validDef ? validDef.text : 'Definition not available.';
            }
            return 'Definition not available.';
        } catch (error) {
            console.error('Error fetching definition:', error);
            return 'Definition not available.';
        }
    }

    // 3. Helper to get related words (synonyms/antonyms)
    async function getRelatedWords(word, type) {
        try {
            // useCanonical=true to match root words (e.g., "cats" -> "cat")
            const response = await fetch(
                `https://api.wordnik.com/v4/word.json/${word}/relatedWords?useCanonical=true&relationshipTypes=${type}&limitPerRelationshipType=10&api_key=${WORDNIK_API_KEY}`
            );

            if (response.status === 429) return ['Rate Limit Reached'];
            if (!response.ok) return [];

            const data = await response.json();
            const relation = data.find(item => item.relationshipType === type);
            return relation ? relation.words : [];
        } catch (error) {
            return [];
        }
    }

    // Main function to get all data at once
    async function getWordData() {
        console.log('Fetching word data...');
        const word = await fetchRandomWord();
        console.log(`Random word: ${word}`);

        // Fetch hints in parallel
        const results = await Promise.allSettled([
            getDefinition(word),
            getRelatedWords(word, 'synonym'),
            getRelatedWords(word, 'antonym')
        ]);

        return {
            word,
            description: results[0].status === 'fulfilled' ? results[0].value : 'Definition unavailable.',
            synonyms: results[1].status === 'fulfilled' ? results[1].value.slice(0, 5) : [],
            antonyms: results[2].status === 'fulfilled' ? results[2].value.slice(0, 5) : []
        };
    }

    async function initGame() {
        try {
            scrambledWordEl.textContent = '...';
            userInput.disabled = true;
            checkBtn.disabled = true;
            hintBtn.disabled = true;
            refreshBtn.disabled = true;

            showMessage('Loading new word...', 'info');

            const data = await getWordData();

            currentWord = data.word.toLowerCase();
            currentScrambled = scrambleWord(currentWord);
            hints = {
                definition: data.description,
                synonyms: data.synonyms,
                antonyms: data.antonyms
            };

            scrambledWordEl.textContent = currentScrambled;
            userInput.value = '';
            hintContainer.classList.add('hidden');
            hideMessage();

            updateHintText('definition');

            userInput.disabled = false;
            checkBtn.disabled = false;
            hintBtn.disabled = false;
            refreshBtn.disabled = false;
            userInput.focus();

        } catch (error) {
            console.error('Error fetching game data:', error);
            showMessage('Using offline mode.', 'error');

            // Fallback for offline/error
            currentWord = 'puzzle';
            currentScrambled = scrambleWord(currentWord);
            hints = { definition: 'A game, toy, or problem designed to test ingenuity or knowledge.', synonyms: ['mystery', 'enigma'], antonyms: [] };
            scrambledWordEl.textContent = currentScrambled;

            userInput.disabled = false;
            checkBtn.disabled = false;
            hintBtn.disabled = false;
            refreshBtn.disabled = false;
        }
    }

    function checkWord() {
        const userWord = userInput.value.trim().toLowerCase();

        if (!userWord) {
            showMessage('Please enter a word!', 'error');
            return;
        }

        if (userWord === currentWord) {
            score++;
            scoreEl.textContent = score;
            showMessage('Correct! Well done!', 'success');

            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore);
                bestScoreEl.textContent = bestScore;
            }

            scrambledWordEl.classList.add('success-pop');
            setTimeout(() => scrambledWordEl.classList.remove('success-pop'), 1000);

            setTimeout(initGame, 1500);
        } else {
            showMessage('Wrong word! Try again.', 'error');
            userInput.classList.add('shake');
            setTimeout(() => userInput.classList.remove('shake'), 400);
        }
    }

    function showMessage(msg, type) {
        messageEl.textContent = msg;
        messageEl.className = `message show ${type}`;
    }

    function hideMessage() {
        messageEl.className = 'message';
    }

    function updateHintText(type) {
        tabBtns.forEach(btn => {
            if (btn.dataset.tab === type) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        let text = '';
        if (type === 'definition') {
            text = hints.definition || 'No definition available.';
        } else if (type === 'synonyms') {
            text = hints.synonyms.length > 0 ? hints.synonyms.join(', ') : 'No synonyms available.';
        } else if (type === 'antonyms') {
            text = hints.antonyms.length > 0 ? hints.antonyms.join(', ') : 'No antonyms available.';
        }
        hintText.innerHTML = text;
    }

    checkBtn.addEventListener('click', checkWord);

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkWord();
    });

    hintBtn.addEventListener('click', () => {
        hintContainer.classList.toggle('hidden');
    });

    refreshBtn.addEventListener('click', () => {
        score = 0;
        scoreEl.textContent = score;
        initGame();
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateHintText(btn.dataset.tab);
        });
    });

    initGame();
});
