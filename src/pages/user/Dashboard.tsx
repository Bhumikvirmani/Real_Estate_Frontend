import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { ManageablePropertyCard } from '@/components/property/ManageablePropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Plus, Heart, MessageSquare, User, Bell } from 'lucide-react';
import { MessageList, Message } from '@/components/messages/MessageList';

interface Property {
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
}

interface FavoriteProperty {
  _id: string;
  property: Property;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('properties');

  const { data: propertiesData, loading: propertiesLoading, fetchData: fetchProperties } = useApi<{properties: Property[]}>();
  const { data: favorites, loading: favoritesLoading, fetchData: fetchFavorites } = useApi<FavoriteProperty[]>();
  const {
    data: messages,
    loading: messagesLoading,
    fetchData: fetchMessages,
    reset: resetMessages
  } = useApi<Message[]>();
  const { fetchData: fetchPropertyActions } = useApi();

  // Fetch messages and count unread
  const loadMessages = useCallback(() => {
    if (isAuthenticated) {
      fetchMessages({
        url: '/api/messages',
        method: 'GET',
        requireAuth: true,
      }).then(data => {
        if (data) {
          // Count unread messages where the user is the recipient
          const unread = data.filter(
            msg => msg.recipient._id === user?._id && !msg.read
          ).length;
          setUnreadCount(unread);
        }
      });
    }
  }, [isAuthenticated, fetchMessages, user?._id]);

  // Delete a message
  const handleDeleteMessage = useCallback(async (messageId: string) => {
    try {
      const result = await fetchMessages({
        url: `/api/messages/${messageId}`,
        method: 'DELETE',
        requireAuth: true,
      });

      if (result) {
        toast({
          title: 'Message deleted',
          description: 'The message has been deleted successfully.',
        });
        loadMessages(); // Reload messages
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the message. Please try again.',
      });
    }
  }, [fetchMessages, loadMessages, toast]);

  // Mark a message as read
  const handleMarkAsRead = useCallback(async (messageId: string) => {
    try {
      const result = await fetchMessages({
        url: `/api/messages/${messageId}/read`,
        method: 'PATCH',
        requireAuth: true,
      });

      if (result) {
        loadMessages(); // Reload messages to update unread count
      }
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  }, [fetchMessages, loadMessages]);

  // Reply to a message
  const handleReplyToMessage = useCallback(async (originalMessage: Message, replyText: string) => {
    try {
      const result = await fetchMessages({
        url: '/api/messages',
        method: 'POST',
        body: {
          subject: `Re: ${originalMessage.subject}`,
          message: replyText,
          propertyId: originalMessage.property._id,
          recipient: originalMessage.sender._id,
        },
        requireAuth: true,
      });

      if (result) {
        toast({
          title: 'Reply sent',
          description: 'Your reply has been sent successfully.',
        });
        loadMessages(); // Reload messages
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send your reply. Please try again.',
      });
    }
  }, [fetchMessages, loadMessages, toast]);

  // Delete a property
  const handleDeleteProperty = useCallback(async (propertyId: string) => {
    try {
      const result = await fetchPropertyActions({
        url: `/api/properties/${propertyId}`,
        method: 'DELETE',
        requireAuth: true,
      });

      if (result) {
        toast({
          title: 'Property deleted',
          description: 'The property has been deleted successfully.',
        });

        // Refresh properties list
        fetchProperties({
          url: '/api/properties/user',
          method: 'GET',
          requireAuth: true,
        }).then(data => {
          console.log('Updated properties after deletion:', data);
        });
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the property. Please try again.',
      });
      throw error; // Re-throw to handle in the component
    }
  }, [fetchPropertyActions, fetchProperties, toast]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchProperties({
      url: '/api/properties/user',
      method: 'GET',
      requireAuth: true,
    }).then(data => {
      console.log('User properties response:', data);
    }).catch(err => {
      console.error('Error fetching user properties:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load your properties. Please try again.',
      });
    });

    fetchFavorites({
      url: '/api/favorites',
      method: 'GET',
      requireAuth: true,
    });

    loadMessages();

    // Set up interval to check for new messages every minute
    const intervalId = setInterval(loadMessages, 60000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, navigate, fetchProperties, fetchFavorites, loadMessages]);

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

        <Tabs
          defaultValue="properties"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="properties">
              <Home className="h-4 w-4 mr-2" />
              My Properties
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="messages">
              <div className="relative">
                <MessageSquare className="h-4 w-4 mr-2" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              Messages
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="mt-6">
            <div className="flex justify-end mb-6">
              <Button asChild>
                <Link to="/add-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Property
                </Link>
              </Button>
            </div>

            {propertiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="h-[300px] rounded-lg" />
                ))}
              </div>
            ) : propertiesData?.properties?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertiesData.properties.map((property) => (
                  <ManageablePropertyCard
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
                    onDelete={handleDeleteProperty}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Properties Listed</h3>
                  <p className="text-gray-500 mb-4">
                    You haven't listed any properties yet. Add your first property to get started.
                  </p>
                  <Button asChild>
                    <Link to="/add-property">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Property
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {favoritesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="h-[300px] rounded-lg" />
                ))}
              </div>
            ) : favorites?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(({ property }) => (
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
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <Heart className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Favorite Properties</h3>
                  <p className="text-gray-500 mb-4">
                    Start saving properties you like to keep track of them here.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/properties">Browse Properties</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            {user && (
              <MessageList
                messages={messages || []}
                currentUserId={user._id}
                onDeleteMessage={handleDeleteMessage}
                onMarkAsRead={handleMarkAsRead}
                onReply={handleReplyToMessage}
                loading={messagesLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="flex justify-end mb-6">
              <Button asChild>
                <Link to="/user/profile-settings">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
            <Card>
              <CardContent className="py-8 text-center">
                <div className="mb-4 flex justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Profile Settings</h3>
                <p className="text-gray-500 mb-4">
                  Update your profile information and preferences.
                </p>
                <Button asChild variant="outline">
                  <Link to="/user/profile-settings">Manage Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;

