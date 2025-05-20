
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeaturedProperties from '@/components/home/FeaturedProperties';
// import PropertyCategories from '@/components/home/PropertyCategories';
import PropertyCategories from '@/components/home/PropertyCategories';
import HowItWorks from '@/components/home/HowItWorks';
import PopularLocations from '@/components/home/PopularLocations';
import Newsletter from '@/components/home/Newsletter';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <PropertyCategories />
      <FeaturedProperties />
      <HowItWorks />
      <PopularLocations />
      <Newsletter />
    </Layout>
  );
};

export default Index;
