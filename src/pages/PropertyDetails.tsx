import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import {
  BedDouble,
  Bath,
  MapPin,
  Ruler,
  Calendar,
  Check,
  Building,
  Car,
  Wind,
  Palmtree,
  Dumbbell,
  Waves,
  Shield,
  ArrowUpDown,
  Heart,
  Star,
  MessageSquare,
  User
} from 'lucide-react';
import { ContactAgentForm } from '@/components/property/ContactAgentForm';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    area: number;
    furnished: boolean;
    parking: boolean;
    airConditioning: boolean;
    garden: boolean;
    gym: boolean;
    swimmingPool: boolean;
    security: boolean;
    elevator: boolean;
  };
  images: string[];
  owner: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  featured: boolean;
  verified: boolean;
  availableFrom: string;
  createdAt: string;
  reviews: Review[];
  averageRating: number;
  numReviews: number;
  views: number;
}

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { fetchData } = useApi();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);

        if (!id || id === 'undefined' || id === 'null') {
          setError('Property ID is missing or invalid');
          setLoading(false);
          return;
        }

        // First fetch the property details
        try {
          const propertyData = await fetchData({
            url: `/api/properties/${id}`,
            method: 'GET'
          });

          if (!propertyData) {
            setError('Property not found');
            setLoading(false);
            return;
          }

          // Debug: Log the response data structure
          console.log('Property data from API:', propertyData);

          // Check if propertyData has a property field (from the API response)
          if (propertyData && propertyData.property) {
            setProperty(propertyData.property);
          } else {
            // Fallback if the API response format is different
            setProperty(propertyData);
          }
        } catch (err) {
          console.error('Error fetching property details:', err);
          setError('Failed to load property details');
          setLoading(false);
          return;
        }

        // Then fetch similar properties
        if (id && id !== 'undefined' && id !== 'null') {
          try {
            const similarData = await fetchData({
              url: `/api/properties/${id}/similar`,
              method: 'GET'
            });

            // Debug: Log the similar properties data structure
            console.log('Similar properties data from API:', similarData);

            if (similarData) {
              // Check if similarData has a properties field (from the API response)
              if (similarData.properties) {
                setSimilarProperties(similarData.properties);
              } else {
                // Fallback if the API response format is different
                setSimilarProperties(similarData);
              }
            }
          } catch (similarErr) {
            console.error('Error fetching similar properties:', similarErr);
            // Don't set the main error state, just log it
            // We still want to show the property details even if similar properties fail
          }
        } else {
          console.warn('Skipping similar properties fetch due to invalid ID');
        }
      } catch (err) {
        setError('Failed to load property details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, fetchData]);

  if (loading) return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[50vh]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg">Loading property details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[50vh]">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    </div>
  );

  if (!property) return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[50vh]">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    </div>
  );

  const favorite = isFavorite(property._id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <Button
                variant="outline"
                size="icon"
                className={favorite ? "text-red-500" : ""}
                onClick={() => toggleFavorite(property._id)}
              >
                <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
              </Button>
            </div>
            <div className="mt-2 flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              <span>
                {property.location?.address && (
                  <>
                    {property.location.address}, {property.location.city},{' '}
                    {property.location.state} {property.location.zipCode}
                  </>
                )}
              </span>
            </div>
          </div>

          <Carousel className="mb-8">
            {property.images && property.images.length > 0 ? (
              property.images.map((image, index) => (
                <AspectRatio key={index} ratio={16 / 9}>
                  <img
                    src={image}
                    alt={`Property image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback image if the property image fails to load
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </AspectRatio>
              ))
            ) : (
              <AspectRatio ratio={16 / 9}>
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No images available</p>
                </div>
              </AspectRatio>
            )}
          </Carousel>

          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                ${property.price?.toLocaleString() || '0'}
              </span>
              <Badge variant={property.status === 'sale' ? 'default' : 'secondary'}>
                For {property.status === 'sale' ? 'Sale' : 'Rent'}
              </Badge>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {property.features?.bedrooms && (
                <div className="flex items-center text-muted-foreground">
                  <BedDouble className="mr-2 h-4 w-4" />
                  <span>{property.features.bedrooms} Beds</span>
                </div>
              )}
              {property.features?.bathrooms && (
                <div className="flex items-center text-muted-foreground">
                  <Bath className="mr-2 h-4 w-4" />
                  <span>{property.features.bathrooms} Baths</span>
                </div>
              )}
              {property.features?.area && (
                <div className="flex items-center text-muted-foreground">
                  <Ruler className="mr-2 h-4 w-4" />
                  <span>{property.features.area} sq ft</span>
                </div>
              )}
              {property.type && (
                <div className="flex items-center text-muted-foreground">
                  <Building className="mr-2 h-4 w-4" />
                  <span className="capitalize">{property.type}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Description</h2>
            <p className="whitespace-pre-line text-muted-foreground">
              {property.description || 'No description available'}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Features & Amenities</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {property.features?.furnished && (
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Furnished</span>
                </div>
              )}
              {property.features?.parking && (
                <div className="flex items-center">
                  <Car className="mr-2 h-4 w-4 text-green-500" />
                  <span>Parking</span>
                </div>
              )}
              {property.features?.airConditioning && (
                <div className="flex items-center">
                  <Wind className="mr-2 h-4 w-4 text-green-500" />
                  <span>Air Conditioning</span>
                </div>
              )}
              {property.features?.garden && (
                <div className="flex items-center">
                  <Palmtree className="mr-2 h-4 w-4 text-green-500" />
                  <span>Garden</span>
                </div>
              )}
              {property.features?.gym && (
                <div className="flex items-center">
                  <Dumbbell className="mr-2 h-4 w-4 text-green-500" />
                  <span>Gym</span>
                </div>
              )}
              {property.features?.swimmingPool && (
                <div className="flex items-center">
                  <Waves className="mr-2 h-4 w-4 text-green-500" />
                  <span>Swimming Pool</span>
                </div>
              )}
              {property.features?.security && (
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-green-500" />
                  <span>Security</span>
                </div>
              )}
              {property.features?.elevator && (
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4 text-green-500" />
                  <span>Elevator</span>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Reviews</h2>
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(property.averageRating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">
                {property.averageRating ? property.averageRating.toFixed(1) : 'No'} ({property.numReviews || 0} reviews)
              </span>
            </div>

            {property.reviews && property.reviews.length > 0 ? (
              <div className="space-y-6">
                {property.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-6">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {review.user?.avatar ? (
                          <img
                            src={review.user.avatar}
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{review.user?.name || 'Anonymous'}</div>
                        <div className="text-sm text-gray-500">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
                        </div>
                      </div>
                      <div className="ml-auto flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (review.rating || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment || 'No comment'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No reviews yet</p>
                <p className="text-gray-400 text-sm mb-4">Be the first to review this property</p>
              </div>
            )}
          </div>

          {/* Similar Properties Section */}
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold">Similar Properties</h2>
            {similarProperties.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similarProperties.map((similarProperty) => (
                  <PropertyCard
                    key={similarProperty._id}
                    id={similarProperty._id}
                    title={similarProperty.title}
                    location={`${similarProperty.location.city}, ${similarProperty.location.state}`}
                    price={`$${similarProperty.price.toLocaleString()}`}
                    type={similarProperty.status}
                    propertyType={similarProperty.type}
                    bedrooms={similarProperty.features.bedrooms}
                    bathrooms={similarProperty.features.bathrooms}
                    area={`${similarProperty.features.area} sq ft`}
                    image={similarProperty.images[0] || '/placeholder.svg'}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">No similar properties found at this time.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="sticky top-24 rounded-lg border bg-card p-6 shadow-sm">
            {property.owner ? (
              <ContactAgentForm
                propertyId={property._id}
                agentId={property.owner._id}
                agentName={property.owner.name || 'Agent'}
                agentEmail={property.owner.email || 'agent@example.com'}
                agentPhone={property.owner.phone || 'Not available'}
                propertyTitle={property.title || 'Property'}
              />
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-500">Agent information not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
