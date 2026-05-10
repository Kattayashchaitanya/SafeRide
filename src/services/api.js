import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const submitComplaint = async (complaintData) => {
  const response = await axios.post(`${API_URL}/complaints`, complaintData);
  return response.data;
};

export const fetchComplaints = async (token) => {
  const response = await axios.get(`${API_URL}/complaints`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchLatestArrivals = async (token) => {
  const response = await axios.get(`${API_URL}/driver/arrivals`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchStats = async (token) => {
  const response = await axios.get(`${API_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const postAnnouncement = async (text, token) => {
  const response = await axios.post(`${API_URL}/admin/announcement`, { text }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchAnnouncements = async (token) => {
  const response = await axios.get(`${API_URL}/admin/announcements`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchPerformance = async (driverId, token) => {
  const response = await axios.get(`${API_URL}/performance/${driverId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addUser = async (userData, token) => {
  const response = await axios.post(`${API_URL}/admin/user`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addBus = async (busData, token) => {
  const response = await axios.post(`${API_URL}/admin/bus`, busData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchBuses = async (token) => {
  const response = await axios.get(`${API_URL}/admin/buses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addRoute = async (routeData, token) => {
  const response = await axios.post(`${API_URL}/admin/route`, routeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const reportBreakdown = async (breakdownData, token) => {
  const response = await axios.post(`${API_URL}/driver/breakdown`, breakdownData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const logArrival = async (arrivalData, token) => {
  const response = await axios.post(`${API_URL}/driver/log-arrival`, arrivalData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchActiveAlerts = async (token) => {
  const response = await axios.get(`${API_URL}/driver/alerts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const assistBreakdown = async (alertId, helperName, token) => {
  const response = await axios.post(`${API_URL}/driver/alerts/assist`, { alertId, helperName }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchNearbyBuses = async (token) => {
  const response = await axios.get(`${API_URL}/driver/nearby`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchInsights = async (token) => {
  const response = await axios.get(`${API_URL}/performance/insights`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deductPoints = async (penaltyData, token) => {
  const response = await axios.post(`${API_URL}/performance/deduct`, penaltyData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const resolveComplaint = async (complaintId, resolutionData, token) => {
  const response = await axios.put(`${API_URL}/complaints/${complaintId}/resolve`, resolutionData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchAllPerformances = async (token) => {
  const response = await axios.get(`${API_URL}/performance`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
