import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Phone, Mail, User } from 'lucide-react';

const formSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ContactAgentFormProps {
  propertyId: string;
  agentId: string;
  agentName: string;
  agentEmail: string;
  agentPhone: string;
  propertyTitle: string;
}

export function ContactAgentForm({
  propertyId,
  agentId,
  agentName,
  agentEmail,
  agentPhone,
  propertyTitle,
}: ContactAgentFormProps) {
  const { user } = useAuth();
  const { fetchData } = useApi();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      message: `Hi, I am interested in ${propertyTitle}.`,
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await fetchData({
        url: '/api/messages',
        method: 'POST',
        body: {
          propertyId,
          recipient: agentId, // Add the recipient field (agent ID)
          subject: `Inquiry about ${propertyTitle}`, // Add a subject line
          ...data
        },
        requireAuth: true
      });

      if (result) {
        toast({
          title: 'Message Sent',
          description: 'Your message has been sent to the agent.',
        });
        form.reset();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Contact Agent</h3>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-2 h-4 w-4" />
            <span>{agentName}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            <a href={`mailto:${agentEmail}`}>{agentEmail}</a>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="mr-2 h-4 w-4" />
            <a href={`tel:${agentPhone}`}>{agentPhone}</a>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
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
                  <Input type="email" placeholder="Your email" {...field} />
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
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your message here"
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </Form>
    </Card>
  );
}
