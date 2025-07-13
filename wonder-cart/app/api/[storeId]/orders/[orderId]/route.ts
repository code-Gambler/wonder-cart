import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// PATCH /api/[storeId]/orders/[orderId]
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) {
  try {
    const body = await req.json();
    const { isPaid } = body;

    if (!params.storeId || !params.orderId) {
      return new NextResponse("Missing storeId or orderId", { status: 400 });
    }

    const updatedOrder = await prismadb.order.update({
      where: {
        id: params.orderId,
        storeId: params.storeId,
      },
      data: {
        isPaid: isPaid === true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}