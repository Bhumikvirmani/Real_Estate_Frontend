
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-12 md:py-16 bg-teal-900 text-white">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Stay Updated with BRICKHIVE
          </h2>
          <p className="text-teal-100 mb-6">
            Subscribe to our newsletter for the latest property listings, market insights, and exclusive offers
          </p>

          {subscribed ? (
            <div className="bg-teal-800/50 rounded-lg p-6">
              <p className="text-lg font-medium">
                Thank you for subscribing!
              </p>
              <p className="text-teal-200 mt-1">
                We've sent a confirmation email to your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="bg-white text-teal-900 hover:bg-teal-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
