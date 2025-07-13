"use client";

import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";

export type OrderColumn = {
  id: string;
  name: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns = (storeId: string): ColumnDef<OrderColumn>[] => [
  {
    accessorKey: "name",
    header: "Customer's Name",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (
      <span className={row.original.isPaid ? "text-green-600" : "text-red-500"}>
        {row.original.isPaid ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;

      const handleMarkAsPaid = async () => {
        try {
          await axios.patch(`/api/${storeId}/orders/${order.id}`, {
            isPaid: true,
          });
          toast.success("Marked as paid!");
          window.location.reload();
        } catch (error) {
          toast.error("Failed to update order.");
        }
      };

      return !order.isPaid ? (
        <Button onClick={handleMarkAsPaid} size="sm">
          Mark as Paid
        </Button>
      ) : null;
    },
  },
];
