// app/actions/get-name.tsx or wherever you're placing it
import { StoreName } from "@/types";

const getStoreName =  async (): Promise<StoreName> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/name`;
  console.log("Fetching store name from:", URL);

  const res = await fetch(URL, { next: { revalidate: 0 } });
  console.log("Test",res);

  if (!res.ok) {
    throw new Error("Failed to fetch store name");
  }

  return res;
};

export default getStoreName;