import { useCallback } from 'react';
import { useApi } from '../../../shared/hooks/useApi';
import { useNewsStore } from '../../../store';
import type { News } from '../../../types';

export const useNewsApi = () => {
  const newsApi = useApi<News[]>();
  const newsItemApi = useApi<News>();
  const store = useNewsStore();

  const fetchNews = useCallback(async () => {
    store.setLoading(true);
    
    try {
      const news = await newsApi.get('/news');
      if (news) {
        store.setNews(news);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des actualités';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createNews = useCallback(async (newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt'>) => {
    store.setLoading(true);
    
    try {
      const newNews = await newsItemApi.post('/news', newsData);
      if (newNews) {
        store.addNews(newNews);
        return newNews;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de l\'actualité';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateNews = useCallback(async (newsId: string, updates: Partial<News>) => {
    store.setLoading(true);
    
    try {
      const updatedNews = await newsItemApi.put(`/news/${newsId}`, updates);
      if (updatedNews) {
        store.updateNews(newsId, updatedNews);
        return updatedNews;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'actualité';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return null;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteNews = useCallback(async (newsId: string) => {
    store.setLoading(true);
    
    try {
      const success = await newsItemApi.delete(`/news/${newsId}`);
      if (success) {
        store.deleteNews(newsId);
        return true;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'actualité';
      store.setError(errorMessage);
    } finally {
      store.setLoading(false);
    }
    
    return false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Store state
    news: store.news,
    selectedNews: store.selectedNews,
    isLoading: store.isLoading || newsApi.isLoading || newsItemApi.isLoading,
    error: store.error || newsApi.error || newsItemApi.error,
    
    // Store actions
    selectNews: store.selectNews,
    clearError: store.clearError,
    
    // API actions
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
  };
}; 