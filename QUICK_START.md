# ⚡ QUICK START GUIDE

## 🚨 MOST IMPORTANT - DO THIS FIRST!

Your OpenAI API key is **EXPOSED** in your code. This is a critical security issue.

### Immediate Action (5 minutes):

1. **Open https://platform.openai.com/api-keys** in your browser

2. **Find and DELETE this key:**
   ```
   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
   ```

3. **Create a NEW key** and copy it

---

## 🏃 Quick Setup (10 minutes)

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

```bash
# 1. Install server dependencies
cd Server
npm install

# 2. Install client dependencies
cd ../Client
npm install

# 3. Done! Now configure (see below)
```

---

## ⚙️ Configuration (5 minutes)

### Step 1: Configure Server

Edit `Server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ai-interview-simulator
JWT_SECRET=PASTE_OUTPUT_FROM_COMMAND_BELOW
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=PASTE_YOUR_NEW_KEY_HERE
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Client is Already Configured

`Client/.env` was created automatically:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Run the App (2 minutes)

### Start MongoDB (if using local)
```bash
mongod
```

### Start Server (Terminal 1)
```bash
cd Server
npm run dev
```

You should see:
```
✓ Environment variables validated successfully
MongoDB Connected: localhost
Server running in development mode on port 5000
```

### Start Client (Terminal 2)
```bash
cd Client
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 418 ms
  ➜  Local:   http://localhost:5173/
```

### Open App
Navigate to: **http://localhost:5173**

---

## ✅ Verify Everything Works

1. Click **Register** and create an account
2. Click **Start Interview**
3. Select domain and difficulty
4. Answer questions
5. Submit and see results

If this works → You're all set! 🎉

---

## 🐛 Troubleshooting

### "Environment validation failed"
- Make sure you edited `Server/.env`
- Make sure JWT_SECRET is not the default value
- Make sure OPENAI_API_KEY starts with "sk-"

### "MongoDB connection error"
- Start MongoDB: `mongod`
- Or use MongoDB Atlas and update MONGO_URI

### "Network Error" in browser
- Make sure server is running on port 5000
- Check `Client/.env` has correct API URL

### "OpenAI API authentication failed"
- Verify your API key is correct
- Make sure you have credits in OpenAI account

### "Rate limit exceeded"
- Normal! Wait 15 minutes for general limits
- Wait 1 hour for interview creation limit

---

## 📚 Full Documentation

- **Complete Guide:** [README.md](README.md)
- **Security Info:** [SECURITY.md](SECURITY.md)
- **All Fixes Applied:** [FIXES_APPLIED.md](FIXES_APPLIED.md)

---

## 🎯 What Was Fixed

I analyzed your codebase and fixed **13 critical issues**:

### 🔴 Critical (Security)
1. ✅ Exposed API key documented (YOU must revoke it)
2. ✅ Missing client .env created
3. ✅ Insecure CORS fixed

### 🟠 High (Functionality)
4. ✅ Rate limiting added (prevents abuse)
5. ✅ Input validation added (prevents attacks)
6. ✅ Environment validation added
7. ✅ Database error handling improved
8. ✅ Security headers added (Helmet)

### 🟡 Medium (Quality)
9. ✅ Interview status tracking added
10. ✅ OpenAI retry logic added
11. ✅ React error boundary added
12. ✅ .gitignore fixed
13. ✅ Documentation created

---

## 🔐 Security Checklist

- [ ] Revoked exposed OpenAI key
- [ ] Created new OpenAI key
- [ ] Updated Server/.env with new key
- [ ] Generated strong JWT_SECRET
- [ ] Never commit .env files

---

## 💡 Pro Tips

1. **Development:**
   ```bash
   # Run both in split terminal
   npm run dev  # Auto-restarts on changes
   ```

2. **Check logs:** Server shows all requests with Morgan

3. **API testing:** Use the browser DevTools Network tab

4. **Rate limits:** Check headers for remaining requests

5. **MongoDB:** Use MongoDB Compass to view data

---

## 🆘 Need Help?

1. Check error messages carefully
2. Read [README.md](README.md) troubleshooting section
3. Review [SECURITY.md](SECURITY.md) for security questions
4. Check [FIXES_APPLIED.md](FIXES_APPLIED.md) for detailed explanations

---

**Estimated Total Setup Time:** 15-20 minutes

**Ready?** Start with Step 1: Revoke the exposed API key! 🔑
