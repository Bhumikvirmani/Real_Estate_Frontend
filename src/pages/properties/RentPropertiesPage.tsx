
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
// import {PropertySearch} from '@/components/property/PropertySearch';
import { PropertySearch } from '@/components/property/PropertySearch';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  type: string;
  status: 'sale' | 'rent';
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  images: string[];
}

// Sample fallback data in case API is unavailable
const fallbackProperties = [
  {
    _id: "fb1",
    title: "Modern Studio Apartment in City Center",
    price: 25000,
    location: {
      address: "123 Urban Street",
      city: "Bangalore",
      state: "Karnataka"
    },
    type: "apartment",
    status: "rent",
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 650
    },
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"]
  },
  {
    _id: "fb2",
    title: "Spacious 3BHK Family Apartment",
    price: 35000,
    location: {
      address: "456 Family Lane",
      city: "Bangalore",
      state: "Karnataka"
    },
    type: "apartment",
    status: "rent",
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 1200
    },
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb"]
  },
  {
    _id: "fb3",
    title: "Premium Office Space in Business District",
    price: 65000,
    location: {
      address: "789 Business Park",
      city: "Bangalore", 
      state: "Karnataka"
    },
    type: "commercial",
    status: "rent",
    features: {
      bedrooms: 0,
      bathrooms: 2,
      area: 2200
    },
    images: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2"]
  }
];

const RentPropertiesPage = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  
  const query = searchParams.get('query') || '';
  const type = searchParams.get('type') || '';
  const page = searchParams.get('page') || '1';
  
  const { data, loading, error, fetchData } = useApi<{ properties: Property[], total: number, page: number, pages: number }>();

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (type) params.append('type', type);
    if (page) params.append('page', page);
    params.append('status', 'rent'); // Always get rental properties
    
    console.log(`Fetching rental properties with params: ${params.toString()}`);
    
    fetchData({
      url: `/api/properties?${params.toString()}`,
      method: 'GET',
      showErrorToast: true
    }).catch(err => {
      console.error('Error fetching rental properties:', err);
      toast({
        title: "Connection Error",
        description: "Could not connect to the property database. Using sample data instead.",
        variant: "destructive"
      });
    });
  }, [query, type, page, fetchData, toast]);

  // Use API data if available, otherwise use fallback data
  const properties = data?.properties && data.properties.length > 0 
    ? data.properties 
    : error ? fallbackProperties : null;

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <PropertySearch defaultStatus="rent" />
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            <h2 className="text-2xl font-semibold">Rental Properties</h2>
            {query && (
              <div className="ml-4 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Results for: {query}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {properties && properties.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    id={property._id}
                    title={property.title}
                    location={`${property.location.address}, ${property.location.city}`}
                    price={`₹${property.price.toLocaleString()}/month`}
                    type="rent"
                    propertyType={property.type}
                    bedrooms={property.features.bedrooms}
                    bathrooms={property.features.bathrooms}
                    area={`${property.features.area} sq ft`}
                    image={property.images[0] || '/placeholder.svg'}
                    className={viewMode === 'list' ? "flex flex-row h-48" : ""}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No rental properties found matching your criteria</p>
                <Button variant="link" className="mt-4" onClick={() => window.location.href = '/properties/rent'}>
                  Clear filters
                </Button>
              </div>
            )}
            
            {/* Pagination */}
            {data?.pages && data.pages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {[...Array(data.pages)].map((_, i) => (
                  <Button 
                    key={i} 
                    variant={data.page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(i + 1));
                      window.history.pushState({}, '', `?${params.toString()}`);
                      
                      fetchData({
                        url: `/api/properties?${params.toString()}&status=rent`,
                        method: 'GET',
                      });
                    }}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default RentPropertiesPage;
