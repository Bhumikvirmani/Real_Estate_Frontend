import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface PropertySearchProps {
  defaultStatus?: 'sale' | 'rent';
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ defaultStatus = 'sale' }) => {
  const [status, setStatus] = useState<'sale' | 'rent'>(defaultStatus);
  const [query, setQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (propertyType) params.append('type', propertyType);

    // Navigate to the appropriate page based on status
    const path = status === 'rent' ? '/properties/rent' : '/properties';

    navigate({
      pathname: path,
      search: params.toString()
    });

    toast({
      title: "Search initiated",
      description: `Searching for ${status} properties${query ? ': ' + query : ''}`,
    });
  };

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Tabs defaultValue={status} onValueChange={(value) => setStatus(value as 'sale' | 'rent')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sale">Buy</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter location, landmark, project..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="md:w-1/4">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">All Property Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <Button type="submit" className="md:w-[120px]">
                Search
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
