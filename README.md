
# CreatorHub 

CreatorHub is a full-stack freelance platform that connects **clients** and **creative professionals** (creators). It allows creators to showcase their portfolios, apply for jobs, and get hired, while clients can post jobs and manage applicants. Built with **Flask** (backend) and **React** (frontend), it also integrates **JWT Authentication**, **role-based access**, and **MPesa payment hooks** (placeholder in MVP).

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Seed Data](#seed-data)
- [Contributors](#contributors)
- [Future Enhancements](#future-enhancements)

---

## Features

###  For Creators:
- Signup/Login
- Edit profile and upload portfolio items
- Browse job listings
- Apply for jobs
- View application history

### For Clients:
- Signup/Login
- Post job opportunities
- View applicants for each job

### Shared:
- Role-based redirects (Creator, Client, Admin)
- JWT-based protected routes
- MPesa integration placeholder
- Logout and navigation controls
- Dark mode toggle (🌙)

---

## Technologies Used

**Frontend:**
- React 18+
- React Router DOM
- CSS (single `App.css`)
- LocalStorage for auth
- Fetch API

**Backend:**
- Python 3.8+
- Flask
- SQLAlchemy (v1.4)
- Flask-JWT-Extended
- Flask-Migrate
- Flask-CORS
- Dotenv for config
- SQLite (dev), PostgreSQL (prod ready)

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/creatorhub-platform.git
cd creatorhub-platform
```

### 2. Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set environment variables (or use `.env`)
export FLASK_APP=app.py
export DATABASE_URL=sqlite:///creatorhub.db
export JWT_SECRET_KEY=your_jwt_secret
export SECRET_KEY=your_flask_secret

# Run migrations & seed
flask db init
flask db migrate -m "Initial"
flask db upgrade
python seed.py

# Start server
flask run
```

### 3. Frontend Setup
```bash
cd client
npm install
npm start
```

> Ensure the backend is running at `http://localhost:5000` and frontend at `http://localhost:3000`.

---

## Project Structure

```
creatorhub-platform/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.css
├── server/              # Flask backend
│   ├── models.py
│   ├── routes.py
│   ├── seed.py
│   ├── app.py
│   ├── config.py
│   └── .env
```

---

## Seed Data

The backend includes test users with strong passwords like:

```json
{
  "email": "admin@example.com",
  "password": "Admin@2025",
  "role": "admin"
}
```

Use these for initial logins, or create new users via the signup form.

---

## Contributors

- **Nixon Ochieng**
- **Ahmed Bwire**
- **Moreen Karimi**
- **Ian Biombo**

---

## Future Enhancements

- Real MPesa integration via Daraja API
- Admin dashboard for platform control
- Profile picture uploads
- In-app messaging (chat)
- Email notifications for job updates

---

## License

This project is licensed for educational use under MIT. You're welcome to build on it.