import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UseFavoritesResult {
  favorites: string[];
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<boolean>;
  loading: boolean;
}

export const useFavorites = (): UseFavoritesResult => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Function to fetch user favorites
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Your session has expired. Please log in again."
          });
          return;
        }
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      // Extract property IDs from favorite objects
      const favoriteIds = data.map((fav: any) => fav.property._id || fav.property);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your favorites"
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, toast]);

  // Function to check if a property is in favorites
  const isFavorite = useCallback((propertyId: string) => {
    return favorites.includes(propertyId);
  }, [favorites]);

  // Function to toggle favorite status
  const toggleFavorite = useCallback(async (propertyId: string): Promise<boolean> => {
    if (!isAuthenticated || !token) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to save favorites"
      });
      return false;
    }

    try {
      const isFav = isFavorite(propertyId);
      const endpoint = `${import.meta.env.VITE_API_URL || ''}/api/favorites`;
      const method = isFav ? 'DELETE' : 'POST';

      const response = await fetch(`${endpoint}/${propertyId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Your session has expired. Please log in again."
          });
          return false;
        }
        throw new Error(`Failed to ${isFav ? 'remove from' : 'add to'} favorites`);
      }

      // Update local state
      setFavorites(prevFavorites =>
        isFav
          ? prevFavorites.filter(id => id !== propertyId)
          : [...prevFavorites, propertyId]
      );

      toast({
        title: isFav ? "Removed from favorites" : "Added to favorites",
        description: isFav ? "Property removed from your favorites" : "Property added to your favorites"
      });

      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update favorites`
      });
      return false;
    }
  }, [isAuthenticated, token, isFavorite, toast]);

  // Fetch favorites on component mount and when auth state changes
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return { favorites, isFavorite, toggleFavorite, loading };
};

