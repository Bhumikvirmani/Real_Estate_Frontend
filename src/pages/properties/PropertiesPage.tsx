import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { PropertySearch } from '@/components/property/PropertySearch';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomPriceSlider } from '@/components/ui/CustomPriceSlider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from '@/hooks/useApi';
import { Filter, Grid, List, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface PropertyResponse {
  properties: Property[];
  page: number;
  pages: number;
  total: number;
}

const sortOptions = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' }
];

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt:desc');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('price_min')) || 25000,
    Number(searchParams.get('price_max')) || 1000000
  ]);
  
  const query = searchParams.get('query') || '';
  const type = searchParams.get('type') || '';
  const status = searchParams.get('status') || '';
  const city = searchParams.get('city') || '';
  const page = Number(searchParams.get('page')) || 1;
  const bedrooms = searchParams.get('bedrooms');
  const bathrooms = searchParams.get('bathrooms');
  
  const { data, loading, fetchData } = useApi<PropertyResponse>();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sortBy);
    
    fetchData({
      url: `/api/properties?${params.toString()}`,
      method: 'GET',
    });
  }, [searchParams, sortBy, fetchData]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Handle price range changes
  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    const params = new URLSearchParams(searchParams);
    params.set('minPrice', newRange[0].toString());
    params.set('maxPrice', newRange[1].toString());
    setSearchParams(params);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <PropertySearch advanced />
        </div>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h2 className="text-2xl font-semibold">Property Listings</h2>
            {(query || type || city) && (
              <div className="ml-4 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {query && `Results for: ${query}`}
                  {type && !query && `Type: ${type}`}
                  {city && !query && !type && `Location: ${city}`}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <CustomPriceSlider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  min={25000}
                  max={1000000}
                  step={1000}
                  className="w-full"
                  showInputs={true}
                  formatValue={(val) => `$${val.toLocaleString()}`}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select onValueChange={handleSortChange} value={sortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
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
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-[400px] rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {data?.properties && data.properties.length > 0 ? (
              <>
                <div className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                } gap-6`}>
                  {data.properties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      id={property._id}
                      title={property.title}
                      location={`${property.location.address}, ${property.location.city}`}
                      price={`$${property.price.toLocaleString()}`}
                      type={property.status}
                      propertyType={property.type}
                      bedrooms={property.features.bedrooms}
                      bathrooms={property.features.bathrooms}
                      area={`${property.features.area} sq ft`}
                      image={property.images[0] || '/placeholder.svg'}
                      horizontal={viewMode === 'list'}
                    />
                  ))}
                </div>

                {data.pages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: data.pages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === data.pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500 mb-4">
                  No properties found matching your criteria
                </p>
                <Button onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default PropertiesPage;
