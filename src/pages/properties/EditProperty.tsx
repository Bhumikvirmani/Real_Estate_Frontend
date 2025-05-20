import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Home, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title is too long'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['house', 'apartment', 'condo', 'villa', 'land']),
  status: z.enum(['for sale', 'for rent', 'sold', 'rented']),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  bedrooms: z.coerce.number().min(0, 'Bedrooms cannot be negative'),
  bathrooms: z.coerce.number().min(0, 'Bathrooms cannot be negative'),
  area: z.coerce.number().min(0, 'Area must be a positive number'),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  furnished: z.boolean().optional(),
  parking: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { fetchData, loading } = useApi();
  const { data: property, loading: propertyLoading, fetchData: fetchProperty } = useApi();
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'house',
      status: 'for sale',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      furnished: false,
      parking: false,
    },
  });

  // Fetch property data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      fetchProperty({
        url: `/api/properties/${id}`,
        method: 'GET',
        requireAuth: true,
      });
    }
  }, [isAuthenticated, navigate, id, fetchProperty]);

  // Populate form with property data
  useEffect(() => {
    if (property?.property) {
      const p = property.property;
      form.reset({
        title: p.title,
        description: p.description,
        type: p.type,
        status: p.status,
        price: p.price,
        bedrooms: p.features.bedrooms || 0,
        bathrooms: p.features.bathrooms || 0,
        area: p.features.area || 0,
        address: p.location.address,
        city: p.location.city,
        state: p.location.state,
        zipCode: p.location.zipCode || '',
        furnished: p.features.furnished || false,
        parking: p.features.parking || false,
      });
      setPropertyImages(p.images || []);
    }
  }, [property, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const propertyData = {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        price: data.price,
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        features: {
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area,
          parking: data.parking,
          furnished: data.furnished,
        },
        images: propertyImages,
      };

      const result = await fetchData({
        url: `/api/properties/${id}`,
        method: 'PUT',
        body: propertyData,
        requireAuth: true,
      });

      if (result) {
        toast({
          title: 'Success',
          description: 'Property has been updated successfully',
        });
        navigate(`/property/${id}`);
      }
    } catch (error) {
      console.error('Failed to update property:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update property. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (propertyLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <Skeleton className="h-8 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Home className="mr-2 h-6 w-6" />
              Edit Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Beautiful Apartment in City Center" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="for sale">For Sale</SelectItem>
                            <SelectItem value="for rent">For Rent</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your property"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-4">Property Location</h3>
                  </div>

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-4">Property Features</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area (sq ft)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4">
                    <FormField
                      control={form.control}
                      name="furnished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Furnished</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Parking</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Updating...' : 'Update Property'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditProperty;
