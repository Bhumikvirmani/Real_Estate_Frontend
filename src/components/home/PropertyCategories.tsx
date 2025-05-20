import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';

interface Category {
  name: string;
  count: number;
}

export default function PropertyCategories() {
  const { fetchData } = useApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchData({
          url: '/api/properties/categories',
          method: 'GET'
        });
        if (data && data.categories) {
          // Access the categories array from the response
          setCategories(data.categories);
        } else {
          // Set empty array if no categories data
          setCategories([]);
          console.warn('No categories data found in API response');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Set empty array on error
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [fetchData]);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories?.map((category) => (
        <div
          key={category?.name || Math.random()}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold capitalize">
            {category?.name && category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </h3>
          <p className="text-gray-600">{category?.count || 0} Properties</p>
        </div>
      ))}
    </div>
  );
}
