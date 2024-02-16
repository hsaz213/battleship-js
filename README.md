# Battleship Game

## Overview

This Battleship game project is designed as a simple yet engaging web-based game where players strategically place ships on a 4x4 grid and attempt to sink their opponent's ships. The game features two main phases, ship placement and shooting, with the addition of AI as an opponent. Players can upgrade to a 5x5 grid, allowing for larger ships.

## Features

- **Dynamic Game Grid:** Starts with a 4x4 grid with options to upgrade to a 5x5 grid for larger ships.
- **Ship Placement:** Minimum of two 1x1 ships, placed non-adjacently, with diagonal placement allowed. Ships can be placed horizontally with a left-click and vertically with a right-click on larger grids.
- **Game Phases:**
  - **Placement Phase:** Players place their ships on the grid by clicking.
  - **Shooting Phase:** Players and AI take turns shooting at each other's grid by clicking.
- **AI Opponent:** The AI shoots randomly across the player's grid, potentially hitting the same spot twice.
- **Game Selection:** Predefined AI ship placements are available in the `data.js` file, with a `selectGame` function to start the game.
- **End Game:** The game ends when all ships are sunk.
- **Validation:** Ensure all game data is validated.
- **Messaging:** Use messaging to communicate with the player about game status and results.

## Getting Started

### Prerequisites

- A modern web browser.
- Basic knowledge of JavaScript, HTML, and CSS.

### Setup

1. Clone the repository to your local machine.
2. Open the `index.html` file in your web browser to start the game.

## Game Rules

- Ships cannot be placed adjacent to each other on the 4x4 grid but can be placed diagonally.
- On a 5x5 grid, players can place larger ships and choose their orientation using mouse clicks.
- The AI will place its ships based on predefined selections in `data.js`.
- Players move through the placement phase before entering the shooting phase against the AI.
- The game utilizes a maximum of 5 global variables to manage state.

## Development

This game was developed with simplicity in mind, focusing on the core gameplay mechanics of the classic Battleship game.

## Contributing

Contributions to the project are welcome. Please ensure that any pull requests or issues are clear and concise for review.

## License

This project is open-sourced under the MIT license.
