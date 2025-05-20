import React, { useState, useEffect } from 'react';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Building, Award, MapPin } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  // Basic user fields
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),

  // Agent-specific fields
  specialization: z.string().optional(),
  experience: z.coerce.number().min(0, 'Experience cannot be negative').optional(),
  areas: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => !data.password || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof formSchema>;

// Interface for agent profile data
interface AgentProfile {
  _id: string;
  license: string;
  company?: string;
  experience: number;
  specialization?: string;
  areas: string[];
  bio?: string;
  verified: boolean;
}

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const { fetchData, loading } = useApi();
  const { fetchData: fetchAgentData, loading: agentLoading } = useApi();
  const [avatar, setAvatar] = useState<string>(user?.avatar || '');
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [isLoadingAgentProfile, setIsLoadingAgentProfile] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      password: '',
      confirmPassword: '',
      specialization: '',
      experience: 0,
      areas: '',
      bio: '',
    },
  });

  // Fetch agent profile if user is an agent
  const fetchAgentProfile = async () => {
    if (user?.role !== 'agent') return;

    setIsLoadingAgentProfile(true);
    try {
      const result = await fetchAgentData({
        url: '/api/agents/profile',
        method: 'GET',
        requireAuth: true,
      });

      if (result) {
        setAgentProfile(result);

        // Update form with agent data
        form.setValue('specialization', result.specialization || '');
        form.setValue('experience', result.experience || 0);
        form.setValue('areas', result.areas?.join(', ') || '');
        form.setValue('bio', result.bio || '');

        // If company is in agent profile but not in user profile, use it
        if (result.company && !user.company) {
          form.setValue('company', result.company);
        }
      }
    } catch (error) {
      console.error('Failed to fetch agent profile:', error);
      // Don't show error toast as the user might not have completed agent registration yet
    } finally {
      setIsLoadingAgentProfile(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Update form values when user data is available
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        company: user.company || '',
        password: '',
        confirmPassword: '',
        specialization: '',
        experience: 0,
        areas: '',
        bio: '',
      });
      setAvatar(user.avatar || '');

      // Fetch agent profile if user is an agent
      if (user.role === 'agent') {
        fetchAgentProfile();
      }
    }
  }, [isAuthenticated, navigate, user, form]);

  const handleAvatarUpload = (imageUrls: string[]) => {
    if (imageUrls.length > 0) {
      setAvatar(imageUrls[0]);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Prepare the update data for user profile
      const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        avatar: avatar || null,
      };

      // Only include password if it was provided
      if (data.password) {
        updateData['password'] = data.password;
      }

      // Update user profile
      const userResult = await fetchData({
        url: '/api/users/profile',
        method: 'PUT',
        body: updateData,
        requireAuth: true,
      });

      // If user is an agent, update agent profile
      if (user?.role === 'agent') {
        // Convert comma-separated areas to array
        const areasArray = data.areas
          ? data.areas.split(',').map(area => area.trim()).filter(area => area)
          : [];

        const agentUpdateData = {
          company: data.company || null,
          experience: data.experience || 0,
          specialization: data.specialization || null,
          areas: areasArray,
          bio: data.bio || null,
        };

        try {
          await fetchAgentData({
            url: '/api/agents/profile',
            method: 'PUT',
            body: agentUpdateData,
            requireAuth: true,
          });
        } catch (agentError) {
          console.error('Failed to update agent profile:', agentError);
          toast({
            variant: "destructive",
            title: "Partial Update",
            description: "Your basic profile was updated, but we couldn't update your agent details.",
          });
          return;
        }
      }

      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your profile. Please try again.",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <User className="mr-2 h-6 w-6" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-8">
              <Avatar className="h-24 w-24 mb-4">
                {avatar ? (
                  <AvatarImage src={avatar} alt={user?.name || 'User'} />
                ) : (
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                )}
              </Avatar>

              <div className="w-full max-w-xs">
                <ImageUpload
                  onImageUpload={handleAvatarUpload}
                  maxImages={1}
                  type="profile"
                  initialImages={avatar ? [avatar] : []}
                />
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Agent-specific fields */}
                {user?.role === 'agent' && (
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Building className="mr-2 h-5 w-5" />
                      Agent Profile
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialization</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Residential, Commercial, Luxury Homes"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Your area of expertise in real estate
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="e.g. 5"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              How many years you've worked in real estate
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="areas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Areas Served</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Manhattan, Brooklyn, Queens"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of neighborhoods or cities you serve
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel>Professional Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell potential clients about yourself, your experience, and your approach..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A brief professional description that will appear on your agent profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password (Optional)</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Leave blank to keep current password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
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

export default ProfileSettings;
