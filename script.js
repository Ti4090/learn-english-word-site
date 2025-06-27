// Vocabulary Learning App - Main JavaScript File

class VocabularyApp {
    constructor() {
        this.words = [];
        this.currentWordIndex = 0;
        this.currentScreen = 'home';
        this.filteredWords = [];
        
        // Learning features
        this.practiceMode = {
            type: null,
            score: 0,
            streak: 0,
            level: 1,
            currentQuestion: null,
            correctAnswer: null
        };
        
        this.quizData = {
            currentOptions: [],
            selectedAnswer: null,
            correctAnswer: null
        };
        
        this.init();
    }

    init() {
        this.loadWords();
        this.bindEvents();
        this.showScreen('home');
        this.updateWordDisplay();
        this.updateStats();
        this.checkBrowserCompatibility();
    }

    // Event Binding
    bindEvents() {
        // Navigation events
        document.getElementById('start-learning-btn').addEventListener('click', () => this.showScreen('learning'));
        document.getElementById('add-word-btn').addEventListener('click', () => this.showScreen('add-word'));
        document.getElementById('add-first-word').addEventListener('click', () => this.showScreen('add-word'));
        document.getElementById('practice-mode-btn').addEventListener('click', () => this.showScreen('practice-mode'));
        document.getElementById('learn-all-words-btn').addEventListener('click', () => this.showScreen('learn-all'));
        document.getElementById('manage-words-btn').addEventListener('click', () => this.showScreen('manage-words'));
        document.getElementById('view-saved-btn').addEventListener('click', () => this.toggleSavedWordsPanel());
        document.getElementById('back-to-home').addEventListener('click', () => this.showScreen('home'));
        document.getElementById('back-to-home-practice').addEventListener('click', () => this.showScreen('home'));
        document.getElementById('back-to-home-audio').addEventListener('click', () => this.showScreen('home'));
        document.getElementById('back-to-home-manage').addEventListener('click', () => this.showScreen('home'));
        document.getElementById('back-to-practice-modes').addEventListener('click', () => this.backToPracticeModes());
        document.getElementById('cancel-add-word').addEventListener('click', () => this.showScreen('home'));
        document.getElementById('cancel-form').addEventListener('click', () => this.showScreen('home'));

        // Word learning events
        document.getElementById('play-pronunciation').addEventListener('click', () => this.playPronunciation());
        document.getElementById('prev-word').addEventListener('click', () => this.previousWord());
        document.getElementById('next-word').addEventListener('click', () => this.nextWord());
        document.getElementById('random-word').addEventListener('click', () => this.randomWord());
        document.getElementById('save-word').addEventListener('click', () => this.saveCurrentWord());
        document.getElementById('favorite-checkbox').addEventListener('change', () => this.updateWordStatus());
        document.getElementById('learned-checkbox').addEventListener('change', () => this.updateWordStatus());

        // Learning tools events
        document.getElementById('check-answer').addEventListener('click', () => this.checkQuizAnswer());
        document.getElementById('generate-mnemonic').addEventListener('click', () => this.generateMnemonic());
        document.getElementById('word-association').addEventListener('click', () => this.generateWordAssociation());
        document.getElementById('etymology').addEventListener('click', () => this.generateEtymology());

        // Practice mode events
        document.getElementById('flashcard-mode').addEventListener('click', () => this.startPracticeMode('flashcard'));
        document.getElementById('spelling-mode').addEventListener('click', () => this.startPracticeMode('spelling'));
        document.getElementById('multiple-choice-mode').addEventListener('click', () => this.startPracticeMode('multiple-choice'));
        document.getElementById('listening-mode').addEventListener('click', () => this.startPracticeMode('listening'));
        document.getElementById('practice-submit').addEventListener('click', () => this.submitPracticeAnswer());
        document.getElementById('practice-hint').addEventListener('click', () => this.showPracticeHint());
        document.getElementById('practice-skip').addEventListener('click', () => this.skipPracticeQuestion());

        // Audio learning events
        document.getElementById('start-audio-learning').addEventListener('click', () => this.startAudioLearning());
        document.getElementById('pause-audio-learning').addEventListener('click', () => this.pauseAudioLearning());
        document.getElementById('stop-audio-learning').addEventListener('click', () => this.stopAudioLearning());
        document.getElementById('word-delay').addEventListener('input', (e) => this.updateDelayValue(e));
        
        // Music selection events
        document.querySelectorAll('.music-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMusic(e.target.id));
        });
        document.getElementById('device-music').addEventListener('change', (e) => this.loadDeviceMusic(e));
        document.getElementById('test-device-music').addEventListener('click', () => this.testDeviceMusic());
        document.getElementById('music-volume').addEventListener('input', (e) => this.updateMusicVolume(e));

        // Word management events
        document.getElementById('manage-search').addEventListener('input', (e) => this.searchManageWords(e.target.value));
        document.getElementById('manage-level-filter').addEventListener('change', (e) => this.filterManageWords(e.target.value));
        document.getElementById('select-all-words').addEventListener('click', () => this.selectAllWords());
        document.getElementById('delete-selected').addEventListener('click', () => this.deleteSelectedWords());
        document.getElementById('export-selected').addEventListener('click', () => this.exportSelectedWords());

        // Form events
        document.getElementById('add-word-form').addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.getElementById('new-image').addEventListener('change', (e) => this.handleImageUpload(e));

        // Panel events
        document.getElementById('close-panel').addEventListener('click', () => this.toggleSavedWordsPanel());
        document.getElementById('panel-overlay').addEventListener('click', () => this.toggleSavedWordsPanel());
        document.getElementById('search-words').addEventListener('input', (e) => this.searchWords(e.target.value));
        document.getElementById('filter-level').addEventListener('change', (e) => this.filterByLevel(e.target.value));

