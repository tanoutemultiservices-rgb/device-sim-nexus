# Hostinger Deployment Guide

## Prerequisites
- Node.js installed locally
- GitHub repository connected
- Hostinger hosting account

## Deployment Steps

### 1. Build the Project Locally

```bash
# Clone your repository
git clone <your-github-repo-url>
cd <your-project-name>

# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist` folder with your production-ready files.

### 2. Upload to Hostinger

#### Option A: File Manager
1. Log in to Hostinger control panel
2. Go to File Manager
3. Navigate to `public_html` directory
4. Delete existing files (if any)
5. Upload all contents from the `dist` folder
6. Make sure `.htaccess` file is uploaded (enable "Show hidden files" if needed)

#### Option B: FTP
1. Use an FTP client (FileZilla, WinSCP, etc.)
2. Connect using your Hostinger FTP credentials
3. Navigate to `public_html`
4. Upload all contents from `dist` folder
5. Ensure `.htaccess` is uploaded

### 3. Configure Domain

- If using custom domain: Point your domain to Hostinger nameservers
- If using subdomain: Configure in Hostinger control panel under Domains

### 4. Verify Deployment

Visit your domain and test:
- All routes work correctly (e.g., /devices, /sim-cards)
- Images load properly
- No console errors

## Important Notes

- The `.htaccess` file enables proper routing for React Router
- Always build locally before uploading (don't upload source code)
- For updates: rebuild and re-upload the `dist` folder contents

## Troubleshooting

**Routes return 404:**
- Ensure `.htaccess` file is present in `public_html`
- Check if mod_rewrite is enabled on your hosting plan

**Images not loading:**
- Verify all files from `dist/assets` folder were uploaded
- Check file permissions (usually 644 for files, 755 for folders)

**Blank page:**
- Check browser console for errors
- Verify all files were uploaded correctly
- Check if base path in vite.config.ts matches your hosting setup
