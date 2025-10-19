// API Configuration
// Update this URL to your Hostinger domain after deployment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://yourdomain.com/api' // Replace with your actual domain
  : 'http://localhost/api'; // For local development with XAMPP/WAMP

export const API_ENDPOINTS = {
  devices: `${API_BASE_URL}/devices.php`,
  simCards: `${API_BASE_URL}/simcards.php`,
  users: `${API_BASE_URL}/users.php`,
  activations: `${API_BASE_URL}/activations.php`,
  topups: `${API_BASE_URL}/topups.php`,
};

export default API_BASE_URL;
