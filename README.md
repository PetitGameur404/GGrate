# GGRate

GGRate is a website to review video games. Pick a game from the library, submit a review with your Steam username, a star rating out of 5 and a description, and see what the community thinks.

**Live demo:** https://rategg.lucahallet.com

## Features

- Game library displayed as cards
- Submit a review (Steam username, rating out of 5, description)
- Latest community reviews on the Games page
- Home page and shared navbar

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Hosting:** self-hosted on Proxmox, managed with PM2, exposed with a Cloudflare Tunnel (HTTPS)

## Run Locally

```bash
git clone https://github.com/PetitGameur404/GGrate/
cd GGrate/backend
npm install
```

Create a `.env` file in `backend/`:

```env
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
PORT=3000
```

Start the server:

```bash
node server.js
```

Then open http://localhost:3000

## API

| Method | Route      | Description                                                |
|--------|------------|------------------------------------------------------------|
| GET    | `/heal`    | Health check                                               |
| GET    | `/reviews` | List reviews (optional `?game=` filter)                    |
| POST   | `/test`    | Add a review (`steamuser`, `game`, `stars`, `description`) |

## Known Limitations

- After submitting a review, you have to manually go back to the Games page to see it.
- The navbar search bar is visual only.
- Contact and About pages are not done yet.

## Team

This project was developed by two people: Luca Hallet and Arthur Laffont.
