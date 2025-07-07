'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MediaService } from '@/lib/media-service';
import { MediaEntry } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StarRating } from '@/components/star-rating';
import { MediaSearch } from '@/components/media-search';
import { useUser } from '@/lib/user-context';

export default function EditMediaPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mediaEntry, setMediaEntry] = useState<MediaEntry | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'book' as 'book' | 'movie' | 'podcast' | 'article',
    status: 'on the list' as 'on the list' | 'consuming' | 'consumed',
    dateCompleted: '',
    rating: 0,
    notes: '',
    coverImageUrl: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    const fetchMediaEntry = async () => {
      try {
        const id = params.id as string;
        const entry = await MediaService.getEntryById(id);
        
        if (!entry) {
          setError('Media entry not found');
          return;
        }

        // Check if the entry belongs to the current user
        if (entry.user_id !== user.id) {
          setError('You can only edit your own media entries');
          return;
        }

        setMediaEntry(entry);
        setFormData({
          title: entry.title || '',
          type: (['book', 'movie', 'podcast', 'article'].includes(entry.media_type) ? entry.media_type : 'book') as 'book' | 'movie' | 'podcast' | 'article',
          status: entry.status === 'on_list' ? 'on the list' : (entry.status === 'consuming' ? 'consuming' : 'consumed'),
          dateCompleted: entry.date_completed ? new Date(entry.date_completed).toISOString().split('T')[0] : '',
          rating: entry.rating || 0,
          notes: entry.notes || '',
          coverImageUrl: entry.cover_image_url || ''
        });
      } catch (err) {
        setError('Failed to load media entry');
        console.error('Error fetching media entry:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaEntry();
  }, [params.id, user, router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const id = params.id as string;
      const updateData: any = {
        title: formData.title,
        media_type: formData.type,
        status: (formData.status === 'on the list' ? 'on_list' : formData.status) as 'on_list' | 'consuming' | 'consumed',
        rating: formData.rating > 0 ? formData.rating : null,
        notes: formData.notes,
        cover_image_url: formData.coverImageUrl
      };
      if (formData.status === 'consumed' && formData.dateCompleted) {
        updateData.date_completed = formData.dateCompleted;
      }

      await MediaService.updateEntry(id, updateData);
      router.push('/profile');
    } catch (err) {
      setError('Failed to update media entry');
      console.error('Error updating media entry:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this media entry?')) {
      return;
    }

    setSaving(true);
    try {
      const id = params.id as string;
      await MediaService.deleteEntry(id);
      router.push('/profile');
    } catch (err) {
      setError('Failed to delete media entry');
      console.error('Error deleting media entry:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <Button onClick={() => router.push('/profile')} className="mt-4">
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Media Entry</h1>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete Entry
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                placeholder="Enter title"
              />
            </div>

            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value: any) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on the list">On the List</SelectItem>
                  <SelectItem value="consuming">Currently Consuming</SelectItem>
                  <SelectItem value="consumed">Consumed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === 'consumed' && (
              <div>
                <Label htmlFor="dateCompleted">Date Completed</Label>
                <Input
                  id="dateCompleted"
                  type="date"
                  value={formData.dateCompleted}
                  onChange={(e) => handleInputChange('dateCompleted', e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="rating">Rating</Label>
              <StarRating
                value={formData.rating}
                onChange={(rating) => handleInputChange('rating', rating)}
                allowDecimal={true}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add your thoughts, notes, or review..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="coverImageUrl">Cover Image URL</Label>
              <Input
                id="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={(e) => handleInputChange('coverImageUrl', e.target.value)}
                placeholder="https://example.com/cover.jpg"
              />
            </div>

            {formData.coverImageUrl && (
              <div className="flex justify-center">
                <img
                  src={formData.coverImageUrl}
                  alt="Cover"
                  className="w-32 h-48 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/profile')}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 