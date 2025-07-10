// app/actions/get-name.tsx or wherever you're placing it
import { StoreName } from "@/types";

const getStoreName =  async (): Promise<StoreName> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/name`;

  const res = await fetch(URL, { next: { revalidate: 0 } });

  if (!res.ok) {
    throw new Error("Failed to fetch store name");
  }

  return res.json();
};

export default getStoreName;