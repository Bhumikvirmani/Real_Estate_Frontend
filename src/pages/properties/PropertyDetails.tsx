import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { ContactAgentForm } from '@/components/property/ContactAgentForm';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Heart,
  Share,
  MapPin,
  Ruler,
  BedDouble,
  Bath,
  Building,
  Phone,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Check
} from 'lucide-react';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  type: string;
  status: 'sale' | 'rent';
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    furnished: boolean;
    parking: boolean;
  };
  images: string[];
  owner: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [showContactForm, setShowContactForm] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { data: property, loading, fetchData } = useApi<Property>();

  useEffect(() => {
    if (id && id !== 'undefined' && id !== 'null') {
      fetchData({
        url: `/api/properties/${id}`,
        method: 'GET',
      });
    } else {
      console.error('Invalid property ID:', id);
    }
  }, [id, fetchData]);

  const handleContactAgent = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowContactForm(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Skeleton className="h-96 w-full mb-6" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="w-full lg:w-1/3">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Property not found</h2>
          <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/properties')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {/* Property images gallery */}
        <div className="mb-8">
          {property.images && property.images.length > 0 ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={property.images[0]}
                alt={property.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
              <Building className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </div>

        {/* Property details */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-4">
              <Badge className={property.status === 'sale' ? 'bg-blue-500' : 'bg-teal-500'}>
                For {property.status === 'sale' ? 'Sale' : 'Rent'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFavorite(property._id)}
                className={isFavorite(property._id) ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`mr-2 h-4 w-4 ${isFavorite(property._id) ? 'fill-red-500' : ''}`} />
                {isFavorite(property._id) ? 'Saved' : 'Save'}
              </Button>
            </div>

            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="h-5 w-5 mr-1" />
              <span>
                {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
              </span>
            </div>

            <div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-teal-600" />
                <div>
                  <span className="block text-sm text-gray-500">Property Type</span>
                  <span className="font-medium capitalize">{property.type}</span>
                </div>
              </div>
              {property.features.bedrooms > 0 && (
                <div className="flex items-center">
                  <BedDouble className="h-5 w-5 mr-2 text-teal-600" />
                  <div>
                    <span className="block text-sm text-gray-500">Bedrooms</span>
                    <span className="font-medium">{property.features.bedrooms}</span>
                  </div>
                </div>
              )}
              {property.features.bathrooms > 0 && (
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-teal-600" />
                  <div>
                    <span className="block text-sm text-gray-500">Bathrooms</span>
                    <span className="font-medium">{property.features.bathrooms}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <Ruler className="h-5 w-5 mr-2 text-teal-600" />
                <div>
                  <span className="block text-sm text-gray-500">Area</span>
                  <span className="font-medium">{property.features.area} sq ft</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <div className="prose max-w-none">
                <p>{property.description}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {property.features.furnished && (
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-teal-600" />
                    Furnished
                  </li>
                )}
                {property.features.parking && (
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-teal-600" />
                    Parking Available
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold mb-4 text-teal-700">
                  ${property.price.toLocaleString()}
                  {property.status === 'rent' && <span className="text-sm font-normal text-gray-600">/month</span>}
                </div>

                <div className="mb-6 border-b pb-6">
                  <h3 className="font-medium mb-2">Listed by:</h3>
                  <div className="flex items-center mb-4">
                    <div>
                      <p className="font-medium">{property.owner.name}</p>
                      <p className="text-sm text-gray-500">Property Owner</p>
                    </div>
                  </div>
                  {property.owner.phone && (
                    <div className="flex items-center mb-2 text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{property.owner.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button onClick={handleContactAgent} className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share className="mr-2 h-4 w-4" />
                    Share Property
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {showContactForm && (
              <div className="mt-6">
                <ContactAgentForm
                  propertyId={property._id}
                  agentId={property.owner._id}
                  agentName={property.owner.name || 'Agent'}
                  agentEmail={property.owner.email || 'agent@example.com'}
                  agentPhone={property.owner.phone || 'Not available'}
                  propertyTitle={property.title || 'Property'}
                />
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setShowContactForm(false)}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetails;

