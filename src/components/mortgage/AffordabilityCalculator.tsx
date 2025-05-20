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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AffordabilityCalculator = () => {
  // User inputs
  const [annualIncome, setAnnualIncome] = useState(75000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [insuranceRate, setInsuranceRate] = useState(0.5);

  // Calculated results
  const [maxHomePrice, setMaxHomePrice] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [paymentBreakdown, setPaymentBreakdown] = useState({
    principal: 0,
    interest: 0,
    taxes: 0,
    insurance: 0,
    total: 0
  });
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState(0);

  // Calculate affordability
  const calculateAffordability = () => {
    // Monthly income
    const monthlyIncome = annualIncome / 12;

    // Maximum recommended housing payment (28% of monthly income)
    const maxHousingPayment = monthlyIncome * 0.28;

    // Maximum total debt payment (36% of monthly income)
    const maxTotalDebtPayment = monthlyIncome * 0.36;

    // Available payment for housing after other debts
    const availableForHousing = Math.min(
      maxHousingPayment,
      maxTotalDebtPayment - monthlyDebts
    );

    // Monthly interest rate
    const monthlyInterestRate = interestRate / 100 / 12;

    // Loan term in months
    const loanTermMonths = loanTerm * 12;

    // Calculate maximum loan amount using mortgage formula
    let maxLoanAmount;
    if (monthlyInterestRate === 0) {
      maxLoanAmount = availableForHousing * loanTermMonths;
    } else {
      maxLoanAmount = availableForHousing /
        (
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
          (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1) +
          (propertyTaxRate / 100 / 12) +
          (insuranceRate / 100 / 12)
        );
    }

    // Maximum home price = loan amount + down payment
    const calculatedMaxHomePrice = maxLoanAmount + downPayment;
    setMaxHomePrice(calculatedMaxHomePrice);

    // Calculate monthly payment breakdown
    const loanAmount = calculatedMaxHomePrice - downPayment;

    let principalAndInterest;
    if (monthlyInterestRate === 0) {
      principalAndInterest = loanAmount / loanTermMonths;
    } else {
      principalAndInterest = loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
        (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
    }

    const monthlyTaxes = (calculatedMaxHomePrice * propertyTaxRate / 100) / 12;
    const monthlyInsurance = (calculatedMaxHomePrice * insuranceRate / 100) / 12;
    const totalMonthlyPayment = principalAndInterest + monthlyTaxes + monthlyInsurance;

    setMonthlyPayment(totalMonthlyPayment);
    setPaymentBreakdown({
      principal: principalAndInterest * 0.4, // Approximate split between principal and interest
      interest: principalAndInterest * 0.6,  // This will vary over the life of the loan
      taxes: monthlyTaxes,
      insurance: monthlyInsurance,
      total: totalMonthlyPayment
    });

    // Calculate debt-to-income ratio
    const dti = ((totalMonthlyPayment + monthlyDebts) / monthlyIncome) * 100;
    setDebtToIncomeRatio(dti);
  };

  // Calculate on initial render and when inputs change
  useEffect(() => {
    calculateAffordability();
  }, [annualIncome, monthlyDebts, downPayment, interestRate, loanTerm, propertyTaxRate, insuranceRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Affordability Calculator</CardTitle>
        <CardDescription>
          Estimate how much home you can afford based on your income and expenses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="annualIncome">Annual Income</Label>
                <span className="text-sm font-medium">{formatCurrency(annualIncome)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Slider
                  id="annualIncome"
                  value={[annualIncome]}
                  onValueChange={(values) => setAnnualIncome(values[0])}
                  min={30000}
                  max={500000}
                  step={5000}
                />
                <Input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="monthlyDebts">Monthly Debts</Label>
                <span className="text-sm font-medium">{formatCurrency(monthlyDebts)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Slider
                  id="monthlyDebts"
                  value={[monthlyDebts]}
                  onValueChange={(values) => setMonthlyDebts(values[0])}
                  min={0}
                  max={5000}
                  step={100}
                />
                <Input
                  type="number"
                  value={monthlyDebts}
                  onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="downPayment">Down Payment</Label>
                <span className="text-sm font-medium">{formatCurrency(downPayment)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Slider
                  id="downPayment"
                  value={[downPayment]}
                  onValueChange={(values) => setDownPayment(values[0])}
                  min={0}
                  max={200000}
                  step={5000}
                />
                <Input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
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
          </div>

          <div className="space-y-6">
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

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Label htmlFor="propertyTaxRate" className="mr-2">Property Tax Rate (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">Annual property tax as a percentage of home value. Typically ranges from 0.5% to 2.5% depending on location.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm font-medium">{propertyTaxRate}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Slider
                  id="propertyTaxRate"
                  value={[propertyTaxRate]}
                  onValueChange={(values) => setPropertyTaxRate(values[0])}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
                <Input
                  type="number"
                  value={propertyTaxRate}
                  onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                  className="w-24"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Label htmlFor="insuranceRate" className="mr-2">Insurance Rate (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">Annual home insurance as a percentage of home value. Typically ranges from 0.3% to 1%.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm font-medium">{insuranceRate}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Slider
                  id="insuranceRate"
                  value={[insuranceRate]}
                  onValueChange={(values) => setInsuranceRate(values[0])}
                  min={0.1}
                  max={2}
                  step={0.1}
                />
                <Input
                  type="number"
                  value={insuranceRate}
                  onChange={(e) => setInsuranceRate(Number(e.target.value))}
                  className="w-24"
                  step="0.1"
                />
              </div>
            </div>

            <Button onClick={calculateAffordability} className="w-full mt-4">Recalculate</Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">You can afford a home up to</h3>
            <div className="text-4xl font-bold text-primary mb-4">{formatCurrency(maxHomePrice)}</div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Estimated Monthly Payment:</span>
                  <span className="font-medium">{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                  }).format(monthlyPayment)}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Debt-to-Income Ratio:</span>
                  <span className="font-medium">{debtToIncomeRatio.toFixed(1)}%</span>
                </div>
                <Progress value={debtToIncomeRatio} max={43} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>Ideal (28%)</span>
                  <span>Max (43%)</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Payment Breakdown</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Principal & Interest:</span>
                  <span className="font-medium">{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                  }).format(paymentBreakdown.principal + paymentBreakdown.interest)}</span>
                </div>
                <Progress value={paymentBreakdown.principal + paymentBreakdown.interest} max={paymentBreakdown.total} className="h-2 bg-blue-100" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Property Taxes:</span>
                  <span className="font-medium">{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                  }).format(paymentBreakdown.taxes)}</span>
                </div>
                <Progress value={paymentBreakdown.taxes} max={paymentBreakdown.total} className="h-2 bg-green-100" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Insurance:</span>
                  <span className="font-medium">{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                  }).format(paymentBreakdown.insurance)}</span>
                </div>
                <Progress value={paymentBreakdown.insurance} max={paymentBreakdown.total} className="h-2 bg-yellow-100" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffordabilityCalculator;
