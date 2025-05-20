
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface MortgageCalculatorProps {
  defaultPrincipal?: number;
}

interface MortgageCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principalPayment: number;
    interestPayment: number;
    remainingBalance: number;
  }>;
}

const MortgageCalculator = ({ defaultPrincipal = 200000 }: MortgageCalculatorProps) => {
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [useServerCalculation, setUseServerCalculation] = useState(false);

  const { toast } = useToast();
  const { data, loading, error, fetchData } = useApi<{ success: boolean; results: MortgageCalculationResult }>();

  const calculateMortgageLocally = () => {
    // Convert annual interest rate to monthly rate
    const monthlyInterestRate = interestRate / 100 / 12;

    // Convert loan term to months
    const loanTermMonths = loanTerm * 12;

    // Calculate monthly payment using mortgage formula
    if (monthlyInterestRate === 0) {
      // Simple division if interest rate is zero
      const payment = principal / loanTermMonths;
      setMonthlyPayment(payment);
      setTotalPayment(principal);
      setTotalInterest(0);
    } else {
      const payment =
        principal *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
        (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

      setMonthlyPayment(payment);
      setTotalPayment(payment * loanTermMonths);
      setTotalInterest(payment * loanTermMonths - principal);
    }
  };

  const calculateMortgageServer = async () => {
    try {
      await fetchData({
        url: '/api/mortgage/calculate',
        method: 'POST',
        data: {
          principal,
          interestRate,
          loanTerm
        }
      });
    } catch (err) {
      console.error('Error calculating mortgage:', err);
      toast({
        title: "Calculation Error",
        description: "Could not calculate mortgage. Using local calculation instead.",
        variant: "destructive"
      });

      // Fall back to local calculation
      calculateMortgageLocally();
      setUseServerCalculation(false);
    }
  };

  // Calculate on initial render and when inputs change
  useEffect(() => {
    if (useServerCalculation) {
      calculateMortgageServer();
    } else {
      calculateMortgageLocally();
    }
  }, [principal, interestRate, loanTerm, useServerCalculation]);

  // Update state when server data is received
  useEffect(() => {
    if (data?.success && data.results) {
      setMonthlyPayment(data.results.monthlyPayment);
      setTotalPayment(data.results.totalPayment);
      setTotalInterest(data.results.totalInterest);
    }
  }, [data]);

  // Handle server calculation errors
  useEffect(() => {
    if (error) {
      console.error('Server calculation error:', error);
      calculateMortgageLocally();
      setUseServerCalculation(false);
    }
  }, [error]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Mortgage Calculator</CardTitle>
        <CardDescription>
          Calculate your estimated monthly mortgage payment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="principal">Loan Amount</Label>
            <span className="text-sm font-medium">{formatCurrency(principal)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              id="principal"
              value={[principal]}
              onValueChange={(values) => setPrincipal(values[0])}
              min={50000}
              max={1000000}
              step={10000}
            />
            <Input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <span className="text-sm font-medium">{interestRate}%</span>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              id="interestRate"
              value={[interestRate]}
              onValueChange={(values) => setInterestRate(values[0])}
              min={0.1}
              max={15}
              step={0.1}
            />
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-24"
              step="0.1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="loanTerm">Loan Term (years)</Label>
            <span className="text-sm font-medium">{loanTerm} years</span>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              id="loanTerm"
              value={[loanTerm]}
              onValueChange={(values) => setLoanTerm(values[0])}
              min={1}
              max={30}
              step={1}
            />
            <Input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        <Button
          onClick={() => {
            if (useServerCalculation) {
              calculateMortgageServer();
            } else {
              calculateMortgageLocally();
            }
          }}
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            'Recalculate'
          )}
        </Button>

        <div className="mt-2 text-center">
          <button
            onClick={() => setUseServerCalculation(!useServerCalculation)}
            className="text-xs text-blue-600 hover:underline"
          >
            {useServerCalculation ? 'Switch to local calculation' : 'Switch to server calculation'}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Monthly Payment</p>
            <p className="text-xl font-bold">{formatCurrency(monthlyPayment)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Payment</p>
            <p className="text-xl font-bold">{formatCurrency(totalPayment)}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Interest</p>
            <p className="text-xl font-bold">{formatCurrency(totalInterest)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MortgageCalculator;
