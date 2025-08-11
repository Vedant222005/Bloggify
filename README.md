# Blogging Application

A full-stack blogging application built with Express.js, MongoDB, and EJS.

## Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- User profiles with image uploads
- Like and comment system
- Responsive design with Tailwind CSS
- Session management with JWT tokens

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens, Passport.js
- **Frontend**: EJS templates, Tailwind CSS
- **File Upload**: Multer
- **Session Management**: Express-session, Connect-flash

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blogging-application
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
MONGO_URI=your-mongodb-connection-string
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
PORT=8000
NODE_ENV=development
```

5. Build CSS (if using Tailwind):
```bash
npm run build:css
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8000`

## Production Deployment

### Option 1: Heroku

1. Create a Heroku account and install Heroku CLI
2. Create a new Heroku app:
```bash
heroku create your-app-name
```

3. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your-production-mongodb-uri
heroku config:set SESSION_SECRET=your-production-session-secret
heroku config:set JWT_SECRET=your-production-jwt-secret
```

4. Deploy:
```bash
git push heroku main
```

### Option 2: Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Option 3: Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 4: DigitalOcean App Platform

1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic scaling

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `PORT` | Server port | No | 8000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `SESSION_SECRET` | Secret for session encryption | Yes | - |
| `JWT_SECRET` | Secret for JWT token signing | Yes | - |

## Project Structure

```
blogging-application/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Database models
├── public/         # Static files
├── routes/         # Route definitions
├── services/       # Business logic
├── views/          # EJS templates
├── index.js        # Main application file
├── package.json    # Dependencies and scripts
└── .env            # Environment variables
```

## API Endpoints

- `GET /` - Home page with all blogs
- `GET /user/signup` - User registration page
- `GET /user/login` - User login page
- `GET /blog/create` - Create new blog page
- `GET /blog/:id` - View specific blog
- `POST /user/signup` - User registration
- `POST /user/login` - User login
- `POST /blog/create` - Create new blog
- `PUT /blog/:id` - Update blog
- `DELETE /blog/:id` - Delete blog

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@example.com or create an issue in the repository.
