# Ring Sort Puzzle

A relaxing and addictive 3D puzzle game where the objective is to sort colored rings onto poles. Enjoy beautiful graphics, smooth animations, and challenging levels!

## 🎮 Game Description

**Ring Sort Puzzle** provides a 3D sorting experience. Players need to move rings between poles to group them by color. The game features multiple difficulty levels, special mechanics like locked poles and mystery modes, and a rewarding progression system.

## ✨ Features

- **3D Graphics:** Immersive 3D visuals powered by Three.js.
- **Multiple Levels:** Procedurally generated levels with increasing difficulty.
- **Game Modes:**
  - Standard Sorting
  - **Mystery Mode:** Some rings are hidden until revealed.
  - **Locked Poles:** Unlock poles by clearing specific rings.
- **Tools & Helpers:**
  - **Undo:** Made a mistake? Step back!
  - **Hint:** Get a helping hand when stuck.
- **Localization:** Supports **English**, **Turkish** (Türkçe), and **Russian** (Русский).
- **Progress Saving:** Your progress and stars are saved automatically using LocalStorage.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.
- **PWA Support:** Installable as a Progressive Web App (manifest included).
- **Yandex Games Integration:** Ready for publication on Yandex Games with SDK integration for ads and environment detection.

## 🕹️ How to Play

1.  **Select a Pole:** Click or tap on a pole to select the top ring.
2.  **Move the Ring:** Click or tap on another pole to move the selected ring.
    - You can only move a ring on top of another ring of the **same color** or onto an **empty pole**.
    - The target pole must have space (max capacity is usually 4 rings).
3.  **Level Complete:** The level is finished when all rings are sorted by color onto separate poles.

## 🛠️ Technologies Used

- **HTML5 & CSS3:** Core structure and styling.
- **JavaScript (ES6+):** Game logic and state management.
- **[Three.js](https://threejs.org/):** 3D rendering engine.
- **Web Audio API:** For sound effects (generated programmatically).
- **Yandex Games SDK:** For platform integration.

## 🚀 Local Development Setup

To run the game locally on your machine:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ring-sort-puzzle
    ```

2.  **Serve the files:**
    Because the game uses ES modules and loads resources (like `three.min.js`), you need to serve it using a local web server to avoid CORS issues.

    You can use Python's built-in HTTP server:
    ```bash
    # Python 3
    python -m http.server 8000
    ```
    Or Node.js `http-server`:
    ```bash
    npx http-server .
    ```

3.  **Play:**
    Open your browser and navigate to `http://localhost:8000`.

## 📂 Project Structure

- `index.html`: Main entry point.
- `game.js`: Core game logic, state management, and input handling.
- `levels.js`: Level generation logic.
- `styles.css` / `mobile.css`: Styling for the UI.
- `three.min.js`: 3D library.
- `yandex-sdk.js`: SDK wrapper/mock.
- `manifest.json` & `sw.js`: PWA configuration.

## 📜 License

This project is open for educational purposes.

---
*Enjoy sorting!*
