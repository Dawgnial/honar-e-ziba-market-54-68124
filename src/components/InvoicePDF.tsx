import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CartItem } from '../context/CartContext';
import { toFarsiNumber } from "../utils/numberUtils";

interface InvoiceData {
  items: CartItem[];
  subtotal: number;
  total: number;
  invoiceNumber: string;
  date: string;
}

export const generateInvoicePDF = async (invoiceData: InvoiceData): Promise<string> => {
  // Create a temporary div for the invoice content
  const invoiceDiv = document.createElement('div');
  invoiceDiv.style.position = 'absolute';
  invoiceDiv.style.left = '-9999px';
  invoiceDiv.style.width = '210mm'; // A4 width
  invoiceDiv.style.fontFamily = 'Vazirmatn, Arial, sans-serif';
  invoiceDiv.style.direction = 'rtl';
  invoiceDiv.style.backgroundColor = 'white';
  invoiceDiv.style.padding = '20mm';
  invoiceDiv.style.lineHeight = '1.5';
  invoiceDiv.style.fontSize = '12px';

  // Generate invoice HTML content
  invoiceDiv.innerHTML = `
    <div style="width: 100%; background: white; direction: rtl; font-family: 'Vazirmatn', Arial, sans-serif;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px;">
        <h1 style="color: #1e40af; font-size: 28px; font-weight: 700; margin: 0 0 10px 0; letter-spacing: normal;">فاکتور خرید</h1>
        <p style="color: #475569; font-size: 16px; margin: 0; font-weight: 500;">ایرولیا شاپ: خرید بهترین و با کیفیت ترین لوازم سفال و سرامیک</p>
      </div>

      <!-- Invoice Info -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background: #f1f5f9; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div>
          <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">اطلاعات فاکتور</h3>
          <p style="margin: 6px 0; color: #475569; font-size: 15px;"><strong>شماره فاکتور:</strong> ${invoiceData.invoiceNumber}</p>
          <p style="margin: 6px 0; color: #475569; font-size: 15px;"><strong>تاریخ صدور:</strong> ${invoiceData.date}</p>
        </div>
        <div style="text-align: left;">
          <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">اطلاعات تماس</h3>
          <p style="margin: 6px 0; color: #475569; font-size: 15px;">تلگرام: @irolia</p>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #1e293b; font-size: 20px; margin-bottom: 16px; font-weight: 600;">جزئیات سفارش</h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
          <thead>
            <tr style="background: #2563eb; color: white;">
              <th style="padding: 16px; text-align: right; font-weight: 600; font-size: 15px;">محصول</th>
              <th style="padding: 16px; text-align: center; font-weight: 600; font-size: 15px;">قیمت واحد</th>
              <th style="padding: 16px; text-align: center; font-weight: 600; font-size: 15px;">تعداد</th>
              <th style="padding: 16px; text-align: center; font-weight: 600; font-size: 15px;">جمع</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map((item, index) => {
              const attributeModifiers = item.selectedAttributes?.reduce((sum, attr) => sum + attr.price_modifier, 0) || 0;
              const finalPrice = item.price + attributeModifiers;
              const discountedPrice = item.discount_percentage ? 
                finalPrice * (1 - item.discount_percentage / 100) : 
                finalPrice;
              
              return `
              <tr style="border-bottom: 1px solid #e2e8f0; ${index % 2 === 0 ? 'background: #f8fafc;' : 'background: white;'}">
                <td style="padding: 16px;">
                  <div>
                    <p style="font-weight: 600; margin: 0; color: #1e293b; font-size: 15px; line-height: 1.4;">${item.title}</p>
                    ${item.selectedAttributes && item.selectedAttributes.length > 0 ? 
                      `<div style="margin-top: 8px;">
                        ${item.selectedAttributes.map(attr => 
                          `<span style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: 4px; margin-bottom: 4px;">
                            ${attr.attribute_display_name}: ${attr.display_value}
                            ${attr.price_modifier > 0 ? ` (+${toFarsiNumber(attr.price_modifier.toLocaleString())} تومان)` : ''}
                          </span>`
                        ).join('')}
                      </div>` : ''
                    }
                  </div>
                </td>
                <td style="padding: 16px; text-align: center; color: #334155; font-size: 14px;">
                  ${toFarsiNumber(discountedPrice.toLocaleString())} تومان
                </td>
                <td style="padding: 16px; text-align: center; color: #334155; font-weight: 600; font-size: 14px;">
                  ${toFarsiNumber(item.quantity)}
                </td>
                <td style="padding: 16px; text-align: center; color: #334155; font-weight: 600; font-size: 14px;">
                  ${toFarsiNumber((discountedPrice * item.quantity).toLocaleString())} تومان
                </td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div style="background: #f1f5f9; padding: 24px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 30px;">
        <div style="max-width: 400px; margin-right: auto;">
          <div style="border-top: 3px solid #2563eb; padding-top: 16px;">
            <div style="display: flex; justify-content: space-between; font-size: 22px; font-weight: 700;">
              <span style="color: #1e293b;">جمع نهایی:</span>
              <span style="color: #2563eb;">${toFarsiNumber(invoiceData.total.toLocaleString())} تومان</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; border-top: 2px solid #e2e8f0; padding-top: 20px;">
        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #bfdbfe;">
          <h4 style="color: #1e40af; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">مرحله بعدی:</h4>
          <p style="color: #1e293b; margin: 0; line-height: 1.6; font-size: 15px;">
            برای تکمیل خرید و هماهنگی نهایی، لطفاً با ما در تلگرام تماس بگیرید:
            <strong style="color: #1e40af;">@irolia</strong>
          </p>
        </div>
        <p style="color: #64748b; font-size: 13px; margin: 0;">
          با تشکر از اعتماد شما • تاریخ صدور: ${invoiceData.date}
        </p>
      </div>
    </div>
  `;

  // Add to DOM temporarily
  document.body.appendChild(invoiceDiv);

  try {
    // Convert to canvas
    const canvas = await html2canvas(invoiceDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 210 * 3.78, // A4 width in pixels (210mm)
      height: Math.max(297 * 3.78, invoiceDiv.scrollHeight + 100) // A4 height in pixels (297mm)
    });

    // Create PDF with A4 format
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add canvas to PDF with proper A4 scaling
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.95),
      'JPEG',
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    // Generate filename with timestamp
    const filename = `invoice-${invoiceData.invoiceNumber}-${Date.now()}.pdf`;
    
    // Save PDF
    pdf.save(filename);

    return filename;
  } finally {
    // Clean up
    document.body.removeChild(invoiceDiv);
  }
};

export const InvoicePDF = {
  generate: generateInvoicePDF
};