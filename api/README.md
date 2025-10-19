# Dashboard API - PHP MySQL Backend

Complete REST API for the dashboard application with MySQL database.

## Setup Instructions

### 1. Database Setup

1. Log in to your Hostinger control panel
2. Go to **MySQL Databases**
3. Create a new database (e.g., `dashboard_db`)
4. Create a database user with all privileges
5. Import the `database.sql` file using phpMyAdmin or MySQL command line:
   ```bash
   mysql -u your_username -p dashboard_db < database.sql
   ```

### 2. Configure Database Connection

Edit `config/database.php` and update these values:
```php
private $host = "localhost";           // Usually localhost on Hostinger
private $database_name = "your_database_name";  // Your database name
private $username = "your_database_user";       // Your database username
private $password = "your_database_password";   // Your database password
```

### 3. Upload API Files to Hostinger

Upload the entire `api` folder to your Hostinger hosting:
- Via File Manager: Upload to `public_html/api/`
- Via FTP: Upload to `public_html/api/`

Your API structure should look like:
```
public_html/
├── api/
│   ├── config/
│   │   └── database.php
│   ├── devices.php
│   ├── simcards.php
│   ├── users.php
│   ├── activations.php
│   ├── topups.php
│   └── database.sql
└── (your React build files)
```

### 4. Test API Endpoints

Visit these URLs to test (replace yourdomain.com with your actual domain):

- Devices: `https://yourdomain.com/api/devices.php`
- SIM Cards: `https://yourdomain.com/api/simcards.php`
- Users: `https://yourdomain.com/api/users.php`
- Activations: `https://yourdomain.com/api/activations.php`
- Top-ups: `https://yourdomain.com/api/topups.php`

You should see JSON responses with data from your database.

### 5. Update React Frontend

Update your React app to use the API instead of mock data. Create an API configuration file:

```typescript
// src/config/api.ts
export const API_BASE_URL = 'https://yourdomain.com/api';

export const API_ENDPOINTS = {
  devices: `${API_BASE_URL}/devices.php`,
  simcards: `${API_BASE_URL}/simcards.php`,
  users: `${API_BASE_URL}/users.php`,
  activations: `${API_BASE_URL}/activations.php`,
  topups: `${API_BASE_URL}/topups.php`,
};
```

## API Endpoints

### Devices API (`/api/devices.php`)

- **GET** - Get all devices or single device
  - All: `GET /api/devices.php`
  - Single: `GET /api/devices.php?id=device_id`
- **POST** - Create new device
  - Body: `{ id, name, brand, os, status, lastConnect, ip, simCards }`
- **PUT** - Update device
  - Body: `{ id, name, brand, os, status, lastConnect, ip, simCards }`
- **DELETE** - Delete device
  - `DELETE /api/devices.php?id=device_id`

### SIM Cards API (`/api/simcards.php`)

- **GET** - Get all SIM cards or single SIM card
  - All: `GET /api/simcards.php`
  - Single: `GET /api/simcards.php?id=sim_id`
- **POST** - Create new SIM card
  - Body: `{ operator, number, todayActivations, todayTopups, connected, balance, activationStatus, topupStatus, device, lastConnect }`
- **PUT** - Update SIM card
  - Body: `{ id, operator, number, ... }`
- **DELETE** - Delete SIM card
  - `DELETE /api/simcards.php?id=sim_id`

### Users API (`/api/users.php`)

- **GET** - Get all users or single user
  - All: `GET /api/users.php`
  - Single: `GET /api/users.php?id=user_id`
- **POST** - Create new user
  - Body: `{ id, username, nom, prenom, tel, email, status, balance, device, role }`
- **PUT** - Update user
  - Body: `{ id, username, nom, prenom, tel, email, status, balance, device, role }`
- **DELETE** - Delete user
  - `DELETE /api/users.php?id=user_id`

### Activations API (`/api/activations.php`)

- **GET** - Get all activations or single activation
  - All: `GET /api/activations.php`
  - Single: `GET /api/activations.php?id=activation_id`
- **POST** - Create new activation
  - Body: `{ operator, phoneNumber, ussdCode, status, user, dateResponse?, msgResponse? }`
- **PUT** - Update activation
  - Body: `{ id, operator, phoneNumber, ussdCode, status, dateResponse, msgResponse }`
- **DELETE** - Delete activation
  - `DELETE /api/activations.php?id=activation_id`

### Top-ups API (`/api/topups.php`)

- **GET** - Get all top-ups or single top-up
  - All: `GET /api/topups.php`
  - Single: `GET /api/topups.php?id=topup_id`
- **POST** - Create new top-up
  - Body: `{ operator, montant, phoneNumber, status, user, newBalance?, msgResponse? }`
- **PUT** - Update top-up
  - Body: `{ id, operator, montant, phoneNumber, status, newBalance, msgResponse }`
- **DELETE** - Delete top-up
  - `DELETE /api/topups.php?id=topup_id`

## Security Notes

1. **Change default credentials** in `config/database.php`
2. **Enable HTTPS** on your Hostinger domain for secure API calls
3. Consider adding **authentication** (JWT tokens) for production
4. Add **rate limiting** to prevent abuse
5. Validate and sanitize all user inputs (already implemented in the code)

## Troubleshooting

**CORS Issues:**
- The API includes CORS headers. If you still have issues, check your Hostinger .htaccess file

**Database Connection Failed:**
- Verify database credentials in `config/database.php`
- Ensure database user has proper privileges
- Check if MySQL is running on Hostinger

**404 Errors:**
- Verify files are uploaded to correct directory
- Check file permissions (644 for PHP files)
- Ensure your hosting supports PHP (Hostinger does)

**JSON Parsing Errors:**
- Check PHP error logs in Hostinger control panel
- Enable error reporting temporarily: `ini_set('display_errors', 1);`

## Next Steps

After setting up the API:
1. Update your React app to fetch data from these endpoints
2. Remove mock data dependencies
3. Test all CRUD operations
4. Add authentication if needed
5. Deploy and test in production