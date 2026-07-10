# Task 4: Complex Form Validation and DOM Manipulation

## Objective
Implement dynamic user experiences using client-side JavaScript, single-page application routing, advanced input validations, and runtime DOM modifications.

## Steps Completed
1. Built a single-page application (SPA) shell utilizing client-side hash routing (`#home` vs `#register`).
2. Programmed real-time input verification for email addresses using regex patterns.
3. Created an interactive, multi-stage password strength analyzer featuring dynamic color‑coded indicator bars.
4. Leveraged dynamic DOM manipulation, enabling users to add or remove project link inputs at runtime.
5. Handled event triggers to prevent page refreshes on form submit while notifying validation success.

## File Structure
```
task4/
├── index.html         # SPA containing structure, CSS styling, and DOM JavaScript
└── README.md          # This file
```

## How to Run
1. Navigate to the `task4` directory:
   ```bash
   cd task4
   ```
2. Open `index.html` in your web browser (or serve it locally using a simple file server).
   - Alternatively, double-click `index.html` in Windows Explorer.
3. Click "Register Form" in the navbar.
4. Input credentials to observe real-time validation and password complexity scores.
5. Try adding and deleting dynamic project links.

## Validation & DOM Logic
- **Hash Routing:** The hashchange event checks the location hash and updates active class states on target sections and navbar links.
- **Email Regex:** Checks input matching against `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- **Password Strength Metric:** Evaluates the presence of lowercase, uppercase, numerical, and special characters. Assigns a score of 1–4, shifting the gauge width and color from Red (Weak) to Yellow (Moderate) to Green (Excellent).
- **Dynamic Elements:** The add/remove logic constructs elements (`div`, `input`, `button`), sets attributes, binds action listeners to remove elements, and appends them to a container.

## Learning Outcomes
- Designing light single-page navigation structures using vanilla browser API logic.
- Binding event listeners to input elements for real-time validation feedback.
- Understanding node creation (`document.createElement`), insertion (`appendChild`), and removal (`element.remove`) in modern JS.
- Crafting dynamic, secure client-side form experiences.
