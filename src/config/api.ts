// API Configuration
const API_BASE_URL = 'http://chargi.store/apis/api-dashboard';

export const API_ENDPOINTS = {
  devices: `${API_BASE_URL}/devices.php`,
  simCards: `${API_BASE_URL}/simcards.php`,
  users: `${API_BASE_URL}/users.php`,
  activations: `${API_BASE_URL}/activations.php`,
  topups: `${API_BASE_URL}/topups.php`,
};

export default API_BASE_URL;
