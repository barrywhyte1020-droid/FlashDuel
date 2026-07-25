import { create } from 'zustand';
import { decksApi } from '../api/decks';

export const useDeckStore = create((set, get) => ({
  decks: [],
  loading: false,
  error: null,

  fetchDecks: async () => {
    set({ loading: true, error: null });
    try {
      const decks = await decksApi.list();
      set({ decks, loading: false });
    } catch (err) {
      set({ error: 'Could not load decks', loading: false });
    }
  },

  createDeck: async (payload) => {
    const deck = await decksApi.create(payload);
    set({ decks: [deck, ...get().decks] });
    return deck;
  },

  updateDeck: async (id, payload) => {
    const updated = await decksApi.update(id, payload);
    set({ decks: get().decks.map((d) => (d._id === id ? updated : d)) });
    return updated;
  },

  removeDeck: async (id) => {
    await decksApi.remove(id);
    set({ decks: get().decks.filter((d) => d._id !== id) });
  },
}));
