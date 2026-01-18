# 🧩 WordScramble: Premium Gaming Experience

A sleek, modern, and highly addictive Word Scramble game built as a high-performance **Frontend Application**. Experience a premium UI with glassmorphism effects, dynamic word fetching via professional APIs, and an intelligent hint system.

![Project Status](https://img.shields.io/badge/Status-Complete-success)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20JS%20%7C%20CSS3-blue)

---

## ✨ Features

- **🌐 Robust Word Engine**: Powered entirely by the [Wordnik API](https://developer.wordnik.com/), ensuring a vast and professional-grade vocabulary.
- **📖 Intelligent Hint System**: Stuck? Get strategic help with a 3-tab hint system:
  - 📝 **Definitions**: Detailed dictionary definitions to identify the word.
  - 🔗 **Synonyms**: Alternative words with similar meanings.
  - ↔️ **Antonyms**: Opposite words to help narrow your search.
- **🧠 Enhanced Lookup Logic**: Implements `useCanonical` matching to handle plurals and inflected forms, ensuring definitions and hints are found even for complex word variations.
- **💎 Premium Apple-Inspired UI**:
  - **Vibrant Aesthetics**: A high-contrast, bright design featuring 135° linear gradients and gold highlights.
  - **Glassmorphism**: A stunning, modern translucent card aesthetic using `backdrop-filter`.
  - **Dynamic Background**: Fluid, animated floating gradient blobs for an immersive feel.
  - **Fully Responsive**: Seamlessly scales from desktop monitors to mobile phones.
  - **Micro-interactions**: Smooth transitions, "Correct" success pops, and shake animations for errors.
- **🏆 Persistence & Scoring**:
  - Real-time score tracking.
  - **Best Score** persistence using browser LocalStorage.
- **⌨️ Intuitive Controls**: Full keyboard support (Enter to check) and a clean, accessible interface.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript (ES6+) |
| **Typography** | Outfit (Google Fonts) |
| **Word Engine** | Wordnik API (Random Words, Definitions, Synonyms, Antonyms) |

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser.
- A [Wordnik API Key](https://developer.wordnik.com/).

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/RakshitKashyap1/WordScramble.git
   cd WordScramble
   ```

2. **Configure API Key**
   Open `static/js/script.js` and locate the `WORDNIK_API_KEY` constant to ensure your key is active.

3. **Launch the Game**
   Simply open `index.html` in your browser, or serve it using a local server (e.g., Live Server in VS Code).

---

## 🎨 Design Philosophy
WordScramble is designed to be visually stunning and "alive." Instead of a static interface, we use CSS animations and HSL-based color palettes to create a premium feel. The "Apple-inspired" aesthetic focuses on white space, soft shadows (20px-60px), and clean typography, moving away from generic designs to provide a first-class gaming experience.

---

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request if you have ideas for new features or styling improvements.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
