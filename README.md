# Scribe Management System

A full-stack operational dashboard designed to orchestrate scribe allocations for visually impaired individuals during examinations. 

This system replaces manual, error-prone tracking with a relational database and a modern, responsive React interface, ensuring visually impaired persons are accurately matched with available volunteer scribes.

## ✨ Key Features

*   **Modern Unified Dashboard:** A responsive, Tailwind-powered UI featuring persistent sidebar navigation and real-time operational metric cards.
*   **Dynamic Resource Allocation:** Schedule examinations using smart dropdowns that fetch and cross-reference live data, eliminating database ID typos.
*   **Live Status Tracking:** Automatically calculates and displays assignment statuses (e.g., *Available* vs. *Assigned* for volunteers, *Matched* vs. *Needs Scribe* for visually impaired persons).
*   **Feedback Repository:** A dedicated module for coordinators and administrators to log and track 1-5 star ratings and comments on specific scribe assignments.
*   **Robust REST API:** A structured Node.js/Express backend handling asynchronous MySQL database operations.

---

## 🛠 Technology Stack

### Frontend Architecture
*   **Framework:** React.js
*   **Styling & UI:** Tailwind CSS (via CDN)
*   **State Management:** React Hooks (`useState`, `useEffect`)

### Backend Architecture
*   **Runtime:** Node.js
*   **API Framework:** Express.js
*   **Database:** MySQL (via `mysql2` driver)
*   **Middleware:** CORS, dotenv

---

## 📂 Project Structure

```text
Scribe-Management/
│
├── scribe-frontend/          # React.js SPA (Client)
│   ├── public/
│   │   └── index.html        # Entry point & Tailwind CDN injection
│   ├── src/
│   │   ├── App.js            # Main dashboard shell & routing
│   │   ├── Volunteers.js     # Volunteer roster & registration
│   │   ├── Persons.js        # Visually impaired persons directory
│   │   ├── Examinations.js   # Allocation & scheduling engine
│   │   ├── Coordinators.js   # Center coordinator tracking
│   │   └── Feedback.js       # Assignment review system
│   └── package.json
│
├── scribe-backend/           # Node.js API (Server)
│   ├── server/
│   │   └── server.js         # Express server & API routes
│   ├── .env                  # Environment variables (Database credentials)
│   └── package.json
│
├── database_setup.sql        # MySQL schema & table definitions
├── .gitignore
└── README.md


🚀 Getting Started
1. Prerequisites
Ensure you have the following installed on your local machine:

Node.js (v14 or higher)

MySQL Server

2. Database Initialization
Open your MySQL client (e.g., MySQL Workbench or CLI).

Execute the queries inside database_setup.sql to create the scribe_db database and its relational tables.

3. Backend Setup
Open a terminal and navigate to the backend directory:

Bash
cd Scribe-Management/scribe-backend
Install the server dependencies:

Bash
npm install
Create a .env file in the scribe-backend/server directory and add your database credentials:

Code snippet
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=scribe_db
PORT=5000
Start the API server:

Bash
node server/server.js
4. Frontend Setup
Open a new terminal window and navigate to the frontend directory:

Bash
cd Scribe-Management/scribe-frontend
Install the client dependencies:

Bash
npm install
Boot the React development server:

Bash
npm start
The application will automatically open in your browser at http://localhost:3000.

🛡️ License
This project is open-source and available under the MIT License.
