"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  // Stripe Checkout - TEMPORARILY DISABLED
  // const onCheckout = async () => {
  //   const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
  //     productIds: items.map((item) => item.id),
  //   });
  //   window.location = response.data.url;
  // };

  const onCashOrder = async () => {
    try {
      setLoading(true);
      if (!captchaToken) {
        toast.error("Please verify you're not a robot.");
        return;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cod`, {
        name,
        address,
        phone,
        productIds: items.map((item) => item.id),
        captcha: captchaToken,
      });

      toast.success("Order placed successfully!");
      removeAll();
      router.push("/");
    } catch (error: any) {
      toast.error(error?.response?.data || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>

      {/* Cash On Delivery Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCashOrder();
        }}
        className="space-y-4 mt-6"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />

        {/* CAPTCHA Integration will go here later */}

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token: string | null) => setCaptchaToken(token)}
          className="w-full"
        />

        <Button
          type="submit"
          disabled={items.length === 0 || loading}
          className="w-full mt-4"
        >
          Place Cash on Delivery Order
        </Button>
      </form>

      {/* Stripe Checkout Option - Commented for now */}
      {/* <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout with Card
      </Button> */}
    </div>
  );
};

export default Summary;
