# GripInvest Backend

## Overview
A mini investment platform using Node.js, Express, and MySQL with Indian context.

## Setup
1. Clone repo: `git clone https://github.com/yourusername/gripinvest_winter_internship_backend.git`
2. Install dependencies: `npm install`
3. Create `.env` with DB and JWT settings (see `.env.example`).
4. Start XAMPP MySQL, import `schema.sql` into `grip_invest` DB.
5. Run: `node src/app.js`

## API Endpoints
- `POST /auth/signup`: Create user (201)
- `POST /auth/login`: Get token (200)
- `GET /products`: List products (200)
- `POST /investments`: Invest (201)
- `GET /investments/portfolio`: View portfolio (200)

## AI Integration
Used Grok AI to debug and optimize code, enhancing reliability.

## Testing
Manual testing via Postman; Jest coverage at 56.67% (work in progress).