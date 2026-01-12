# **App Name**: Time Debt Ledger

## Core Features:

- GitHub Commit Repayment: Allow users to repay time debt by submitting GitHub commits. Validate commit exists with the correct timestamp. Time credit is fixed per commit between 30-60 minutes.
- Video-Based Learning Repayment: Enable debt repayment through verifiable outputs from video-based learning. Users select Structured Recall, Diagram Reconstruction, or Teach-Back Explanation for time credit between 30-60 minutes.
- Time Continuity Enforcement: Stores the last recorded timestamp per user and enforces mandatory reconciliation if the time gap exceeds 10 minutes.
- Mandatory Reconciliation: Presents a reconciliation screen on app open, prompting users to account for time gaps since their last record. Allows users to classify the time as 'Worked,' 'Distracted,' or 'Mixed'.
- Debt Calculation: Calculates time debt based on 'Distracted' time and adds it to the user's outstanding time debt, which persists and cannot be reset.
- Proof of Work Submission: Enables users to submit proof of 'Worked' time via LeetCode, Codeforces, CSES, SPOJ, GitHub, or video submissions. The amount of debt paid off is associated to the difficulty of the work as well as validation of work existence and the timestamp
- Time Credit Validation: Uses Firebase Cloud Functions to validate the existence of code submissions, diagram, structured recall, teach back, etc. Verifies commit timestamps and awards time credits based on difficulty. It will use an LLM as a tool for diagram/teachback grading.
- Debt Display: Displays outstanding time debt in hours and minutes on the home screen, serving as the app's primary feedback mechanism.
- Data Storage: Firestore to manage the logic, persistance, and data associated to the Debt Ledger

## Style Guidelines:

- Background color: Light gray (#F5F5F5) to create a neutral and unobtrusive backdrop.
- Primary color: Dark blue (#3F51B5) for a sense of seriousness and accountability.
- Accent color: A desaturated violet color (#9575CD) that is similar in hue to the dark blue primary, but less saturated, to visually offset time debt and UI warnings from general UI features.
- Body and headline font: 'Inter' sans-serif font, as it offers a modern and neutral appearance suitable for both headlines and body text. 'Inter' is designed for readability, which is crucial for the time-accounting ledger.
- Simple, monochrome icons to represent actions and categories, avoiding any playful or distracting designs.
- A minimalist layout with clear, distinct sections for displaying time debt and recording time entries. Use a single-column layout to ensure focus and clarity.
- Subtle transitions for updating the time debt display, providing a sense of continuity without being distracting.