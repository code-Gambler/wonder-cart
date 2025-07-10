// File: app/api/[storeId]/cod/route.ts

import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import emailjs from "@emailjs/browser";
import axios from "axios";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const body = await req.json();
  const { name, address, phone, productIds, captcha } = body;

  if (!params.storeId) {
    return new NextResponse("Store ID is required", { status: 400 });
  }

  if (!name || !address || !phone || !productIds?.length || !captcha) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  // // ✅ Verify Google reCAPTCHA
  // const captchaSecret = process.env.RECAPTCHA_SECRET_KEY!;
  // const captchaVerify = await axios.post(
  //   `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${captcha}`
  // );

  // if (!captchaVerify.data.success) {
  //   return new NextResponse("CAPTCHA verification failed", { status: 403 });
  // }

  // ✅ Create the Order
  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      paymentMethod: "COD",
      customerName: name,
      address: address,
      phone: phone,
      orderItems: {
        create: productIds.map((id: string) => ({
          product: { connect: { id } },
        })),
      },
    },
  });

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  // if (!serviceId || !templateId || !publicKey) {
  //   console.error("Missing EmailJS env variables");
  //   return new NextResponse("Internal server error", { status: 500 });
  // }
try {
  await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      from_name: name,
      to_name: "Steven David Pillay",
      reply_to: "stevendavidpillay@gmail.com",
      to_email: "stevendavidpillay@gmail.com",
      message: `${productIds.join(", ")} ${order.id}`,
    },
  });
} catch (err) {
  console.error("EmailJS failed:", err);
}

  return NextResponse.json({ message: "Order placed successfully" });
}