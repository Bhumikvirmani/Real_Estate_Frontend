import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2 } from "lucide-react";

interface LoanOption {
  id: number;
  name: string;
  amount: number;
  interestRate: number;
  term: number;
  type: string;
  points: number;
  fees: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

const LoanComparison = () => {
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([
    {
      id: 1,
      name: "Option 1",
      amount: 300000,
      interestRate: 5.5,
      term: 30,
      type: "Fixed",
      points: 0,
      fees: 3000,
      monthlyPayment: 0,
      totalInterest: 0,
      totalCost: 0
    },
    {
      id: 2,
      name: "Option 2",
      amount: 300000,
      interestRate: 4.75,
      term: 15,
      type: "Fixed",
      points: 1,
      fees: 4000,
      monthlyPayment: 0,
      totalInterest: 0,
      totalCost: 0
    }
  ]);

  const [activeTab, setActiveTab] = useState("comparison");

  // Calculate loan details for all options
  const calculateLoanDetails = () => {
    const updatedOptions = loanOptions.map(option => {
      // Calculate points cost
      const pointsCost = (option.points / 100) * option.amount;
      
      // Calculate monthly payment
      const monthlyInterestRate = option.interestRate / 100 / 12;
      const loanTermMonths = option.term * 12;
      
      let monthlyPayment;
      if (monthlyInterestRate === 0) {
        monthlyPayment = option.amount / loanTermMonths;
      } else {
        monthlyPayment = option.amount * 
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / 
          (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
      }
      
      // Calculate total interest
      const totalPayments = monthlyPayment * loanTermMonths;
      const totalInterest = totalPayments - option.amount;
      
      // Calculate total cost (loan + interest + points + fees)
      const totalCost = option.amount + totalInterest + pointsCost + option.fees;
      
      return {
        ...option,
        monthlyPayment,
        totalInterest,
        totalCost
      };
    });
    
    setLoanOptions(updatedOptions);
  };

  // Calculate on initial render and when loan options change
  useEffect(() => {
    calculateLoanDetails();
  }, []);

  // Handle input changes for a specific loan option
  const handleInputChange = (id: number, field: keyof LoanOption, value: any) => {
    const updatedOptions = loanOptions.map(option => {
      if (option.id === id) {
        return { ...option, [field]: value };
      }
      return option;
    });
    
    setLoanOptions(updatedOptions);
  };

  // Add a new loan option
  const addLoanOption = () => {
    if (loanOptions.length >= 3) return; // Limit to 3 options
    
    const newId = Math.max(...loanOptions.map(o => o.id), 0) + 1;
    const newOption: LoanOption = {
      id: newId,
      name: `Option ${newId}`,
      amount: 300000,
      interestRate: 5,
      term: 30,
      type: "Fixed",
      points: 0,
      fees: 3000,
      monthlyPayment: 0,
      totalInterest: 0,
      totalCost: 0
    };
    
    setLoanOptions([...loanOptions, newOption]);
  };

  // Remove a loan option
  const removeLoanOption = (id: number) => {
    if (loanOptions.length <= 1) return; // Keep at least one option
    
    const updatedOptions = loanOptions.filter(option => option.id !== id);
    setLoanOptions(updatedOptions);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format currency with cents
  const formatCurrencyWithCents = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Loan Comparison Tool</CardTitle>
        <CardDescription>
          Compare different mortgage options side by side to find the best fit for your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="details">Loan Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loanOptions.map((option) => (
                <Card key={option.id} className="relative">
                  {loanOptions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeLoanOption(option.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <CardHeader className="pb-2">
                    <Input
                      value={option.name}
                      onChange={(e) => handleInputChange(option.id, 'name', e.target.value)}
                      className="font-bold text-lg"
                    />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`amount-${option.id}`}>Loan Amount</Label>
                      <Input
                        id={`amount-${option.id}`}
                        type="number"
                        value={option.amount}
                        onChange={(e) => handleInputChange(option.id, 'amount', Number(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`interestRate-${option.id}`}>Interest Rate (%)</Label>
                      <Input
                        id={`interestRate-${option.id}`}
                        type="number"
                        value={option.interestRate}
                        onChange={(e) => handleInputChange(option.id, 'interestRate', Number(e.target.value))}
                        step="0.125"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`term-${option.id}`}>Loan Term (years)</Label>
                      <Select
                        value={option.term.toString()}
                        onValueChange={(value) => handleInputChange(option.id, 'term', Number(value))}
                      >
                        <SelectTrigger id={`term-${option.id}`}>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 years</SelectItem>
                          <SelectItem value="15">15 years</SelectItem>
                          <SelectItem value="20">20 years</SelectItem>
                          <SelectItem value="30">30 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`type-${option.id}`}>Loan Type</Label>
                      <Select
                        value={option.type}
                        onValueChange={(value) => handleInputChange(option.id, 'type', value)}
                      >
                        <SelectTrigger id={`type-${option.id}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fixed">Fixed Rate</SelectItem>
                          <SelectItem value="ARM5">5/1 ARM</SelectItem>
                          <SelectItem value="ARM7">7/1 ARM</SelectItem>
                          <SelectItem value="ARM10">10/1 ARM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`points-${option.id}`}>Points</Label>
                      <Input
                        id={`points-${option.id}`}
                        type="number"
                        value={option.points}
                        onChange={(e) => handleInputChange(option.id, 'points', Number(e.target.value))}
                        step="0.125"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`fees-${option.id}`}>Closing Costs & Fees</Label>
                      <Input
                        id={`fees-${option.id}`}
                        type="number"
                        value={option.fees}
                        onChange={(e) => handleInputChange(option.id, 'fees', Number(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {loanOptions.length < 3 && (
                <div className="flex items-center justify-center h-full">
                  <Button 
                    variant="outline" 
                    className="h-32 border-dashed"
                    onClick={addLoanOption}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Loan Option
                  </Button>
                </div>
              )}
            </div>
            
            <Button onClick={calculateLoanDetails} className="w-full">
              Compare Loans
            </Button>
          </TabsContent>
          
          <TabsContent value="comparison">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comparison</TableHead>
                  {loanOptions.map((option) => (
                    <TableHead key={option.id}>{option.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Loan Amount</TableCell>
                  {loanOptions.map((option) => (
                    <TableCell key={option.id}>{formatCurrency(option.amount)}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Interest Rate</TableCell>
                  {loanOptions.map((option) => (
                    <TableCell key={option.id}>{option.interestRate}%</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Loan Term</TableCell>
                  {loanOptions.map((option) => (
                    <TableCell key={option.id}>{option.term} years</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Loan Type</TableCell>
                  {loanOptions.map((option) => (
                    <TableCell key={option.id}>{option.type}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Points</TableCell>
                  {loanOptions.map((option) => (
                    <TableCell key={option.id}>{option.points}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Closing Costs & Fees</TableCell>
                  {loanOptions.map((option) => (
                    <TableCell key={option.id}>{formatCurrency(option.fees)}</TableCell>
                  ))}
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-medium">Monthly Payment</TableCell>
                  {loanOptions.map((option) => (
                    <TableCell key={option.id} className="font-bold">
                      {formatCurrencyWithCents(option.monthlyPayment)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Interest Paid</TableCell>
                  {loanOptions.map((option) => (
                    <TableCell key={option.id}>{formatCurrency(option.totalInterest)}</TableCell>
                  ))}
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-medium">Total Cost of Loan</TableCell>
                  {loanOptions.map((option) => (
                    <TableCell key={option.id} className="font-bold">
                      {formatCurrency(option.totalCost)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>* Total cost includes principal, interest, points, and closing costs/fees.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab(activeTab === "comparison" ? "details" : "comparison")}>
          {activeTab === "comparison" ? "Edit Loan Details" : "View Comparison"}
        </Button>
        <Button onClick={calculateLoanDetails}>Recalculate</Button>
      </CardFooter>
    </Card>
  );
};

export default LoanComparison;
