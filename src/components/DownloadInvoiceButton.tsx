import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateInvoicePDF } from "@/components/InvoicePDF";

interface DownloadInvoiceButtonProps {
  order: any;
}

export const DownloadInvoiceButton = ({ order }: DownloadInvoiceButtonProps) => {
  const handleDownloadInvoice = () => {
    const items = order.order_data.items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    
    const invoiceData = {
      invoiceNumber: order.invoice_number,
      date: order.original_order_date || order.created_at,
      customerName: order.customer_name,
      customerPhone: order.customer_phone || '',
      customerEmail: order.customer_email || '',
      items: items,
      subtotal: subtotal,
      total: order.total_amount,
    };

    generateInvoicePDF(invoiceData);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownloadInvoice}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      دانلود فاکتور
    </Button>
  );
};
