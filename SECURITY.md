# 🔒 Security Policy

## 🚨 Critical Security Issues in Your Codebase

### 1. **EXPOSED API KEY** (Severity: CRITICAL)
**Current Status:** Your OpenAI API key is visible in the `.env` file.

**Immediate Actions Required:**
1. Go to https://platform.openai.com/api-keys
2. **Revoke** the exposed key immediately
3. Generate a new API key
4. Update your local `.env` file with the new key
5. **NEVER** commit `.env` files to version control

**The exposed key:**
```
sk-proj-n1Qo4iPyEkAMe6-X0mBZhxP7ILMbqBZdvd4GqVgc2zCNH4rX2xYtA9dfGyGiNY...
```

### 2. Weak JWT_SECRET
**Issue:** Default/weak JWT secret compromises authentication.

**Fix:** Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ✅ Security Measures Implemented

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Protected routes with middleware
- ✅ Token expiration (7 days)

### Rate Limiting
- ✅ General API: 100 requests per 15 minutes
- ✅ Auth endpoints: 5 attempts per 15 minutes
- ✅ Interview creation: 10 per hour

### Input Validation
- ✅ Request body validation
- ✅ ObjectId format validation
- ✅ String length limits
- ✅ Email format validation
- ✅ Type checking

### API Security
- ✅ CORS configured with specific origin
- ✅ Helmet security headers
- ✅ JSON body size limit (10MB)
- ✅ Retry logic with exponential backoff
- ✅ OpenAI API error handling

### Data Protection
- ✅ Passwords excluded from query results
- ✅ Interview ownership verification
- ✅ Prevent double submission
- ✅ MongoDB injection protection via Mongoose

## 🛡️ Security Best Practices

### For Development

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` as template
   - Rotate secrets regularly

2. **Dependencies**
   - Keep packages updated: `npm audit`
   - Review security advisories
   - Use `npm audit fix` for patches

3. **Code Review**
   - No hardcoded secrets
   - Validate all user inputs
   - Check for SQL/NoSQL injection

### For Production

1. **HTTPS Only**
   ```javascript
   // Add to app.js in production
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

2. **MongoDB Security**
   - Enable authentication
   - Use connection string with credentials
   - Whitelist IP addresses
   - Regular backups

3. **Environment Configuration**
   ```env
   NODE_ENV=production
   # Use strong secrets
   JWT_SECRET=<64+ character random string>
   # Specific CORS origin
   CLIENT_URL=https://your-actual-domain.com
   # Secured MongoDB
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   ```

4. **Rate Limiting** (adjust as needed)
   - Monitor abuse patterns
   - Adjust limits based on usage
   - Consider IP whitelisting for known clients

## 📋 Security Checklist

### Before First Deployment
- [ ] Revoke exposed OpenAI API key
- [ ] Generate new strong JWT_SECRET (min 32 bytes)
- [ ] Remove any test/default credentials
- [ ] Review all environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up MongoDB authentication
- [ ] Review rate limits

### Regular Maintenance
- [ ] Rotate API keys monthly
- [ ] Update dependencies (`npm audit`)
- [ ] Review access logs
- [ ] Monitor OpenAI usage/costs
- [ ] Check for failed auth attempts
- [ ] Backup database regularly

## 🐛 Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

If you discover a security vulnerability:
1. Do not disclose publicly
2. Contact repository maintainer directly
3. Provide detailed reproduction steps
4. Allow time for patch before disclosure

## 🔄 Patch Process

When security issues are found:
1. Assess severity (Critical/High/Medium/Low)
2. Develop and test patch
3. Deploy to production ASAP for critical issues
4. Update dependencies
5. Document in changelog

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

## 🔐 Password Policy Recommendations

Current: Minimum 6 characters (too weak for production)

**Recommended for Production:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Not in common password list

Update `User.model.js` validation:
```javascript
password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [8, 'Password must be at least 8 characters'],
  validate: {
    validator: function(v) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v);
    },
    message: 'Password must contain uppercase, lowercase, number, and special character'
  }
}
```

---

**Last Updated:** February 23, 2026
**Security Review Date:** [Schedule regular reviews]
