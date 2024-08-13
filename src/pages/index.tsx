import Head from "next/head";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const [calculated, setCalculated] = useState(false);
  const [monthlyRepayment, setMonthlyRepayment] = useState<number | null>(null);
  const [totalRepayment, setTotalRepayment] = useState<number | null>(null);
  const [mortgageAmountActive, setMortgageAmountActive] = useState(false);
  const [mortgageAmountError, setMortgageAmountError] = useState(false);
  const [mortgageTermActive, setMortgageTermActive] = useState(false);
  const [mortgageTermError, setMortgageTermError] = useState(false);
  const [interestRateActive, setInterestRateActive] = useState(false);
  const [interestRateError, setInterestRateError] = useState(false);
  const [mortgageTypeError, setMortgageTypeError] = useState(false);
  const [mortgageAmount, setMortgageAmount] = useState<number | null>(null);
  const [mortgageTerm, setMortgageTerm] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [mortgageType, setMortgageType] = useState<string | null>(null);

  const mortgageAmountRef = useRef<HTMLDivElement>(null);
  const mortgageTermRef = useRef<HTMLDivElement>(null);
  const interestRateRef = useRef<HTMLDivElement>(null);
  const repaymentRef = useRef<HTMLDivElement>(null);
  const interestOnlyRef = useRef<HTMLDivElement>(null);

  const useClickOutside = (
    ref: React.RefObject<HTMLDivElement>,
    setActive: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setActive(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, setActive]);
  };

  useClickOutside(mortgageAmountRef, setMortgageAmountActive);
  useClickOutside(mortgageTermRef, setMortgageTermActive);
  useClickOutside(interestRateRef, setInterestRateActive);

  const handleMortgageAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    const numericValue = Number(value);
    setMortgageAmount(numericValue);

    if (calculated) {
      if (value === "" || isNaN(numericValue) || numericValue <= 0) {
        setMortgageAmountError(true);
      } else {
        setMortgageAmountError(false);
      }
    }
  };

  const handleMortgageTermChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    const numericValue = Number(value);
    setMortgageTerm(numericValue);

    if (calculated && ((value && isNaN(numericValue)) || numericValue <= 0)) {
      setMortgageTermError(true);
    } else {
      setMortgageTermError(false);
    }
  };

  const handleInterestRateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    const numericValue = Number(value);
    setInterestRate(numericValue);

    if (calculated && ((value && isNaN(numericValue)) || numericValue <= 0)) {
      setInterestRateError(true);
    } else {
      setInterestRateError(false);
    }
  };

  const setRepaymentActive = () => {
    setMortgageType("repayment");
  };

  const setInterestOnlyActive = () => {
    setMortgageType("interestOnly");
  };

  const clearAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMortgageAmount(null);
    setMortgageTerm(null);
    setInterestRate(null);
    setMortgageType(null);
    setMortgageAmountActive(false);
    setMortgageTermActive(false);
    setInterestRateActive(false);
    setMortgageAmountError(false);
    setMortgageTermError(false);
    setInterestRateError(false);
    setMortgageTypeError(false);
    setCalculated(false);
  };

  const calculateRepayments = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    if (!mortgageAmount) {
      setMortgageAmountError(true);
      hasError = true;
    } else {
      setMortgageAmountError(false);
    }

    if (!mortgageTerm) {
      setMortgageTermError(true);
      hasError = true;
    } else {
      setMortgageTermError(false);
    }

    if (!interestRate) {
      setInterestRateError(true);
      hasError = true;
    } else {
      setInterestRateError(false);
    }

    if (!mortgageType) {
      setMortgageTypeError(true);
      hasError = true;
    } else {
      setMortgageTypeError(false);
    }

    if (hasError) {
      return;
    }

    const principal = mortgageAmount;
    const monthlyInterestRate = interestRate! / 100 / 12;
    const numberOfPayments = mortgageTerm! * 12;

    if (mortgageType === "repayment") {
      // Calculate monthly repayment
      const monthlyRepayment =
        (principal! * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
      setMonthlyRepayment(monthlyRepayment);

      // Calculate total repayment
      const totalRepayment = monthlyRepayment * numberOfPayments;
      setTotalRepayment(totalRepayment);
    } else if (mortgageType === "interestOnly") {
      // Calculate monthly interest-only repayment
      const monthlyRepayment = principal! * monthlyInterestRate;
      setMonthlyRepayment(monthlyRepayment);

      // Calculate total repayment (interest only)
      const totalRepayment = monthlyRepayment * numberOfPayments;
      setTotalRepayment(totalRepayment);
    }
  };

  return (
    <>
      <Head>
        <title>Mortgage Calculator</title>
        <meta name="description" content="Calculate your mortgage" />
        <link rel="icon" href="/images/favicon-32x32.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 font-plusjakartasans">
        {/* Container */}
        <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-white shadow-2xl shadow-slate-300 md:h-[700px] md:w-2/3 md:min-w-[680px] md:flex-row md:rounded-3xl lg:h-[680px] xl:h-[580px]">
          {/* Calc Container */}
          <div className="flex h-full w-full flex-col items-start justify-center gap-6 bg-transparent p-6 text-slate-700">
            {/* Header */}
            <div className="flex w-full flex-col items-start justify-between gap-1 md:flex-row md:items-center">
              <h1 className="text-2xl font-semibold text-slate-900">
                Mortgage Calculator
              </h1>
              <button className="underline" onClick={clearAll}>
                Clear All
              </button>
            </div>
            {/* Form */}
            <form
              onSubmit={calculateRepayments}
              className="flex h-full w-full flex-col"
            >
              <label htmlFor="mortgageAmount" className="mb-2">
                Mortgage Amount
              </label>
              <div
                className={`relative mb-6 flex h-12 w-full cursor-pointer overflow-visible ${mortgageAmountActive ? "border-lime" : mortgageAmountError ? "border-red" : "border-slate-300"} rounded-md border`}
                onClick={() => setMortgageAmountActive(true)}
                ref={mortgageAmountRef}
              >
                <span
                  className={`flex h-full w-14 items-center justify-center rounded-bl-md rounded-tl-md p-2 text-xl font-medium ${mortgageAmountActive ? "bg-lime/20 text-slate-700" : mortgageAmountError ? "bg-red text-white" : "bg-slate-100 text-slate-700"}`}
                >
                  £
                </span>
                <input
                  type="number"
                  id="mortgageAmount"
                  name="mortgageAmount"
                  value={mortgageAmount ?? ""}
                  className="mb-2 h-full w-full appearance-none rounded-br-md rounded-tr-md p-2"
                  onChange={handleMortgageAmountChange}
                />
                {mortgageAmountError && (
                  <label
                    htmlFor="mortgageAmount"
                    className="absolute bottom-0 left-0 translate-y-6 text-sm font-light text-red"
                  >
                    This field is required
                  </label>
                )}
              </div>
              <div className="flex flex-col gap-2 xl:flex-row">
                <div
                  className="flex w-full flex-col xl:w-1/2"
                  onClick={() => setMortgageTermActive(true)}
                  ref={mortgageTermRef}
                >
                  <label htmlFor="mortgageTerm" className="mb-2">
                    Mortgage Term
                  </label>
                  <div
                    className={`relative flex h-12 w-full cursor-pointer overflow-visible rounded-md border ${
                      mortgageTermActive
                        ? "border-lime"
                        : mortgageTermError
                          ? "border-red"
                          : "border-slate-300"
                    }`}
                  >
                    <input
                      type="number"
                      id="mortgageTerm"
                      name="mortgageTerm"
                      value={mortgageTerm ?? ""}
                      className="mb-2 h-full w-full appearance-none rounded-bl-md rounded-tl-md p-2"
                      onChange={handleMortgageTermChange}
                    />
                    <span
                      className={`flex h-full ${
                        mortgageTermActive
                          ? "bg-lime/20 text-slate-700"
                          : mortgageTermError
                            ? "bg-red text-white"
                            : "bg-slate-100 text-slate-700"
                      } items-center justify-center rounded-br-md rounded-tr-md px-4 py-2 text-xl font-medium`}
                    >
                      years
                    </span>
                    {mortgageTermError && (
                      <label
                        htmlFor="mortgageTerm"
                        className="absolute bottom-0 left-0 translate-y-6 text-sm font-light text-red"
                      >
                        This field is required
                      </label>
                    )}
                  </div>
                </div>
                <div className="mb-6 flex w-full flex-col xl:w-1/2">
                  <label htmlFor="interestRate" className="mb-2">
                    Interest Rate
                  </label>
                  <div
                    className={`flex ${interestRateActive ? "border-lime" : interestRateError ? "border-red" : "border-slate-300"} relative h-12 w-full overflow-visible rounded-md border`}
                    onClick={() => setInterestRateActive(true)}
                    ref={interestRateRef}
                  >
                    <input
                      type="number"
                      id="interestRate"
                      name="interestRate"
                      value={interestRate ?? ""}
                      className="mb-2 h-full w-full appearance-none rounded-bl-md rounded-tl-md p-2"
                      onChange={handleInterestRateChange}
                    />
                    <span
                      className={`flex h-full w-14 items-center justify-center rounded-br-md rounded-tr-md p-2 text-xl font-medium ${interestRateActive ? "bg-lime/20 text-slate-700" : interestRateError ? "bg-red text-white" : "bg-slate-100 text-slate-700"}`}
                    >
                      %
                    </span>
                    {interestRateError && (
                      <label
                        htmlFor="interestRate"
                        className="absolute bottom-0 left-0 translate-y-6 text-sm font-light text-red"
                      >
                        This field is required
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <label htmlFor="mortgageType" className="mb-2 w-full">
                Mortgage Type
              </label>
              <div className="relative flex w-full flex-col items-start gap-2">
                <div
                  className={`flex h-14 w-full items-center gap-4 rounded-md border px-4 py-3 hover:cursor-pointer hover:border-lime ${mortgageType === "repayment" ? "border-lime bg-lime/20" : "border-slate-300"}`}
                  onClick={setRepaymentActive}
                  ref={repaymentRef}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${mortgageType === "repayment" ? "border-lime bg-transparent" : "border-slate-700"}`}
                    id="mortgageType"
                  >
                    <div
                      className={`h-3 w-3 rounded-full bg-lime ${mortgageType === "repayment" ? "block" : "hidden"}`}
                    />
                  </div>
                  <span className="h-full text-xl font-semibold text-slate-700">
                    Repayment
                  </span>
                </div>
                <div
                  className={`flex h-14 w-full items-center gap-4 rounded-md border px-4 py-3 hover:cursor-pointer hover:border-lime ${mortgageType === "interestOnly" ? "border-lime bg-lime/20" : "border-slate-300"}`}
                  onClick={setInterestOnlyActive}
                  ref={interestOnlyRef}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${mortgageType === "interestOnly" ? "border-lime bg-transparent" : "border-slate-700"}`}
                    id="mortgageType"
                  >
                    <div
                      className={`h-3 w-3 rounded-full bg-lime ${mortgageType === "interestOnly" ? "block" : "hidden"}`}
                    />
                  </div>
                  <span className="h-full text-xl font-semibold text-slate-700">
                    Interest Only
                  </span>
                  {mortgageTypeError && (
                    <label
                      htmlFor="mortgageType"
                      className="absolute bottom-0 left-0 translate-y-6 text-sm font-light text-red"
                    >
                      This field is required
                    </label>
                  )}
                </div>
              </div>
              <button
                className="my-8 flex h-14 w-full items-center justify-center gap-4 rounded-full bg-lime text-xl font-bold text-slate-900 hover:bg-lime/60"
                type="submit"
                onSubmit={() => setCalculated(true)}
              >
                <Image
                  src={"/images/icon-calculator.svg"}
                  width={24}
                  height={24}
                  alt="Calculator Icon"
                />
                Calculate Repayments
              </button>
            </form>
          </div>
          {/* Result Container */}
          <div
            className={`flex h-full w-full flex-col ${calculated ? "items-start justify-start" : "items-center justify-center"} gap-6 bg-slate-900 px-8 py-6 md:rounded-bl-3xl`}
          >
            {calculated ? (
              <>
                <h1 className="self-start text-2xl font-medium text-white">
                  Your results
                </h1>
                <p className="text-sm text-slate-300">
                  Your results are shown below based on the information you
                  provided. To adjust the results, edit the form and click
                  &quot;calculate repayments&quot; again.
                </p>
                <div className="relative h-auto w-full rounded-md bg-lime">
                  <div className="flex h-auto w-full translate-y-1 flex-col gap-4 rounded-md bg-slate-950 p-8">
                    <p className="text-slate-300/85">Your monthly repayments</p>
                    <h1 className="text-5xl font-bold text-lime">
                      £
                      {monthlyRepayment?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h1>
                    <div className="my-6 border-t border-slate-100/50" />
                    <p className="text-slate-300/85">
                      Total you&apos;ll repay over the term
                    </p>
                    <h2 className="text-3xl font-semibold text-white">
                      £
                      {totalRepayment?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h2>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Image
                  className="h-auto w-1/2"
                  src={"/images/illustration-empty.svg"}
                  width={100}
                  height={100}
                  alt="Illustration Empty"
                />
                <h1 className="text-2xl font-semibold text-white">
                  Result shown here
                </h1>
                <p className="text-center text-sm text-slate-300">
                  Complete the form and click &quot;Calculate Repayments&quot;
                  to see what your monthly repayments would be.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
