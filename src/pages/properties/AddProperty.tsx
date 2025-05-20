import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Home } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title is too long'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['house', 'apartment', 'condo', 'villa', 'land']), // Updated enum values
  status: z.enum(['for sale', 'for rent', 'sold', 'rented']), // Updated enum values
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  bedrooms: z.coerce.number().min(1, 'At least one bedroom required'),
  bathrooms: z.coerce.number().min(1, 'At least one bathroom required'),
  area: z.coerce.number().min(0, 'Area must be a positive number'),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  furnished: z.boolean().optional(),
  parking: z.boolean().optional(),
  images: z.any(),
});

type FormData = z.infer<typeof formSchema>;

const AddProperty = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { fetchData, loading } = useApi();
  const [propertyImages, setPropertyImages] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'house', // Updated default value
      status: 'for sale', // Updated default value
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      furnished: false,
      parking: false,
    },
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
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
          coordinates: {
            latitude: 0,
            longitude: 0,
          }
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
        url: '/api/properties',
        method: 'POST',
        body: propertyData,
        requireAuth: true,
      });

      if (result) {
        toast({
          title: 'Success',
          description: 'Property has been listed successfully',
        });
        navigate(`/property/${result._id}`);
      }
    } catch (error) {
      console.error('Failed to add property:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Home className="mr-2 h-6 w-6" />
              List Your Property
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
                              <SelectValue placeholder="Select Property Type" />
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
                        <FormLabel>Listing Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="For Sale or Rent" />
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
                          <Input
                            type="number"
                            placeholder="100000"
                            {...field}
                            value={field.value}
                            onChange={event => field.onChange(event.target.valueAsNumber || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Number of Bedrooms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['1', '2', '3', '4', '5', '6+'].map(num => (
                              <SelectItem key={num} value={num}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Number of Bathrooms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['1', '2', '3', '4', '5+'].map(num => (
                              <SelectItem key={num} value={num}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <Input
                            type="number"
                            placeholder="1000"
                            {...field}
                            value={field.value}
                            onChange={event => field.onChange(event.target.valueAsNumber || 0)}
                          />
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Furnished</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Parking</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

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
                    <h3 className="text-lg font-medium mb-4">Property Images</h3>
                    <ImageUpload
                      onImageUpload={setPropertyImages}
                      maxImages={10}
                      type="property"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/properties')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'List Property'}
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

export default AddProperty;
