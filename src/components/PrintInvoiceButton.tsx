import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { toFarsiNumber } from "@/utils/numberUtils";

interface PrintInvoiceButtonProps {
  order: any;
}

export const PrintInvoiceButton = ({ order }: PrintInvoiceButtonProps) => {
  const handlePrintInvoice = () => {
    const items = order.order_data.items || [];
    
    // Create print window content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('لطفاً اجازه باز شدن پنجره جدید را بدهید');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاکتور ${order.invoice_number}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Vazirmatn', sans-serif;
            direction: rtl;
            line-height: 1.6;
            color: #1e293b;
            background: white;
            padding: 20mm;
          }
          
          .invoice-container {
            max-width: 210mm;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          
          .header h1 {
            color: #1e40af;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          
          .header p {
            color: #475569;
            font-size: 16px;
            font-weight: 500;
          }
          
          .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .info-section h3 {
            color: #1e293b;
            font-size: 18px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          .info-section p {
            margin: 6px 0;
            color: #475569;
            font-size: 15px;
          }
          
          .items-section {
            margin-bottom: 30px;
          }
          
          .items-section h3 {
            color: #1e293b;
            font-size: 20px;
            margin-bottom: 16px;
            font-weight: 600;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
          }
          
          thead {
            background: #2563eb;
            color: white;
          }
          
          th {
            padding: 16px;
            text-align: center;
            font-weight: 600;
            font-size: 15px;
          }
          
          th:first-child {
            text-align: right;
          }
          
          td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            text-align: center;
            color: #334155;
            font-size: 14px;
          }
          
          td:first-child {
            text-align: right;
          }
          
          tbody tr:nth-child(even) {
            background: #f8fafc;
          }
          
          .product-name {
            font-weight: 600;
            color: #1e293b;
            font-size: 15px;
            margin-bottom: 4px;
          }
          
          .attributes {
            margin-top: 8px;
          }
          
          .attribute-badge {
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-left: 4px;
            margin-bottom: 4px;
          }
          
          .summary {
            background: #f1f5f9;
            padding: 24px;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            margin-bottom: 30px;
          }
          
          .summary-content {
            max-width: 400px;
            margin-right: auto;
            border-top: 3px solid #2563eb;
            padding-top: 16px;
          }
          
          .total {
            display: flex;
            justify-content: space-between;
            font-size: 22px;
            font-weight: 700;
          }
          
          .total-label {
            color: #1e293b;
          }
          
          .total-amount {
            color: #2563eb;
          }
          
          .footer {
            text-align: center;
            border-top: 2px solid #e2e8f0;
            padding-top: 20px;
          }
          
          .contact-box {
            background: #dbeafe;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #bfdbfe;
          }
          
          .contact-box h4 {
            color: #1e40af;
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          
          .contact-box p {
            color: #1e293b;
            line-height: 1.6;
            font-size: 15px;
          }
          
          .footer-note {
            color: #64748b;
            font-size: 13px;
          }
          
          @media print {
            body {
              padding: 0;
            }
            
            .no-print {
              display: none !important;
            }
            
            @page {
              margin: 15mm;
              size: A4;
            }
          }
          
          .print-button {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Vazirmatn', sans-serif;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
          }
          
          .print-button:hover {
            background: #1e40af;
          }
        </style>
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">چاپ فاکتور</button>
        
        <div class="invoice-container">
          <div class="header">
            <h1>فاکتور خرید</h1>
            <p>ایرولیا شاپ: خرید بهترین و با کیفیت ترین لوازم سفال و سرامیک</p>
          </div>

          <div class="invoice-info">
            <div class="info-section">
              <h3>اطلاعات فاکتور</h3>
              <p><strong>شماره فاکتور:</strong> ${toFarsiNumber(order.invoice_number)}</p>
              <p><strong>تاریخ صدور:</strong> ${new Intl.DateTimeFormat('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).format(new Date(order.created_at))}</p>
            </div>
            <div class="info-section">
              <h3>اطلاعات مشتری</h3>
              <p><strong>نام:</strong> ${order.customer_name}</p>
              ${order.customer_phone ? `<p><strong>تلفن:</strong> ${order.customer_phone}</p>` : ''}
              ${order.customer_email ? `<p><strong>ایمیل:</strong> ${order.customer_email}</p>` : ''}
            </div>
          </div>

          <div class="items-section">
            <h3>جزئیات سفارش</h3>
            <table>
              <thead>
                <tr>
                  <th>محصول</th>
                  <th>قیمت واحد</th>
                  <th>تعداد</th>
                  <th>جمع</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => {
                  const finalPrice = item.price;
                  const discountedPrice = item.discount_percentage ? 
                    finalPrice * (1 - item.discount_percentage / 100) : 
                    finalPrice;
                  
                  return `
                    <tr>
                      <td>
                        <div class="product-name">${item.title}</div>
                        ${item.selectedAttributes && item.selectedAttributes.length > 0 ? 
                          `<div class="attributes">
                            ${item.selectedAttributes.map(attr => 
                              `<span class="attribute-badge">
                                ${attr.attribute_display_name}: ${attr.display_value}
                              </span>`
                            ).join('')}
                          </div>` : ''
                        }
                      </td>
                      <td>${toFarsiNumber(discountedPrice.toLocaleString())} تومان</td>
                      <td><strong>${toFarsiNumber(item.quantity)}</strong></td>
                      <td><strong>${toFarsiNumber((discountedPrice * item.quantity).toLocaleString())} تومان</strong></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="summary">
            <div class="summary-content">
              <div class="total">
                <span class="total-label">جمع نهایی:</span>
                <span class="total-amount">${toFarsiNumber(order.total_amount.toLocaleString())} تومان</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="contact-box">
              <h4>مرحله بعدی:</h4>
              <p>
                برای تکمیل خرید و هماهنگی نهایی، لطفاً با ما در تلگرام تماس بگیرید:
                <strong>@irolia</strong>
              </p>
            </div>
            <p class="footer-note">
              با تشکر از اعتماد شما • تاریخ صدور: ${new Intl.DateTimeFormat('fa-IR').format(new Date(order.created_at))}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for fonts to load before triggering print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
      }, 250);
    };
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handlePrintInvoice}
      className="gap-2"
    >
      <Printer className="h-4 w-4" />
      چاپ فاکتور
    </Button>
  );
};
