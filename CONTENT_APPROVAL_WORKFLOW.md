# Content Approval Workflow Guide

## 🎯 **Overview**
This workflow ensures content changes are reviewed before going live. Changes are made in a development dataset, tested locally, then approved and published to production.

## 📋 **Complete Workflow Steps**

### **Step 1: Set Up Development Environment**
```bash
# Copy current production data to development dataset
node scripts/setup-dev-environment.js
```

### **Step 2: Make Content Changes**
1. **Go to Sanity Studio**: `https://innstastay.sanity.studio/`
2. **Ensure you're in Development dataset** (check dataset selector)
3. **Edit hotel content**:
   - Hotel names, descriptions, addresses
   - Image URLs, booking links
   - Amenities, tags, ratings
   - SEO titles and descriptions
4. **Publish changes** in Sanity Studio

### **Step 3: Test Changes Locally**
```bash
# Start development server (uses development dataset)
npm run dev
```

1. **Visit local website**: `http://localhost:3000`
2. **Check admin interface**: `http://localhost:3000/admin`
3. **Verify changes appear correctly**
4. **Test search functionality**
5. **Check individual hotel pages**

### **Step 4: Approve and Publish**
```bash
# When satisfied with changes, approve them
node scripts/approve-content.js
```

This script:
- Fetches all hotels from development dataset
- Updates existing hotels in production dataset
- Creates new hotels if they don't exist
- Reports what was updated/created

### **Step 5: Commit to Git**
```bash
# Commit your approval decision
git add .
git commit -m "Approve content changes: [describe what was changed]"
git push origin main
```

## 🔄 **Workflow Diagram**
```
Sanity Studio (Development) → Local Testing → Approval Script → Production → Git Commit
```

## 📁 **Key Files**
- `scripts/setup-dev-environment.js` - Sets up development dataset
- `scripts/approve-content.js` - Approves changes to production
- `lib/sanity.ts` - Uses development dataset in dev mode
- `sanity/env.ts` - Configures dataset selection

## ⚠️ **Important Notes**
- **Development server** (`npm run dev`) uses development dataset
- **Production server** uses production dataset
- **Always test locally** before approving
- **Changes in development** don't affect live site
- **Approval script** moves changes from dev to production

## 🚨 **Emergency Rollback**
If you need to revert changes:
1. Edit in Sanity Studio (production dataset)
2. Revert the specific changes
3. Publish immediately

## 📝 **Example Workflow**
```bash
# 1. Set up development environment
node scripts/setup-dev-environment.js

# 2. Make changes in Sanity Studio (development dataset)

# 3. Test locally
npm run dev
# Visit http://localhost:3000/admin to verify changes

# 4. Approve changes
node scripts/approve-content.js

# 5. Commit to Git
git add .
git commit -m "Approve hotel description updates"
git push origin main
```

## 🎯 **Benefits**
- ✅ Safe editing environment
- ✅ Review process before going live
- ✅ Version control for content decisions
- ✅ No accidental live changes
- ✅ Easy rollback capability
