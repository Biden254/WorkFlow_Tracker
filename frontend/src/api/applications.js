import apiClient from "./client";

export async function listApplications() {
  const { data } = await apiClient.get("/applications/");
  return data;
}

export async function getApplication(id) {
  const { data } = await apiClient.get(`/applications/${id}`);
  return data;
}

export async function createApplication(payload) {
  const { data } = await apiClient.post("/applications/", payload);
  return data;
}

export async function updateApplication(id, payload) {
  const { data } = await apiClient.put(`/applications/${id}`, payload);
  return data;
}

export async function submitApplication(id) {
  const { data } = await apiClient.post(`/applications/${id}/submit`);
  return data;
}

export async function startReview(id) {
  const { data } = await apiClient.post(`/applications/${id}/start-review`);
  return data;
}

export async function recordDecision(id, payload) {
  const { data } = await apiClient.post(`/applications/${id}/decision`, payload);
  return data;
}

