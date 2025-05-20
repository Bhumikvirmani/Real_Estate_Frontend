
import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Hero = () => {
  const [propertyType, setPropertyType] = useState('buy');

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-teal-700 to-teal-500 py-16 md:py-24">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Find Your <span className="text-teal-200">Perfect Home</span> With Us
          </h1>
          <p className="mt-4 text-lg text-teal-50">
            Browse through thousands of properties for sale and rent across the country
          </p>

          <div className="mt-8 rounded-lg bg-white p-4 shadow-lg">
            <Tabs
              defaultValue="buy"
              className="mb-6"
              onValueChange={(value) => setPropertyType(value)}
            >
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
                <TabsTrigger value="pg">PG/Co-living</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid gap-4 md:grid-cols-12">
              <div className="relative md:col-span-5">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Enter city, locality or project"
                  className="pl-9"
                />
              </div>
              
              <div className="md:col-span-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10l">Upto 10 Lac</SelectItem>
                    <SelectItem value="20l">Upto 20 Lac</SelectItem>
                    <SelectItem value="30l">Upto 30 Lac</SelectItem>
                    <SelectItem value="40l">Upto 40 Lac</SelectItem>
                    <SelectItem value="50l">Upto 50 Lac</SelectItem>
                    <SelectItem value="60l">Upto 60 Lac</SelectItem>
                    <SelectItem value="70l">Upto 70 Lac</SelectItem>
                    <SelectItem value="80l">Upto 80 Lac</SelectItem>
                    <SelectItem value="90l">Upto 90 Lac</SelectItem>
                    <SelectItem value="1cr">Upto 1 Cr</SelectItem>
                    <SelectItem value="2cr">Upto 2 Cr</SelectItem>
                    <SelectItem value="5cr">Upto 5 Cr</SelectItem>
                    <SelectItem value="10cr">Upto 10 Cr</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC41Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00TTYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTI0LTEyYzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0tMTIgMGMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtMC0xMmMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtMTIgMGMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtMTIgMTJjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bS0yNCAwYzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0xMiAxMmMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTQiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      </div>
    </div>
  );
};

export default Hero;
