import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHuStore = create(
  persist(
    (set) => ({
      filters: {
        types: { video: true, live: true, defis: false, quiz: false },
        colors: new Set(),
        flags: new Set(),
        country: null,
        sort: 'trend_24h',
      },
      ui: { settingsOpen: false, quickAction: null },
      toggleType: (type) =>
        set((state) => ({
          filters: {
            ...state.filters,
            types: { ...state.filters.types, [type]: !state.filters.types[type] },
          },
        })),
      onlyType: (type) =>
        set((state) => ({
          filters: {
            ...state.filters,
            types: { video: false, live: false, defis: false, quiz: false, [type]: true },
          },
        })),
      toggleColor: (color) =>
        set((state) => {
          const next = new Set(state.filters.colors);
          next.has(color) ? next.delete(color) : next.add(color);
          return { filters: { ...state.filters, colors: next } };
        }),
      setFlags: (flags) =>
        set((state) => ({ filters: { ...state.filters, flags } })),
      setCountry: (country) =>
        set((state) => ({ filters: { ...state.filters, country } })),
      setSort: (sort) =>
        set((state) => ({ filters: { ...state.filters, sort } })),
      setQuickAction: (qa) => set((state) => ({ ui: { ...state.ui, quickAction: qa } })),
      openSettings: () => set((state) => ({ ui: { ...state.ui, settingsOpen: true } })),
      closeSettings: () => set((state) => ({ ui: { ...state.ui, settingsOpen: false } })),
    }),
    {
      name: 'hu-store',
      serialize: (state) => {
        const colors = Array.from(state.state.filters.colors);
        const flags = Array.from(state.state.filters.flags);
        return JSON.stringify({ ...state, state: { ...state.state, filters: { ...state.state.filters, colors, flags } } });
      },
      deserialize: (str) => {
        const data = JSON.parse(str);
        data.state.filters.colors = new Set(data.state.filters.colors || []);
        data.state.filters.flags = new Set(data.state.filters.flags || []);
        return data;
      },
    }
  )
);
