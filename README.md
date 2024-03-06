# Sudoku-Angular

Welcome to Sudoku-Angular! This repository houses two applications: `sudoku-angular` and `sudoku-coop-backend`. These applications allow users to solve Sudoku puzzles and engage in cooperative puzzle-solving mode, respectively. Additionally, the project can be deployed using Docker Compose and is accessible in a production environment at https://sudoku.heloir.dev.

## Applications

### 1. sudoku-angular

The `sudoku-angular` application provides a platform for users to solve Sudoku puzzles interactively. To start the application locally, run the following command:

```bash
nx serve sudoku-angular
```

### 2. sudoku-coop-backend

The `sudoku-coop-backend` application enables cooperative sudoku. To initiate the backend for cooperative mode locally, use the following command:

```bash
nx serve sudoku-coop-backend
```

## Docker Compose

You can also utilize Docker Compose to start the project. Simply execute the following command in the root directory of the project:

```bash
docker-compose up
```

This command will build and start both `sudoku-angular` and `sudoku-coop-backend` applications in separate containers.

## Production Environment

The Sudoku-Angular project is deployed in a production environment accessible at [https://sudoku.heloir.dev](https://sudoku.heloir.dev). Visit the provided URL to experience Sudoku puzzle-solving online!

---

Thank you for using Sudoku-Angular! Enjoy solving Sudoku puzzles and cooperating with others! 🧩🌟
