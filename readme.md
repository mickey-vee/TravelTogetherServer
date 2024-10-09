# Travel Together Backend

## Overview

This is the backend for the Travel Together app, designed to facilitate group trip planning by managing events, accommodations, and expenses.

## Tech Stack

- **Framework:** Express.js
- **Database:** MySQL

## Installation

### Prerequisites

- Node.js (v14.x or later)
- MySQL

### Setup

1. Clone the repository:

   ```
   git clone https://github.com/your-repo-url.git
   cd your-repo-directory
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run migrations to set up the database:

   ```
   npx knex migrate:latest
   ```

### Environment Variables

Create a `.env` file in the root directory with the following content:

```
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

Replace `your_database_host`, `your_database_name`, `your_database_user`, and `your_database_password` with your actual database credentials.
