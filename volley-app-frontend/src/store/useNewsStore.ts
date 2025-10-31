import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { News, NewsFilters } from '../types';

interface NewsState {
  readonly news: News[];
  readonly selectedNews: News | null;
  readonly filters: NewsFilters;
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface NewsActions {
  readonly setNews: (news: News[]) => void;
  readonly addNews: (news: News) => void;
  readonly updateNews: (newsId: string, updates: Partial<News>) => void;
  readonly deleteNews: (newsId: string) => void;
  readonly selectNews: (news: News | null) => void;
  readonly setFilters: (filters: Partial<NewsFilters>) => void;
  readonly clearFilters: () => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly clearError: () => void;
  readonly getPublishedNews: () => News[];
  readonly getLatestNews: (limit?: number) => News[];
}

type NewsStore = NewsState & NewsActions;

const initialState: NewsState = {
  news: [],
  selectedNews: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const useNewsStore = create<NewsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setNews: (news: News[]) => {
        set(
          (state) => ({
            ...state,
            news,
            isLoading: false,
            error: null,
          }),
          false,
          'news/setNews'
        );
      },

      addNews: (news: News) => {
        set(
          (state) => ({
            ...state,
            news: [news, ...state.news],
          }),
          false,
          'news/addNews'
        );
      },

      updateNews: (newsId: string, updates: Partial<News>) => {
        set(
          (state) => ({
            ...state,
            news: state.news.map((item) =>
              item.id === newsId ? { ...item, ...updates } : item
            ),
            selectedNews:
              state.selectedNews?.id === newsId
                ? { ...state.selectedNews, ...updates }
                : state.selectedNews,
          }),
          false,
          'news/updateNews'
        );
      },

      deleteNews: (newsId: string) => {
        set(
          (state) => ({
            ...state,
            news: state.news.filter((item) => item.id !== newsId),
            selectedNews:
              state.selectedNews?.id === newsId ? null : state.selectedNews,
          }),
          false,
          'news/deleteNews'
        );
      },

      selectNews: (news: News | null) => {
        set(
          (state) => ({
            ...state,
            selectedNews: news,
          }),
          false,
          'news/selectNews'
        );
      },

      setFilters: (filters: Partial<NewsFilters>) => {
        set(
          (state) => ({
            ...state,
            filters: { ...state.filters, ...filters },
          }),
          false,
          'news/setFilters'
        );
      },

      clearFilters: () => {
        set(
          (state) => ({
            ...state,
            filters: {},
          }),
          false,
          'news/clearFilters'
        );
      },

      setLoading: (isLoading: boolean) => {
        set(
          (state) => ({
            ...state,
            isLoading,
          }),
          false,
          'news/setLoading'
        );
      },

      setError: (error: string | null) => {
        set(
          (state) => ({
            ...state,
            error,
            isLoading: false,
          }),
          false,
          'news/setError'
        );
      },

      clearError: () => {
        set(
          (state) => ({
            ...state,
            error: null,
          }),
          false,
          'news/clearError'
        );
      },

      getPublishedNews: () => {
        const state = get();
        return state.news.filter(
          (item) => item.isPublished && item.publishedAt
        ).sort(
          (a, b) => 
            new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
        );
      },

      getLatestNews: (limit = 3) => {
        const { getPublishedNews } = get();
        return getPublishedNews().slice(0, limit);
      },
    }),
    {
      name: 'news-store',
    }
  )
); 