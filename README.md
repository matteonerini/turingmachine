# 🖥️ Turing Machine

A **Turing Machine Simulator** built for educational purposes. 

Check out the simulator here: https://matteonerini.github.io/turingmachine.

---

## 🛠️ How to Use

### 1. Define the Quintuples
The machine follows the standard state transition format:
`current_state, read_symbol, next_state, write_symbol, direction`.

The direction is indicated as: `R` (Right), `L` (Left), `N` (None).

### 2. Set the Input
Type your initial tape values into the **Input** field (e.g., `1011`).

### 3. Run the Machine
* Click **Initialize** to load your input string.
* Use **Step** to move through the logic one transition at a time.
* Click **Run** to watch the Turing Machine solve the problem at your chosen speed.

---

## 📂 Project Structure
This project is organized into the following files:

* `index.html` - The structural skeleton.
* `style.css` - Custom glassmorphic styling and animations.
* `script.js` - The Turing Machine and UI logic.
