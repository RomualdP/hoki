'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../../components/ui';
import { Input } from '../../../components/forms';
import { useNewsApi } from '../../../features/news/hooks/useNewsApi';
import { formatDate } from '../../../utils';
import Link from 'next/link';
import type { News } from '../../../types';

interface NewsCreateData {
  readonly title: string;
  readonly content: string;
  readonly excerpt?: string;
  readonly isPublished: boolean;
}

export default function AdminNewsPage() {
  const { news, fetchNews, createNews, updateNews, deleteNews } = useNewsApi();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<NewsCreateData>({
    title: '',
    content: '',
    excerpt: '',
    isPublished: false,
  });

  useEffect(() => {
    fetchNews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      isPublished: false,
    });
    setIsCreating(false);
    setEditingNews(null);
  };

  const handleFormChange = (field: keyof NewsCreateData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    if (editingNews) {
      // Update existing news
      const success = await updateNews(editingNews.id, {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        isPublished: formData.isPublished,
      });
      if (success) {
        resetForm();
      }
    } else {
      // Create new news
      const success = await createNews({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        author: 'Admin VolleyApp',
        isPublished: formData.isPublished,
      });
      if (success) {
        resetForm();
      }
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt || '',
      isPublished: newsItem.isPublished,
    });
    setIsCreating(true);
  };

  const handleDelete = async (newsId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      await deleteNews(newsId);
    }
  };

  const togglePublishStatus = async (newsItem: News) => {
    await updateNews(newsItem.id, {
      isPublished: !newsItem.isPublished,
    });
  };

  return (
    
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-heading">
                    Gestion des actualités
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Créez, modifiez et publiez des actualités
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/admin">
                    <Button variant="outline">
                      Retour à l&apos;admin
                    </Button>
                  </Link>
                  <Button 
                    variant="primary"
                    onClick={() => setIsCreating(true)}
                    disabled={isCreating}
                  >
                    Ajouter une actualité
                  </Button>
                </div>
              </div>
            </div>

            {/* Create/Edit Form */}
            {isCreating && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>
                    {editingNews ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    id="news-title"
                    name="title"
                    type="text"
                    label="Titre"
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder="Titre de l'actualité..."
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Extrait (optionnel)
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => handleFormChange('excerpt', e.target.value)}
                      placeholder="Résumé court de l'actualité..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenu *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleFormChange('content', e.target.value)}
                      placeholder="Contenu complet de l'actualité..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-published"
                      checked={formData.isPublished}
                      onChange={(e) => handleFormChange('isPublished', e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is-published" className="text-sm font-medium text-gray-700">
                      Publier immédiatement
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!formData.title.trim() || !formData.content.trim()}
                    >
                      {editingNews ? 'Mettre à jour' : 'Créer'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetForm}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* News List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Actualités ({news.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {news.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune actualité</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {news.map((newsItem) => (
                      <NewsItem 
                        key={newsItem.id} 
                        news={newsItem}
                        onEdit={() => handleEdit(newsItem)}
                        onDelete={() => handleDelete(newsItem.id)}
                        onTogglePublish={() => togglePublishStatus(newsItem)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    
  );
}

interface NewsItemProps {
  readonly news: News;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onTogglePublish: () => void;
}

function NewsItem({ news, onEdit, onDelete, onTogglePublish }: NewsItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {news.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Par {news.author}</span>
            <span>{formatDate(news.createdAt)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              news.isPublished 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {news.isPublished ? 'Publié' : 'Brouillon'}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {news.excerpt || news.content}
      </p>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
        >
          Modifier
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePublish}
        >
          {news.isPublished ? 'Dépublier' : 'Publier'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700"
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
} 