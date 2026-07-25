import { api } from './client';

export const decksApi = {
  list: () => api.get('/decks').then((r) => r.data),
  browsePublic: (search = '') => api.get('/decks/public', { params: { search } }).then((r) => r.data),
  get: (id) => api.get(`/decks/${id}`).then((r) => r.data),
  create: (payload) => api.post('/decks', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/decks/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/decks/${id}`).then((r) => r.data),

  addCard: (deckId, card) => api.post(`/decks/${deckId}/cards`, card).then((r) => r.data),
  updateCard: (deckId, cardId, card) =>
    api.patch(`/decks/${deckId}/cards/${cardId}`, card).then((r) => r.data),
  removeCard: (deckId, cardId) =>
    api.delete(`/decks/${deckId}/cards/${cardId}`).then((r) => r.data),
  reviewCard: (deckId, cardId, correct) =>
    api.patch(`/decks/${deckId}/cards/${cardId}/review`, { correct }).then((r) => r.data),
};
