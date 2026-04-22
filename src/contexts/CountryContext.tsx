import { createContext, useContext, useState, ReactNode } from "react";

export type Country = {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
};

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", currencySymbol: "₹" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", currencySymbol: "£" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", currencySymbol: "$" },
  { code: "AE", name: "UAE", flag: "🇦🇪", currency: "AED", currencySymbol: "د.إ" },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", currencySymbol: "€" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", currency: "SGD", currencySymbol: "S$" },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", currencySymbol: "A$" },
];

type Ctx = {
  country: Country;
  setCountry: (c: Country) => void;
};

const CountryContext = createContext<Ctx | undefined>(undefined);

export const CountryProvider = ({ children }: { children: ReactNode }) => {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  return <CountryContext.Provider value={{ country, setCountry }}>{children}</CountryContext.Provider>;
};

export const useCountry = () => {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be used within CountryProvider");
  return ctx;
};
