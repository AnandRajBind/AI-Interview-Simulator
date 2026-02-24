# AI Interview Simulator

A full-stack application for conducting AI-powered technical interviews with automatic evaluation.

## 🚨 IMPORTANT SECURITY NOTICE

**BEFORE YOU START:** 
1. **NEVER commit the `.env` file to version control!**
2. The OpenAI API key in your current `.env` is **EXPOSED** and should be **REVOKED IMMEDIATELY**
3. Get a new API key at: https://platform.openai.com/api-keys

## 🏗️ Project Structure

```
AI-Interview-Simulator/
├── Client/          # React frontend (Vite)
├── Server/          # Express backend
└── README.md        # This file
```

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (running locally or MongoDB Atlas)
- OpenAI API key

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd Server
npm install

# Install client dependencies
cd ../Client
npm install
```

### 2. Configure Server Environment

```bash
cd Server
# Copy the example env file
cp .env.example .env
```

Edit `Server/.env` with your actual values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ai-interview-simulator
JWT_SECRET=your_secure_random_string_here_min_32_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=your_actual_openai_key_here
```

**⚠️ Important:**
- Generate a strong `JWT_SECRET` (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Get your `OPENAI_API_KEY` from https://platform.openai.com/api-keys
- **REVOKE** the exposed key if you committed .env to git

### 3. Configure Client Environment

```bash
cd Client
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas and update MONGO_URI accordingly
```

### 5. Run the Application

**Terminal 1 - Start Server:**
```bash
cd Server
npm run dev
```

Server will run at: http://localhost:5000

**Terminal 2 - Start Client:**
```bash
cd Client
npm run dev
```

Client will run at: http://localhost:5173

## 🔧 Available Scripts

### Server
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🛡️ Security Features

✅ **Implemented:**
- JWT authentication
- Password hashing with bcrypt
- Rate limiting (prevents API abuse)
- CORS configuration
- Helmet security headers
- Input validation
- Environment variable validation
- Interview status tracking (prevents re-submission)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Interviews
- `POST /api/interviews/start` - Start new interview
- `POST /api/interviews/submit` - Submit interview answers
- `GET /api/interviews/history` - Get user's interview history

### Health
- `GET /api/health` - Health check

## 🐛 Common Issues & Solutions

### Issue: "Environment validation failed"
**Solution:** Make sure all required environment variables are set in `Server/.env`

### Issue: "MongoDB connection error"
**Solution:** 
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- For local MongoDB: `mongodb://localhost:27017/ai-interview-simulator`

### Issue: "OpenAI API authentication failed"
**Solution:** 
- Verify your API key is correct
- Check you have credits in your OpenAI account
- Key should start with `sk-`

### Issue: "Rate limit exceeded"
**Solution:** 
- Wait 15 minutes for general API limits
- Wait 1 hour for interview creation limits
- Limits are per IP address

### Issue: "CORS error in browser"
**Solution:** 
- Ensure `CLIENT_URL` in `Server/.env` matches your frontend URL
- Default should be `http://localhost:5173`

## 📦 Production Deployment

### Environment Variables for Production

Update these in your `.env`:
```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=very_strong_random_string_min_32_chars
```

### Build Client
```bash
cd Client
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Deploy Server
- Set all environment variables in your hosting platform
- Ensure MongoDB is accessible
- Deploy the Server folder

## 🔐 Security Checklist Before Going Live

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use HTTPS for both client and server
- [ ] Use MongoDB Atlas or secured MongoDB instance
- [ ] Update `CLIENT_URL` to your production domain
- [ ] Enable MongoDB authentication
- [ ] Review and adjust rate limits
- [ ] Set up monitoring and logging
- [ ] Never commit `.env` files
- [ ] Rotate API keys regularly

## 📝 Features

- User authentication (register/login)
- AI-generated interview questions based on domain and difficulty
- Real-time interview interface
- Automatic answer evaluation using GPT-3.5
- Score feedback and detailed evaluation
- Interview history tracking
- Responsive UI with TailwindCSS

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios
- TailwindCSS
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- OpenAI API (GPT-3.5)
- JWT authentication
- Helmet (security)
- Express Rate Limit

## 📄 License

ISC

## 🤝 Support

For issues and questions:
1. Check the Common Issues section above
2. Review error messages carefully
3. Ensure all dependencies are installed
4. Verify environment variables are set correctly

---

**Remember:** Always keep your API keys and secrets secure!
