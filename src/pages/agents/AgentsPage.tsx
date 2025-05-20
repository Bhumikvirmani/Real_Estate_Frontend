
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useApi } from '@/hooks/useApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Search, MapPin, Home, Phone, Mail, Award, CheckCircle } from 'lucide-react';

interface Agent {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  license: string;
  company: string;
  experience: number;
  specialization: string;
  areas: string[];
  bio: string;
  verified: boolean;
  rating: number;
  numReviews: number;
  profileImage?: string;
  properties: any[];
}

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, fetchData } = useApi<{ agents: Agent[], total: number, page: number, pages: number }>();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    
    if (searchTerm) {
      params.append('keyword', searchTerm);
    }
    
    fetchData({
      url: `/api/agents?${params.toString()}`,
      method: 'GET',
    });
    
    console.log('Fetching agents with params:', params.toString());
  }, [fetchData, searchTerm, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      ));
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Find a Real Estate Agent</h1>
            <p className="text-gray-600">Connect with top-rated agents in your area</p>
          </div>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <Input
              type="search"
              placeholder="Search by name, area, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit" className="ml-2">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex justify-center p-6 bg-gray-100">
                  <Skeleton className="h-24 w-24 rounded-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {data?.agents && data.agents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.agents.map((agent) => (
                  <Card key={agent._id} className="overflow-hidden">
                    <div className="flex justify-center p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-semibold text-blue-700 overflow-hidden">
                          {agent.profileImage ? (
                            <img 
                              src={agent.profileImage} 
                              alt={agent.user.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            agent.user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        {agent.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{agent.user.name}</CardTitle>
                        {agent.verified && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center mt-1">
                        <Award className="h-4 w-4 mr-1 text-blue-500" />
                        {agent.company}
                      </CardDescription>
                      
                      <div className="flex items-center mt-2">
                        <div className="flex mr-1">{renderStars(agent.rating)}</div>
                        <span className="text-sm text-gray-500">
                          ({agent.numReviews} {agent.numReviews === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {agent.specialization && (
                        <div className="flex items-start">
                          <Home className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Specialization</p>
                            <p className="text-sm text-gray-500">{agent.specialization}</p>
                          </div>
                        </div>
                      )}
                      
                      {agent.areas && agent.areas.length > 0 && (
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Areas Served</p>
                            <p className="text-sm text-gray-500">{agent.areas.join(', ')}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start">
                        <Award className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Experience</p>
                          <p className="text-sm text-gray-500">{agent.experience} {agent.experience === 1 ? 'year' : 'years'}</p>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" className="flex items-center gap-1">
                        <Phone className="h-4 w-4" /> Call
                      </Button>
                      <Button variant="outline" className="flex items-center gap-1">
                        <Mail className="h-4 w-4" /> Email
                      </Button>
                      <Button>View Profile</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <p className="text-lg text-gray-500">No agents found matching your criteria</p>
                {searchTerm && (
                  <Button variant="link" className="mt-4" onClick={() => setSearchTerm('')}>
                    Clear search
                  </Button>
                )}
              </div>
            )}
            
            {/* Pagination */}
            {data?.pages && data.pages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {[...Array(data.pages)].map((_, i) => (
                  <Button 
                    key={i} 
                    variant={data.page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AgentsPage;
