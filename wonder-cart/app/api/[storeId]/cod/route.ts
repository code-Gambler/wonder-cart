// File: app/api/[storeId]/cod/route.ts

import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import nodemailer from "nodemailer";
import axios from "axios";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const body = await req.json();
  const { name, address, phone, productIds, captcha } = body;

  if (!params.storeId) {
    return new NextResponse("Store ID is required", { status: 400, headers: corsHeaders });
  }

  if (!name || !address || !phone || !productIds?.length || !captcha) {
    return new NextResponse("Missing required fields", { status: 400, headers: corsHeaders });
  }

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400, headers: corsHeaders });
  }

  const products = await prismadb.product.findMany({
    where: { id: { in: productIds } },
  });

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
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"WonderCart Orders" <${process.env.EMAIL_USERNAME}>`,
    to: process.env.SELLER_EMAIL,
    subject: `🛒 New COD Order from ${name}`,
    text: `
You have a new Cash on Delivery Order!

📦 Order ID: ${order.id}
🏪 Store ID: ${params.storeId}

👤 Customer:
- Name: ${name}
- Phone: ${phone}
- Address: ${address}

🛍️ Products: ${productIds.join(", ")}

📅 Date: ${new Date().toLocaleString()}
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to seller");
    return NextResponse.json({ message: "Order placed successfully" },  { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("❌ Email failed:", error);
    return NextResponse.json(
      { message: "Order placed, but email notification failed." },
       { status: 200, headers: corsHeaders }
    );
  }
}