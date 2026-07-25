import { api } from './client';

export const duelsApi = {
  create: (payload) => api.post('/duels', payload).then((r) => r.data),
  join: (code) => api.post(`/duels/join/${code}`).then((r) => r.data),
  get: (id) => api.get(`/duels/${id}`).then((r) => r.data),
  submit: (id, answers) => api.post(`/duels/${id}/submit`, { answers }).then((r) => r.data),
  globalLeaderboard: () => api.get('/leaderboard/global').then((r) => r.data),
};
