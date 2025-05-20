
import React from 'react';
import Layout from '@/components/layout/Layout';
import MortgageCalculator from '@/components/mortgage/MortgageCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MortgageCalculatorPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Mortgage Calculator</h1>
        <p className="text-gray-600 mb-8">Plan your home purchase with our mortgage calculation tools</p>
        
        <Tabs defaultValue="calculator" className="mb-8">
          <TabsList>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="affordability">Affordability</TabsTrigger>
            <TabsTrigger value="comparison">Loan Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="mt-4">
            <MortgageCalculator />
          </TabsContent>
          
          <TabsContent value="affordability" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Affordability Calculator</CardTitle>
                <CardDescription>
                  Determine how much house you can afford based on your income and expenses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-12">
                  Affordability calculator coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Loan Comparison</CardTitle>
                <CardDescription>
                  Compare different loan options side by side.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-12">
                  Loan comparison tool coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Mortgage Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li><strong>Principal:</strong> The initial amount of your loan.</li>
                <li><strong>Interest Rate:</strong> The annual cost of borrowing expressed as a percentage.</li>
                <li><strong>Loan Term:</strong> The length of time to repay the loan (typically 15 or 30 years).</li>
                <li><strong>Down Payment:</strong> The upfront payment you make toward your home purchase.</li>
                <li><strong>APR:</strong> Annual Percentage Rate includes interest and other costs.</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips for Home Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>Consider making a larger down payment to reduce monthly costs.</li>
                <li>Shop around for the best mortgage rates and terms.</li>
                <li>Pay attention to both interest rate and APR when comparing loans.</li>
                <li>Check if you qualify for first-time homebuyer programs.</li>
                <li>Factor in property taxes, insurance, and maintenance costs.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MortgageCalculatorPage;
