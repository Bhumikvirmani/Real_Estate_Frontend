
import { Search, Home, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  isLast?: boolean;
}

const Step = ({ number, title, description, icon: Icon, isLast = false }: StepProps) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative mb-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white">
        <Icon className="h-6 w-6" />
      </div>
      {!isLast && (
        <div className="absolute left-full top-1/2 h-0.5 w-full -translate-y-1/2 bg-teal-200 hidden md:block"></div>
      )}
    </div>
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-lg mb-3",
      )}
    >
      {number}
    </div>
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Search and Explore',
      description: 'Browse thousands of properties and find the one that fits your needs',
      icon: Search,
    },
    {
      number: 2,
      title: 'Select Your Property',
      description: 'Choose from a variety of options that match your requirements',
      icon: Home,
    },
    {
      number: 3,
      title: 'Get Your Dream Home',
      description: 'Connect with owners or agents and finalize your dream property',
      icon: Key,
      isLast: true,
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Finding and securing your dream property is just a few simple steps away
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Step
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              isLast={step.isLast}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
