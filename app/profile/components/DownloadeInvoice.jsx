"use client";
import { Download } from "lucide-react";

const DownloadeBill = ({ data }) => {
  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Colors
      const primaryColor = [0, 0, 0];
      const darkGray = [60, 60, 60];
      const lightGray = [150, 150, 150];

      // Header with background
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("ORDER INVOICE", pageWidth / 2, 15, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("IMD Hardware - www.imdhardware.com", pageWidth / 2, 25, {
        align: "center",
      });
      doc.text("GST NO: 24BPYPR7738J1ZU", pageWidth / 2, 32, {
        align: "center",
      });

      // Order Info Box
      let yPos = 45;
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPos, pageWidth - 30, 35, "F");

      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");

      // Use tracking number if available
      const orderReference = data.tracking_number || `ORD-${data.order_id}`;
      doc.text(`Invoice : ${orderReference}`, 20, yPos + 8);
      doc.text(
        `Date: ${new Date(data.created_at).toLocaleDateString("en-IN")}`,
        20,
        yPos + 16
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Status: ${data.order_status.toUpperCase()}`, 20, yPos + 24);
      doc.text(`Payment: ${data.payment_status.toUpperCase()}`, 20, yPos + 30);

      // Customer Details
      yPos = 90;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("CUSTOMER INFO:", 15, yPos);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text(`Phone: ${data.phone_code} ${data.phone}`, 15, yPos + 7);

      // Shipping Address
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("SHIP TO:", 15, yPos + 18);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      const addressLines = doc.splitTextToSize(data.shipping_address, 85);
      doc.text(addressLines, 15, yPos + 25);
      doc.text(
        `${data.city}, ${data.state}`,
        15,
        yPos + 25 + addressLines.length * 5
      );
      doc.text(
        `${data.country} - ${data.pincode}`,
        15,
        yPos + 30 + addressLines.length * 5
      );

      // Items Table
      yPos = 145;

      // Table Header
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(15, yPos, pageWidth - 30, 10, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Item", 20, yPos + 7);
      doc.text("Qty", 130, yPos + 7, { align: "center" });
      doc.text("Price (Rs)", 155, yPos + 7, { align: "right" });
      doc.text("Total (Rs)", 185, yPos + 7, { align: "right" });

      // Table Rows
      yPos += 10;
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      let rowBg = true;
      data.items.forEach((item) => {
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = 20;
        }

        // Alternate row background
        if (rowBg) {
          doc.setFillColor(250, 250, 250);
          doc.rect(15, yPos, pageWidth - 30, 12, "F");
        }
        rowBg = !rowBg;

        // Handle long product names - truncate with ellipsis
        const maxWidth = 105;
        let productName = item.product_name;
        if (doc.getTextWidth(productName) > maxWidth) {
          while (
            doc.getTextWidth(productName + "...") > maxWidth &&
            productName.length > 0
          ) {
            productName = productName.slice(0, -1);
          }
          productName += "...";
        }

        doc.text(productName, 20, yPos + 8);
        doc.text(item.quantity.toString(), 130, yPos + 8, { align: "center" });
        doc.text(`${item.price.toFixed(2)}`, 155, yPos + 8, {
          align: "right",
        });
        doc.text(`${item.total.toFixed(2)}`, 185, yPos + 8, {
          align: "right",
        });

        yPos += 12;
      });

      // Summary Section
      yPos += 5;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      if (data.discount_value > 0) {
        doc.text("Discount:", 145, yPos, { align: "right" });
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`${data.discount_value.toFixed(2)}`, 185, yPos, {
          align: "right",
        });
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        yPos += 8;
      }

      // Total
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL:", 145, yPos, { align: "right" });
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`${data.final_amount.toFixed(2)}`, 185, yPos, {
        align: "right",
      });

      // Footer
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 15, {
        align: "center",
      });
      doc.text(
        "For queries: support@imdhardware.com",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Save PDF
      const fileName = data.tracking_number
        ? `Invoice_${data.tracking_number}.pdf`
        : `Invoice_Order_${data.order_id}.pdf`;

      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="inline-flex items-center gap-1 px-3 py-1 text-sm transition-colors hover:opacity-80 rounded"
      style={{
        backgroundColor: "var(--color-primary)",
        color: "var(--color-text-on-primary)",
      }}
      title="Download Invoice PDF"
    >
      <Download className="w-4 h-4" />
      <span>Download Invoice</span>
    </button>
  );
};

export default DownloadeBill;
