import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

interface APIProperty {
  _id: string;
  title: string;
  price: number;
  location: {
    address: string;
    city: string;
  };
  type: string;
  status: 'sale' | 'rent';
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  images: string[];
  featured: boolean;
}

interface APIResponse {
  success: boolean;
  properties: APIProperty[];
}

const FeaturedProperties = () => {
  const { data, loading, fetchData } = useApi<APIResponse>();
  const { toast } = useToast();
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);

  useEffect(() => {
    // Fetch featured properties from the API
    fetchData({
      url: "/api/properties/featured",
      method: "GET",
      showErrorToast: true
    }).catch(err => {
      console.error("Error fetching featured properties:", err);
      toast({
        title: "Connection Error",
        description: "Could not load featured properties. Please try again later.",
        variant: "destructive"
      });
    });
  }, [fetchData, toast]);

  useEffect(() => {
    // If we successfully got data from API, transform it for the PropertyCard component
    if (data?.properties && data.properties.length > 0) {
      const transformedProperties = data.properties.map(p => ({
        id: p._id,
        title: p.title,
        location: `${p.location.address}, ${p.location.city}`,
        price: p.status === 'rent' ? `$${p.price.toLocaleString()}/month` : `$${p.price.toLocaleString()}`,
        type: p.status,
        propertyType: p.type,
        bedrooms: p.features.bedrooms,
        bathrooms: p.features.bathrooms,
        area: `${p.features.area} sq ft`,
        image: p.images[0] || '/placeholder.svg',
        featured: true
      }));
      setFeaturedProperties(transformedProperties);
    }
  }, [data]);
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Latest Properties</h2>
            <p className="text-gray-500">
              Recently added properties to our marketplace
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link to="/properties">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Show skeleton loaders while loading
            Array(6).fill(null).map((_, index) => (
              <div key={`skeleton-${index}`} className="border rounded-lg overflow-hidden">
                <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse"></div>
                  <div className="flex justify-between mt-4">
                    <div className="h-4 w-1/4 bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-1/4 bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-1/4 bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))
          ) : featuredProperties.length > 0 ? (
            // Show actual properties if we have data
            featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                type={property.type}
                propertyType={property.propertyType}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                image={property.image}
              />
            ))
          ) : (
            // Show message if no properties found
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">No properties available at this time. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;