        // File operations
        document.getElementById('download-txt').addEventListener('click', () => this.downloadTXT());
        document.getElementById('backup-json').addEventListener('click', () => this.backupJSON());
        document.getElementById('restore-btn').addEventListener('click', () => document.getElementById('restore-json').click());
        document.getElementById('restore-json').addEventListener('change', (e) => this.restoreJSON(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    // Screen Management
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;

        // Handle screen-specific logic
        if (screenName === 'add-word') {
            this.resetForm();
        } else if (screenName === 'learning') {
            if (this.words.length === 0) {
                this.showScreen('home');
                this.showToast('Please add some words first before learning!', 'warning');
                return;
            }
            this.updateWordDisplay();
        } else if (screenName === 'practice-mode') {
            if (this.words.length === 0) {
                this.showScreen('home');
                this.showToast('Please add some words first before practicing!', 'warning');
                return;
            }
            this.updatePracticeStats();
            // Reset practice mode UI
            document.getElementById('practice-content').style.display = 'none';
            document.querySelectorAll('.practice-mode-btn').forEach(btn => btn.style.display = 'block');
        } else if (screenName === 'learn-all') {
            if (this.words.length === 0) {
                this.showScreen('home');
                this.showToast('Please add some words first before starting audio learning!', 'warning');
                return;
            }
            // Initialize audio learning settings
            this.selectedMusic = 'music-none';
            document.getElementById('audio-progress').textContent = `0 / ${this.words.length}`;
        } else if (screenName === 'manage-words') {
            this.renderManageWords();
        } else if (screenName === 'home') {
            this.updateStats();
            // Stop any active audio learning
            if (this.audioLearning && this.audioLearning.isActive) {
                this.stopAudioLearning();
            }
        }

        // Reset add word form when navigating away from edit mode
        if (this.currentScreen !== 'add-word' && this.editingWordId) {
            this.editingWordId = null;
            document.querySelector('#add-word-screen h2').textContent = 'Add New Word';
            document.querySelector('#add-word-form button[type="submit"]').textContent = 'Add Word';
        }
    }

    // Word Management
    loadWords() {
        const savedWords = localStorage.getItem('vocabularyWords');
        if (savedWords) {
            this.words = JSON.parse(savedWords);
        }
        this.filteredWords = [...this.words];
    }

    saveWords() {
        localStorage.setItem('vocabularyWords', JSON.stringify(this.words));
    }

    addWord(wordData) {
        // Check for duplicate words
        const existingWord = this.words.find(word => 
            word.word.toLowerCase() === wordData.word.toLowerCase()
        );

        if (existingWord) {
            this.showToast('Word already exists!', 'warning');
            return false;
        }

        // Add timestamp and default values
        wordData.id = Date.now().toString();
        wordData.createdAt = new Date().toISOString();
        wordData.favorite = false;
        wordData.learned = false;

        this.words.push(wordData);
        this.saveWords();
        this.filteredWords = [...this.words];
        this.updateSavedWordsList();
        this.showToast('Word added successfully!', 'success');
        return true;
    }

    deleteWord(wordId) {
        const index = this.words.findIndex(word => word.id === wordId);
        if (index !== -1) {
            const deletedWord = this.words[index];
            this.words.splice(index, 1);
            this.saveWords();
            this.filteredWords = this.filteredWords.filter(word => word.id !== wordId);
            
            // Adjust current index if necessary
            if (this.currentWordIndex >= this.words.length && this.words.length > 0) {
                this.currentWordIndex = this.words.length - 1;
            }
            
            this.updateWordDisplay();
            this.updateSavedWordsList();
            this.showToast(`"${deletedWord.word}" deleted`, 'success');
        }
    }

    updateWordStatus() {
        if (this.words.length === 0) return;

        const currentWord = this.words[this.currentWordIndex];
        if (currentWord) {
            currentWord.favorite = document.getElementById('favorite-checkbox').checked;
            currentWord.learned = document.getElementById('learned-checkbox').checked;
            this.saveWords();
            this.updateSavedWordsList();
        }
    }

    saveCurrentWord() {
        if (this.words.length === 0) {
            this.showToast('No word to save!', 'warning');
            return;
        }

        this.updateWordStatus();
        this.showToast('Word status saved!', 'success');
    }

    // Word Navigation
    previousWord() {
        if (this.words.length === 0) return;
        
        this.currentWordIndex = this.currentWordIndex > 0 ? 
            this.currentWordIndex - 1 : this.words.length - 1;
        this.updateWordDisplay();
    }

    nextWord() {
        if (this.words.length === 0) return;
        
        this.currentWordIndex = this.currentWordIndex < this.words.length - 1 ? 
            this.currentWordIndex + 1 : 0;
        this.updateWordDisplay();
    }

    updateWordDisplay() {
        const wordContent = document.getElementById('word-content');
        const noWordsMessage = document.getElementById('no-words-message');
        const currentWordElement = document.getElementById('current-word');
        const playBtn = document.getElementById('play-pronunciation');

        if (this.words.length === 0) {
            wordContent.style.display = 'none';
            noWordsMessage.style.display = 'block';
            currentWordElement.textContent = 'No words available';
            playBtn.disabled = true;
            return;
        }

        const word = this.words[this.currentWordIndex];
        wordContent.style.display = 'block';
        noWordsMessage.style.display = 'none';
        playBtn.disabled = false;

        // Update word information
        currentWordElement.textContent = word.word;
        document.getElementById('word-pronunciation').textContent = word.pronunciation || 'N/A';
        document.getElementById('word-meaning').textContent = word.meaning;
        document.getElementById('word-definition').textContent = word.definition || 'No definition provided';
        document.getElementById('word-synonyms').textContent = word.synonyms || 'None';
        document.getElementById('word-antonyms').textContent = word.antonyms || 'None';

        // Update examples
        this.updateExamples(word.examples);

        // Update image
        this.updateWordImage(word.image);

        // Update checkboxes
        document.getElementById('favorite-checkbox').checked = word.favorite || false;
        document.getElementById('learned-checkbox').checked = word.learned || false;

        // Update navigation buttons
        document.getElementById('prev-word').disabled = false;
        document.getElementById('next-word').disabled = false;
        
        // Generate quiz for current word
        this.generateQuiz();
    }

    updateExamples(examples) {
        const examplesContainer = document.getElementById('word-examples');
        examplesContainer.innerHTML = '';

        if (!examples || examples.trim() === '') {
            examplesContainer.innerHTML = '<p>No examples provided</p>';
            return;
        }

        const examplesList = examples.split('\n').filter(ex => ex.trim() !== '');
        examplesList.forEach(example => {
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'example-sentence';
            exampleDiv.textContent = example.trim();
            examplesContainer.appendChild(exampleDiv);
        });
    }

    updateWordImage(imageData) {
        const imageElement = document.getElementById('word-image');
        if (imageData) {
            imageElement.src = imageData;
            imageElement.style.display = 'block';
        } else {
            imageElement.style.display = 'none';
        }
    }

    // Speech Synthesis
    playPronunciation() {
        if (this.words.length === 0) return;

        const word = this.words[this.currentWordIndex];
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(word.word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            utterance.pitch = 1;

            // Try to use a natural voice
            const voices = speechSynthesis.getVoices();
            const englishVoice = voices.find(voice => 
                voice.lang.startsWith('en') && voice.name.includes('Natural')
            ) || voices.find(voice => voice.lang.startsWith('en'));

            if (englishVoice) {
                utterance.voice = englishVoice;
            }

            speechSynthesis.speak(utterance);
        } else {
            this.showToast('Speech synthesis not supported in your browser', 'error');
        }
    }

    // Form Handling
    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();
        if (this.addWord(formData)) {
            this.showScreen('home');
        }
    }

    validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });

        // Validate required fields
        const word = document.getElementById('new-word').value.trim();
        const meaning = document.getElementById('new-meaning').value.trim();
        const level = document.getElementById('new-level').value;

        if (!word) {
            document.getElementById('word-error').textContent = 'English word is required';
            isValid = false;
        }

        if (!meaning) {
            document.getElementById('meaning-error').textContent = 'Turkish meaning is required';
            isValid = false;
        }

        if (!level) {
            document.getElementById('level-error').textContent = 'Word level is required';
            isValid = false;
        }

        return isValid;
    }

    getFormData() {
        return {
            word: document.getElementById('new-word').value.trim(),
            pronunciation: document.getElementById('new-pronunciation').value.trim(),
            meaning: document.getElementById('new-meaning').value.trim(),
            definition: document.getElementById('new-definition').value.trim(),
            synonyms: document.getElementById('new-synonyms').value.trim(),
            antonyms: document.getElementById('new-antonyms').value.trim(),
            examples: document.getElementById('new-examples').value.trim(),
            level: document.getElementById('new-level').value,
            image: this.currentImageData || null
        };
    }

    resetForm() {
        document.getElementById('add-word-form').reset();
        document.getElementById('image-preview').innerHTML = '';
        this.currentImageData = null;
        
        // Clear error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image size should be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImageData = e.target.result;
            this.showImagePreview(this.currentImageData);
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(imageData) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `
            <img src="${imageData}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; object-fit: cover;">
        `;
    }

    // Saved Words Panel
    toggleSavedWordsPanel() {
        const panel = document.getElementById('saved-words-panel');
        const overlay = document.getElementById('panel-overlay');
        
        panel.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (panel.classList.contains('active')) {
            this.updateSavedWordsList();
        }
    }

    updateSavedWordsList() {
        const container = document.getElementById('saved-words-list');
        
        if (this.filteredWords.length === 0) {
            container.innerHTML = `
                <div id="no-saved-words" class="no-words">
                    <p>No saved words yet. Start learning and save your first word!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        
        this.filteredWords.forEach(word => {
            const wordItem = this.createWordItem(word);
            container.appendChild(wordItem);
        });
    }

    createWordItem(word) {
        const div = document.createElement('div');
        div.className = 'word-item';
        div.innerHTML = `
            <div class="word-summary" data-word-id="${word.id}">
                <div class="word-info">
                    <h4>${word.word}</h4>
                    <p>${word.meaning}</p>
                </div>
                <div class="word-actions-panel">
                    <div class="word-badges">
                        ${word.level ? `<span class="badge level">${word.level}</span>` : ''}
                        ${word.favorite ? '<span class="badge favorite">❤️</span>' : ''}
                        ${word.learned ? '<span class="badge learned">✅</span>' : ''}
                    </div>
                    <button class="delete-btn" data-word-id="${word.id}">Delete</button>
                </div>
            </div>
            <div class="word-details" id="details-${word.id}">
                ${this.createWordDetails(word)}
            </div>
        `;

        // Add event listeners
        const summary = div.querySelector('.word-summary');
        summary.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                this.toggleWordDetails(word.id);
            }
        });

        const deleteBtn = div.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${word.word}"?`)) {
                this.deleteWord(word.id);
            }
        });

        return div;
    }

    createWordDetails(word) {
        return `
            <div class="detail-section">
                <strong>Pronunciation:</strong>
                <span>${word.pronunciation || 'N/A'}</span>
            </div>
            <div class="detail-section">
                <strong>Definition:</strong>
                <p>${word.definition || 'No definition provided'}</p>
            </div>
            <div class="detail-section">
                <strong>Synonyms:</strong>
                <p>${word.synonyms || 'None'}</p>
            </div>
            <div class="detail-section">
                <strong>Antonyms:</strong>
                <p>${word.antonyms || 'None'}</p>
            </div>
            <div class="detail-section">
                <strong>Examples:</strong>
                <p>${word.examples ? word.examples.replace(/\n/g, '<br>') : 'No examples provided'}</p>
            </div>
            ${word.image ? `
                <div class="detail-section">
                    <strong>Image:</strong><br>
                    <img src="${word.image}" alt="${word.word}" class="detail-image">
                </div>
            ` : ''}
        `;
    }

    toggleWordDetails(wordId) {
        const details = document.getElementById(`details-${wordId}`);
        details.classList.toggle('expanded');
    }

    // Search and Filter
    searchWords(query) {
        const searchTerm = query.toLowerCase();
        this.applyFilters(searchTerm, this.currentLevelFilter);
    }

    filterByLevel(level) {
        this.currentLevelFilter = level;
        const searchTerm = document.getElementById('search-words').value.toLowerCase();
        this.applyFilters(searchTerm, level);
    }

    applyFilters(searchTerm = '', levelFilter = '') {
        this.filteredWords = this.words.filter(word => {
            const matchesSearch = word.word.toLowerCase().includes(searchTerm) ||
                                word.meaning.toLowerCase().includes(searchTerm);
            const matchesLevel = !levelFilter || word.level === levelFilter;
            
            return matchesSearch && matchesLevel;
        });
        
        this.updateSavedWordsList();
    }

    // File Operations
    downloadTXT() {
        if (this.words.length === 0) {
            this.showToast('No words to download', 'warning');
            return;
        }

        let content = 'ENGLISH VOCABULARY WORDS\n';
        content += '========================\n\n';

        this.words.forEach((word, index) => {
            content += `${index + 1}. ${word.word.toUpperCase()}\n`;
            content += `   Turkish: ${word.meaning}\n`;
            if (word.pronunciation) content += `   Pronunciation: ${word.pronunciation}\n`;
            if (word.definition) content += `   Definition: ${word.definition}\n`;
            if (word.synonyms) content += `   Synonyms: ${word.synonyms}\n`;
            if (word.antonyms) content += `   Antonyms: ${word.antonyms}\n`;
            if (word.level) content += `   Level: ${word.level}\n`;
            if (word.examples) {
                content += `   Examples:\n`;
                word.examples.split('\n').forEach(example => {
                    if (example.trim()) content += `     - ${example.trim()}\n`;
                });
            }
            content += `   Status: ${word.favorite ? 'Favorite' : ''}${word.favorite && word.learned ? ', ' : ''}${word.learned ? 'Learned' : ''}\n`;
            content += `   Added: ${new Date(word.createdAt).toLocaleDateString()}\n`;
            content += '\n' + '-'.repeat(50) + '\n\n';
        });

        this.downloadFile(content, 'vocabulary-words.txt', 'text/plain');
        this.showToast('Words downloaded as TXT file', 'success');
    }

    backupJSON() {
        if (this.words.length === 0) {
            this.showToast('No words to backup', 'warning');
            return;
        }

        const backup = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            wordsCount: this.words.length,
            words: this.words
        };

        const content = JSON.stringify(backup, null, 2);
        this.downloadFile(content, 'vocabulary-backup.json', 'application/json');
        this.showToast('Backup created successfully', 'success');
    }

    restoreJSON(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                
                if (!backup.words || !Array.isArray(backup.words)) {
                    throw new Error('Invalid backup file format');
                }

                if (confirm(`This will replace all current words with ${backup.words.length} words from the backup. Continue?`)) {
                    this.words = backup.words;
                    this.saveWords();
                    this.filteredWords = [...this.words];
                    this.currentWordIndex = 0;
                    this.updateWordDisplay();
                    this.updateSavedWordsList();
                    this.showToast(`Restored ${backup.words.length} words successfully`, 'success');
                }
            } catch (error) {
                this.showToast('Invalid backup file', 'error');
            }
        };
        reader.readAsText(file);

        // Reset file input
        e.target.value = '';
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Keyboard Navigation
    handleKeyboardNavigation(e) {
        if (this.currentScreen !== 'learning') return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousWord();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextWord();
                break;
            case ' ':
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.playPronunciation();
                }
                break;
            case 'Escape':
                if (document.getElementById('saved-words-panel').classList.contains('active')) {
                    this.toggleSavedWordsPanel();
                }
                break;
        }
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Auto remove toast after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    // Statistics Update
    updateStats() {
        const totalWords = this.words.length;
        const learnedWords = this.words.filter(word => word.learned).length;
        const favoriteWords = this.words.filter(word => word.favorite).length;

        document.getElementById('total-words').textContent = totalWords;
        document.getElementById('learned-words').textContent = learnedWords;
        document.getElementById('favorite-words').textContent = favoriteWords;
    }

    // Browser Compatibility Check
    checkBrowserCompatibility() {
        const features = {
            localStorage: typeof(Storage) !== "undefined",
            speechSynthesis: 'speechSynthesis' in window,
            fileReader: 'FileReader' in window,
            canvas: !!document.createElement('canvas').getContext,
            flexbox: CSS.supports('display', 'flex'),
            grid: CSS.supports('display', 'grid')
        };

        const unsupportedFeatures = Object.keys(features).filter(feature => !features[feature]);
        
        if (unsupportedFeatures.length > 0) {
            console.warn('Some features may not work properly in this browser:', unsupportedFeatures);
            
            if (!features.localStorage) {
                this.showToast('Local storage not supported. Data will not be saved.', 'warning');
            }
            
            if (!features.speechSynthesis) {
                this.showToast('Speech synthesis not supported. Pronunciation feature disabled.', 'warning');
            }
        }
    }

    // Enhanced word management with better error handling
    addWord(wordData) {
        try {
            // Check for duplicate words
            const existingWord = this.words.find(word => 
                word.word.toLowerCase() === wordData.word.toLowerCase()
            );

            if (existingWord) {
                this.showToast('Word already exists!', 'warning');
                return false;
            }

            // Add timestamp and default values
            wordData.id = Date.now().toString();
            wordData.createdAt = new Date().toISOString();
            wordData.favorite = false;
            wordData.learned = false;

            this.words.push(wordData);
            this.saveWords();
            this.filteredWords = [...this.words];
            this.updateSavedWordsList();
            this.updateStats();
            this.showToast('Word added successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Error adding word:', error);
            this.showToast('Error adding word. Please try again.', 'error');
            return false;
        }
    }

    // Enhanced word deletion with confirmation
    deleteWord(wordId) {
        try {
            const index = this.words.findIndex(word => word.id === wordId);
            if (index !== -1) {
                const deletedWord = this.words[index];
                
                // Show confirmation dialog
                if (confirm(`Are you sure you want to delete "${deletedWord.word}"?`)) {
                    this.words.splice(index, 1);
                    this.saveWords();
                    this.filteredWords = this.filteredWords.filter(word => word.id !== wordId);
                    
                    // Adjust current index if necessary
                    if (this.currentWordIndex >= this.words.length && this.words.length > 0) {
                        this.currentWordIndex = this.words.length - 1;
                    }
                    
                    this.updateWordDisplay();
                    this.updateSavedWordsList();
                    this.updateStats();
                    this.showToast(`"${deletedWord.word}" deleted`, 'success');
                }
            }
        } catch (error) {
            console.error('Error deleting word:', error);
            this.showToast('Error deleting word. Please try again.', 'error');
        }
    }

    // Enhanced word status update
    updateWordStatus() {
        try {
            if (this.words.length === 0) return;

            const currentWord = this.words[this.currentWordIndex];
            if (currentWord) {
                currentWord.favorite = document.getElementById('favorite-checkbox').checked;
                currentWord.learned = document.getElementById('learned-checkbox').checked;
                this.saveWords();
                this.updateSavedWordsList();
                this.updateStats();
            }
        } catch (error) {
            console.error('Error updating word status:', error);
            this.showToast('Error updating word status.', 'error');
        }
    }

    // Advanced Learning Features
    randomWord() {
        if (this.words.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * this.words.length);
        this.currentWordIndex = randomIndex;
        this.updateWordDisplay();
        this.generateQuiz();
    }

    generateQuiz() {
        if (this.words.length < 3) return;

        const currentWord = this.words[this.currentWordIndex];
        const wrongAnswers = this.words
            .filter(word => word.id !== currentWord.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(word => word.meaning);

        const allOptions = [currentWord.meaning, ...wrongAnswers]
            .sort(() => Math.random() - 0.5);

        this.quizData.currentOptions = allOptions;
        this.quizData.correctAnswer = currentWord.meaning;
        this.quizData.selectedAnswer = null;

        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';

        allOptions.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectQuizOption(optionElement, option));
            optionsContainer.appendChild(optionElement);
        });

        document.getElementById('quiz-result').innerHTML = '';
        document.getElementById('check-answer').disabled = true;
    }

    selectQuizOption(element, answer) {
        document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
        this.quizData.selectedAnswer = answer;
        document.getElementById('check-answer').disabled = false;
    }

    checkQuizAnswer() {
        if (!this.quizData.selectedAnswer) return;

        const isCorrect = this.quizData.selectedAnswer === this.quizData.correctAnswer;
        const resultElement = document.getElementById('quiz-result');

        document.querySelectorAll('.quiz-option').forEach(opt => {
            if (opt.textContent === this.quizData.correctAnswer) {
                opt.classList.add('correct');
            } else if (opt.textContent === this.quizData.selectedAnswer && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            resultElement.className = 'quiz-result correct';
            resultElement.textContent = '🎉 Correct! Well done!';
        } else {
            resultElement.className = 'quiz-result incorrect';
            resultElement.textContent = `❌ Incorrect. The correct answer is: ${this.quizData.correctAnswer}`;
        }

        document.getElementById('check-answer').disabled = true;
        
        setTimeout(() => {
            this.generateQuiz();
        }, 3000);
    }

    generateMnemonic() {
        if (this.words.length === 0) return;

        const currentWord = this.words[this.currentWordIndex];
        const memoryContent = document.getElementById('memory-content');
        
        document.querySelectorAll('.memory-content').forEach(content => content.classList.remove('active'));
        
        const mnemonics = [
            `"${currentWord.word}" sounds like "${this.createSoundAlike(currentWord.word)}" - imagine ${this.createImagery(currentWord.meaning)}`,
            `Remember "${currentWord.word}" = "${currentWord.meaning}" by thinking: ${this.createAssociation(currentWord.word, currentWord.meaning)}`,
            `Break down "${currentWord.word}": ${this.breakDownWord(currentWord.word)} → ${currentWord.meaning}`,
            `Visual memory: Picture ${currentWord.meaning} when you see "${currentWord.word}"`
        ];
        
        const randomMnemonic = mnemonics[Math.floor(Math.random() * mnemonics.length)];
        
        memoryContent.innerHTML = `<h4>🧠 Memory Trick</h4><p>${randomMnemonic}</p>`;
        memoryContent.classList.add('active');
    }

    generateWordAssociation() {
        if (this.words.length === 0) return;

        const currentWord = this.words[this.currentWordIndex];
        const memoryContent = document.getElementById('memory-content');
        
        document.querySelectorAll('.memory-content').forEach(content => content.classList.remove('active'));
        
        const relatedWords = this.words
            .filter(word => word.level === currentWord.level || word.meaning.includes(currentWord.meaning.split(' ')[0]))
            .slice(0, 5)
            .map(word => `${word.word} (${word.meaning})`)
            .join(', ');
        
        const associations = [
            `Similar level words: ${relatedWords || 'None found - add more words!'}`,
            `Words containing "${currentWord.meaning.split(' ')[0]}": ${this.findSimilarMeanings(currentWord.meaning)}`,
            `Rhymes with: ${this.findRhyming(currentWord.word)}`,
            `Category: ${this.categorizeWord(currentWord.meaning)}`
        ];
        
        memoryContent.innerHTML = `<h4>🔗 Word Associations</h4><div>${associations.map(assoc => `<p>• ${assoc}</p>`).join('')}</div>`;
        memoryContent.classList.add('active');
    }

    generateEtymology() {
        if (this.words.length === 0) return;

        const currentWord = this.words[this.currentWordIndex];
        const memoryContent = document.getElementById('memory-content');
        
        document.querySelectorAll('.memory-content').forEach(content => content.classList.remove('active'));
        
        const etymologyInfo = this.getEtymologyInfo(currentWord.word);
        
        memoryContent.innerHTML = `<h4>📚 Word Origin</h4><div>${etymologyInfo}</div>`;
        memoryContent.classList.add('active');
    }

    // Practice Mode Functions
    startPracticeMode(type) {
        if (this.words.length === 0) {
            this.showToast('Add some words first to start practicing!', 'warning');
            return;
        }

        this.practiceMode.type = type;
        this.practiceMode.currentQuestion = null;
        
        document.querySelectorAll('.practice-mode-btn').forEach(btn => btn.style.display = 'none');
        document.getElementById('practice-content').style.display = 'block';
        
        this.generatePracticeQuestion();
    }

    generatePracticeQuestion() {
        const randomWord = this.words[Math.floor(Math.random() * this.words.length)];
        this.practiceMode.currentQuestion = randomWord;
        
        const questionElement = document.getElementById('practice-question');
        const inputElement = document.getElementById('practice-input');
        const feedbackElement = document.getElementById('practice-feedback');
        
        feedbackElement.style.display = 'none';
        feedbackElement.className = 'practice-feedback';
        
        switch (this.practiceMode.type) {
            case 'flashcard':
                questionElement.textContent = `What does "${randomWord.word}" mean in Turkish?`;
                inputElement.innerHTML = `
                    <input type="text" placeholder="Type the Turkish meaning..." autocomplete="off">
                `;
                this.practiceMode.correctAnswer = randomWord.meaning.toLowerCase();
                break;
                
            case 'spelling':
                questionElement.textContent = `How do you spell: "${randomWord.meaning}"?`;
                inputElement.innerHTML = `
                    <input type="text" placeholder="Type the English word..." autocomplete="off">
                `;
                this.practiceMode.correctAnswer = randomWord.word.toLowerCase();
                break;
                
            case 'multiple-choice':
                const wrongAnswers = this.words
                    .filter(word => word.id !== randomWord.id)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
                    
                const options = [randomWord, ...wrongAnswers]
                    .sort(() => Math.random() - 0.5);
                    
                questionElement.textContent = `What does "${randomWord.word}" mean?`;
                inputElement.innerHTML = `
                    <div class="practice-options">
                        ${options.map((option, index) => `
                            <button class="practice-option" data-answer="${option.meaning}">
                                ${String.fromCharCode(65 + index)}. ${option.meaning}
                            </button>
                        `).join('')}
                    </div>
                `;
                
                document.querySelectorAll('.practice-option').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.practice-option').forEach(b => b.classList.remove('selected'));
                        e.target.classList.add('selected');
                        this.practiceMode.selectedAnswer = e.target.dataset.answer;
                    });
                });
                
                this.practiceMode.correctAnswer = randomWord.meaning;
                break;
                
            case 'listening':
                questionElement.textContent = 'Listen to the pronunciation and type the word:';
                inputElement.innerHTML = `
                    <div class="listening-controls">
                        <button id="play-practice-audio" class="play-btn">🔊 Play Audio</button>
                        <input type="text" placeholder="Type what you heard..." autocomplete="off">
                    </div>
                `;
                
                document.getElementById('play-practice-audio').addEventListener('click', () => {
                    this.speakWord(randomWord.word);
                });
                
                this.practiceMode.correctAnswer = randomWord.word.toLowerCase();
                break;
        }
    }

    submitPracticeAnswer() {
        let userAnswer = '';
        const feedbackElement = document.getElementById('practice-feedback');
        
        if (this.practiceMode.type === 'multiple-choice') {
            userAnswer = this.practiceMode.selectedAnswer;
        } else {
            const input = document.querySelector('#practice-input input');
            userAnswer = input ? input.value.toLowerCase().trim() : '';
        }
        
        const isCorrect = userAnswer === this.practiceMode.correctAnswer;
        
        if (isCorrect) {
            this.practiceMode.score += 10;
            this.practiceMode.streak += 1;
            
            if (this.practiceMode.streak > 0 && this.practiceMode.streak % 5 === 0) {
                this.practiceMode.level += 1;
            }
            
            feedbackElement.className = 'practice-feedback correct';
            feedbackElement.textContent = `🎉 Correct! +10 points`;
        } else {
            this.practiceMode.streak = 0;
            feedbackElement.className = 'practice-feedback incorrect';
            feedbackElement.textContent = `❌ Incorrect. The answer was: ${this.practiceMode.correctAnswer}`;
        }
        
        feedbackElement.style.display = 'block';
        this.updatePracticeStats();
        
        setTimeout(() => {
            this.generatePracticeQuestion();
        }, 2500);
    }

    showPracticeHint() {
        const word = this.practiceMode.currentQuestion;
        const hint = `Hint: ${word.word.charAt(0).toUpperCase()}${'_'.repeat(word.word.length - 1)}`;
        
        if (word.synonyms) {
            hint += ` | Synonyms: ${word.synonyms}`;
        }
        
        this.showToast(hint, 'info');
    }

    skipPracticeQuestion() {
        this.generatePracticeQuestion();
    }

    updatePracticeStats() {
        document.getElementById('practice-score').textContent = this.practiceMode.score;
        document.getElementById('practice-streak').textContent = this.practiceMode.streak;
        document.getElementById('practice-level').textContent = this.practiceMode.level;
    }

    speakWord(word, language = 'en-US', callback = null) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = language;
            utterance.rate = 0.8;
            utterance.volume = 0.9;
            
            if (callback) {
                utterance.onend = callback;
            }
            
            speechSynthesis.speak(utterance);
        }
    }

    // Helper functions for memory aids
    createSoundAlike(word) {
        const soundAlikes = {
            'cat': 'kat',
            'dog': 'doğ',
            'house': 'haus',
            'book': 'buk'
        };
        return soundAlikes[word.toLowerCase()] || word;
    }

    createImagery(meaning) {
        const imagery = {
            'kedi': 'a cat sleeping on a keyboard',
            'köpek': 'a dog wagging its tail',
            'ev': 'a cozy house with smoke from chimney',
            'kitap': 'an open book with flying letters'
        };
        return imagery[meaning.toLowerCase()] || `something related to ${meaning}`;
    }

    createAssociation(word, meaning) {
        return `"${word}" → "${meaning}" (create your own story connecting these!)`;
    }

    breakDownWord(word) {
        if (word.length <= 4) return word;
        const mid = Math.floor(word.length / 2);
        return `${word.substring(0, mid)} + ${word.substring(mid)}`;
    }

    findSimilarMeanings(meaning) {
        const similar = this.words
            .filter(word => word.meaning.toLowerCase().includes(meaning.split(' ')[0].toLowerCase()))
            .slice(0, 3)
            .map(word => word.word)
            .join(', ');
        return similar || 'None found';
    }

    findRhyming(word) {
        const ending = word.slice(-2);
        const rhymes = this.words
            .filter(w => w.word.endsWith(ending) && w.word !== word)
            .slice(0, 3)
            .map(w => w.word)
            .join(', ');
        return rhymes || 'None found';
    }

    categorizeWord(meaning) {
        const categories = {
            'animal': ['kedi', 'köpek', 'kuş', 'balık'],
            'object': ['kitap', 'masa', 'sandalye', 'telefon'],
            'place': ['ev', 'okul', 'hastane', 'park'],
            'action': ['koşmak', 'yemek', 'içmek', 'uyumak']
        };
        
        for (const [category, words] of Object.entries(categories)) {
            if (words.some(word => meaning.toLowerCase().includes(word))) {
                return category;
            }
        }
        return 'general';
    }

    getEtymologyInfo(word) {
        const etymologies = {
            'cat': 'From Old English "catt", from Latin "cattus"',
            'dog': 'From Old English "docga", origin uncertain',
            'house': 'From Old English "hūs", from Proto-Germanic',
            'book': 'From Old English "bōc", from Proto-Germanic "bōks"'
        };
        
        const info = etymologies[word.toLowerCase()];
        if (info) {
            return `<p><strong>Origin:</strong> ${info}</p><p><strong>Word family:</strong> Related to similar words in other Germanic languages</p>`;
        }
        
        return `<p><strong>Etymology:</strong> Word origin information not available for "${word}"</p><p><em>Tip:</em> Try looking up this word in an etymology dictionary for detailed historical information!</p>`;
    }

    // New Feature Functions

    // Audio Learning Mode
    startAudioLearning() {
        if (this.words.length === 0) {
            this.showToast('Add some words first to start audio learning!', 'warning');
            return;
        }

        this.audioLearning = {
            isActive: true,
            isPaused: false,
            currentIndex: 0,
            repeatCount: parseInt(document.getElementById('repeat-count').value),
            currentRepeat: 0,
            delay: parseInt(document.getElementById('word-delay').value) * 1000,
            backgroundAudio: null
        };

        // Start background music if selected
        this.playBackgroundMusic();
        
        // Update UI
        document.getElementById('start-audio-learning').style.display = 'none';
        document.getElementById('pause-audio-learning').style.display = 'inline-block';
        document.getElementById('stop-audio-learning').style.display = 'inline-block';
        
        // Start the learning sequence
        this.playNextWord();
    }

    playNextWord() {
        if (!this.audioLearning.isActive || this.audioLearning.isPaused) return;

        const currentWord = this.words[this.audioLearning.currentIndex];
        
        // Update display
        document.getElementById('audio-current-word').textContent = currentWord.word;
        document.getElementById('audio-current-meaning').textContent = currentWord.meaning;
        document.getElementById('audio-progress').textContent = 
            `${this.audioLearning.currentIndex + 1} / ${this.words.length}`;

        // Speak English first, then Turkish after a pause
        this.speakWord(currentWord.word, 'en-US', () => {
            setTimeout(() => {
                this.speakWord(currentWord.meaning, 'tr-TR');
            }, 1000); // 1 second pause between English and Turkish
        });

        // Check if we need to repeat this word
        this.audioLearning.currentRepeat++;
        
        if (this.audioLearning.currentRepeat >= this.audioLearning.repeatCount) {
            // Move to next word
            this.audioLearning.currentRepeat = 0;
            this.audioLearning.currentIndex++;
            
            if (this.audioLearning.currentIndex >= this.words.length) {
                // Finished all words
                this.stopAudioLearning();
                this.showToast('Audio learning completed! Great job!', 'success');
                return;
            }
        }

        // Schedule next word
        setTimeout(() => {
            this.playNextWord();
        }, this.audioLearning.delay);
    }

    pauseAudioLearning() {
        if (this.audioLearning) {
            this.audioLearning.isPaused = true;
            document.getElementById('pause-audio-learning').style.display = 'none';
            document.getElementById('start-audio-learning').style.display = 'inline-block';
            document.getElementById('start-audio-learning').innerHTML = 
                '<span class="btn-icon">▶️</span>Resume Learning';
        }
    }

    stopAudioLearning() {
        if (this.audioLearning) {
            this.audioLearning.isActive = false;
            this.audioLearning = null;
            
            // Stop background music
            if (this.backgroundAudio) {
                this.backgroundAudio.pause();
                this.backgroundAudio = null;
            }
            
            // Reset UI
            document.getElementById('start-audio-learning').style.display = 'inline-block';
            document.getElementById('pause-audio-learning').style.display = 'none';
            document.getElementById('stop-audio-learning').style.display = 'none';
            document.getElementById('start-audio-learning').innerHTML = 
                '<span class="btn-icon">▶️</span>Start Audio Learning';
            
            document.getElementById('audio-current-word').textContent = 'Ready to start';
            document.getElementById('audio-current-meaning').textContent = 'Select your settings and press start';
            document.getElementById('audio-progress').textContent = '0 / 0';
        }
    }

    updateDelayValue(e) {
        document.getElementById('delay-value').textContent = e.target.value + 's';
        if (this.audioLearning) {
            this.audioLearning.delay = parseInt(e.target.value) * 1000;
        }
    }

    selectMusic(musicType) {
        // Update active button (only for built-in music types)
        if (musicType !== 'music-device') {
            document.querySelectorAll('.music-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(musicType).classList.add('active');
            this.selectedMusic = musicType;
        }
    }

    loadDeviceMusic(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            this.deviceMusicUrl = url;
            this.deviceMusicFile = file;
            
            // Set device music as selected
            this.selectedMusic = 'music-device';
            
            // Update UI
            document.querySelectorAll('.music-btn').forEach(btn => btn.classList.remove('active'));
            
            // Show test button
            document.getElementById('test-device-music').style.display = 'inline-block';
            document.getElementById('test-device-music').textContent = `Test: ${file.name}`;
            
            this.showToast(`Music file "${file.name}" loaded successfully!`, 'success');
        }
    }

    testDeviceMusic() {
        if (this.deviceMusicUrl) {
            if (this.testAudio) {
                this.testAudio.pause();
                this.testAudio = null;
                document.getElementById('test-device-music').textContent = `Test: ${this.deviceMusicFile.name}`;
                return;
            }
            
            this.testAudio = new Audio(this.deviceMusicUrl);
            this.testAudio.volume = parseInt(document.getElementById('music-volume').value) / 100;
            this.testAudio.play();
            
            document.getElementById('test-device-music').textContent = 'Stop Test';
            
            this.testAudio.onended = () => {
                this.testAudio = null;
                document.getElementById('test-device-music').textContent = `Test: ${this.deviceMusicFile.name}`;
            };
        }
    }

    updateMusicVolume(e) {
        const volume = e.target.value;
        document.getElementById('volume-value').textContent = volume + '%';
        
        // Update current playing audio volume
        if (this.backgroundAudio) {
            this.backgroundAudio.volume = volume / 100;
        }
        if (this.testAudio) {
            this.testAudio.volume = volume / 100;
        }
    }

    playBackgroundMusic() {
        if (this.selectedMusic === 'music-none') return;
        
        let audioUrl = '';
        
        switch (this.selectedMusic) {
            case 'music-nature':
                // Create nature sounds using Web Audio API
                this.createNatureSound();
                break;
            case 'music-rain':
                this.createRainSound();
                break;
            case 'music-ocean':
                this.createOceanSound();
                break;
            case 'music-device':
                if (this.deviceMusicUrl) {
                    this.backgroundAudio = new Audio(this.deviceMusicUrl);
                    this.backgroundAudio.loop = true;
                    this.backgroundAudio.volume = parseInt(document.getElementById('music-volume').value) / 100;
                    this.backgroundAudio.play();
                }
                break;
        }
    }

    createNatureSound() {
        // Simple nature sound using oscillators
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            // Create subtle wind sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            this.audioContext = audioContext;
            this.backgroundOscillator = oscillator;
        }
    }

    createRainSound() {
        // Simple rain sound simulation
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            const bufferSize = audioContext.sampleRate * 2;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Generate white noise for rain effect
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const source = audioContext.createBufferSource();
            const gainNode = audioContext.createGain();
            
            source.buffer = buffer;
            source.loop = true;
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            source.start();
            this.audioContext = audioContext;
            this.backgroundSource = source;
        }
    }

    createOceanSound() {
        // Simple ocean wave sound
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            this.audioContext = audioContext;
            this.backgroundOscillator = oscillator;
        }
    }

    // Word Management Functions
    renderManageWords() {
        const grid = document.getElementById('words-management-grid');
        grid.innerHTML = '';

        if (this.words.length === 0) {
            grid.innerHTML = '<p class="no-words">No words to manage. Add some words first!</p>';
            return;
        }

        this.words.forEach(word => {
            const wordCard = this.createWordCard(word);
            grid.appendChild(wordCard);
        });

        // Add event listeners for card actions
        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                const wordId = e.target.dataset.wordId;
                this.editWord(wordId);
            } else if (e.target.classList.contains('delete-btn')) {
                const wordId = e.target.dataset.wordId;
                this.deleteWordFromManage(wordId);
            }
        });
    }

    createWordCard(word) {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.dataset.wordId = word.id;

        card.innerHTML = `
            <input type="checkbox" class="select-checkbox" data-word-id="${word.id}">
            <div class="word-card-header">
                <div>
                    <div class="word-card-title">${word.word}</div>
                    <div class="word-card-meaning">${word.meaning}</div>
                </div>
                <div class="word-card-level">${word.level || 'No Level'}</div>
            </div>
            <div class="word-card-actions">
                <button class="card-action-btn edit-btn" data-word-id="${word.id}">Edit</button>
                <button class="card-action-btn delete-btn" data-word-id="${word.id}">Delete</button>
            </div>
        `;

        return card;
    }

    searchManageWords(query) {
        const cards = document.querySelectorAll('.word-card');
        cards.forEach(card => {
            const title = card.querySelector('.word-card-title').textContent.toLowerCase();
            const meaning = card.querySelector('.word-card-meaning').textContent.toLowerCase();
            const matches = title.includes(query.toLowerCase()) || meaning.includes(query.toLowerCase());
            card.style.display = matches ? 'block' : 'none';
        });
    }

    filterManageWords(level) {
        const cards = document.querySelectorAll('.word-card');
        cards.forEach(card => {
            if (level === '') {
                card.style.display = 'block';
            } else {
                const cardLevel = card.querySelector('.word-card-level').textContent;
                card.style.display = cardLevel === level ? 'block' : 'none';
            }
        });
    }

    selectAllWords() {
        const checkboxes = document.querySelectorAll('.select-checkbox');
        const allSelected = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = !allSelected;
            const card = checkbox.closest('.word-card');
            card.classList.toggle('selected', checkbox.checked);
        });
    }

    deleteSelectedWords() {
        const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            this.showToast('Please select words to delete', 'warning');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected words?`)) {
            selectedCheckboxes.forEach(checkbox => {
                const wordId = checkbox.dataset.wordId;
                this.deleteWord(wordId);
            });
            this.renderManageWords();
            this.updateStats();
            this.showToast(`${selectedCheckboxes.length} words deleted successfully`, 'success');
        }
    }

    exportSelectedWords() {
        const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            this.showToast('Please select words to export', 'warning');
            return;
        }

        const selectedWords = [];
        selectedCheckboxes.forEach(checkbox => {
            const wordId = checkbox.dataset.wordId;
            const word = this.words.find(w => w.id === wordId);
            if (word) selectedWords.push(word);
        });

        const exportData = JSON.stringify(selectedWords, null, 2);
        this.downloadFile(exportData, `selected-words-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
        this.showToast(`${selectedWords.length} words exported successfully`, 'success');
    }

    editWord(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (!word) return;

        // For now, redirect to add word form with prefilled data
        this.showScreen('add-word');
        
        // Fill the form with existing data
        document.getElementById('new-word').value = word.word;
        document.getElementById('new-pronunciation').value = word.pronunciation || '';
        document.getElementById('new-meaning').value = word.meaning;
        document.getElementById('new-definition').value = word.definition || '';
        document.getElementById('new-synonyms').value = word.synonyms || '';
        document.getElementById('new-antonyms').value = word.antonyms || '';
        document.getElementById('new-examples').value = word.examples || '';
        document.getElementById('new-level').value = word.level || '';
        
        // Store the ID for updating instead of creating new
        this.editingWordId = wordId;
        
        // Change form title
        document.querySelector('#add-word-screen h2').textContent = 'Edit Word';
        document.querySelector('#add-word-form button[type="submit"]').textContent = 'Update Word';
    }

    deleteWordFromManage(wordId) {
        if (confirm('Are you sure you want to delete this word?')) {
            this.deleteWord(wordId);
            this.renderManageWords();
            this.updateStats();
            this.showToast('Word deleted successfully', 'success');
        }
    }

    // Practice Mode Navigation
    backToPracticeModes() {
        document.getElementById('practice-content').style.display = 'none';
        document.querySelectorAll('.practice-mode-btn').forEach(btn => btn.style.display = 'block');
        this.practiceMode.type = null;
    }

    // Enhanced start practice mode
    startPracticeMode(type) {
        if (this.words.length === 0) {
            this.showToast('Add some words first to start practicing!', 'warning');
            return;
        }

        this.practiceMode.type = type;
        this.practiceMode.currentQuestion = null;
        
        // Update the practice mode title
        const modeNames = {
            'flashcard': 'Flashcard Practice',
            'spelling': 'Spelling Practice', 
            'multiple-choice': 'Multiple Choice Practice',
            'listening': 'Listening Practice'
        };
        
        document.getElementById('current-practice-mode').textContent = modeNames[type] || 'Practice Mode';
        
        document.querySelectorAll('.practice-mode-btn').forEach(btn => btn.style.display = 'none');
        document.getElementById('practice-content').style.display = 'block';
        
        this.generatePracticeQuestion();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize speech synthesis voices
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = () => {
            // Voices are now loaded
        };
    }

    // Create and start the app
    window.vocabularyApp = new VocabularyApp();
});

// Service Worker Registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added here for offline functionality
    });
}
