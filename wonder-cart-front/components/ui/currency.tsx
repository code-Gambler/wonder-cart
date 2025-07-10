"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHC",
});

interface CurrencyProps {
  value?: string | number;
}

const Currency: React.FC<CurrencyProps> = ({ value = 0 }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <span className="font-semibold">{formatter.format(Number(value))}</span>;
};

export default Currency;
