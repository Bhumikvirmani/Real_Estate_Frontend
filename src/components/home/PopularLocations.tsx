import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';

// interface LocationCardProps {
//   name: string;
//   image: string;
//   count: string;
//   to: string;
// }
interface Location {
  city: string;
  state: string;
  count: number;
  image: string;
}
const LocationCard = ({ city, state, count, image }: Location) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <img
        src={image || '/placeholder.jpg'}
        alt={`${city}, ${state}`}
        className="w-full h-48 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-white font-semibold">
          {city}, {state}
        </h3>
        <p className="text-white/80 text-sm">
          {count} {count === 1 ? 'Property' : 'Properties'}
        </p>
      </div>
    </div>
  );
};


export default function PopularLocations() {
  const { fetchData } = useApi();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await fetchData({
          url: '/api/properties/locations',
          method: 'GET'
        });
        if (data && data.locations) {
          // Access the locations array from the response
          setLocations(data.locations);
        } else {
          // Set empty array if no locations data
          setLocations([]);
          console.warn('No locations data found in API response');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Set empty array on error
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [fetchData]);

  if (loading) {
    return <div>Loading locations...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations?.map((location) => (
        <LocationCard
          key={`${location.city}-${location.state}-${location.count}`}
          city={location.city}
          state={location.state}
          count={location.count}
          image={location.image}
        />
      ))}
    </div>
  );
}
