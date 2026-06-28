import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export async function printPDF({
  element,
  orientation,
}: {
  element: HTMLElement;
  orientation: string;
}) {
  try {
    const targetElement = element;
    if (!targetElement) {
      return;
    }

    const canvas = await html2canvas(targetElement, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: orientation as "portrait" | "landscape",
      unit: "px",
      format: orientation === "portrait" ? [595.28, 841.89] : [841.89, 595.28], // Adjust A4 size based on orientation
    });

    const imgProperties = pdf.getImageProperties(img);
    let pdfWidth = pdf.internal.pageSize.getWidth();
    let pdfHeight = (imgProperties.height / imgProperties.width) * pdfWidth;

    const maxPdfHeight = pdf.internal.pageSize.getHeight();
    if (pdfHeight > maxPdfHeight) {
      const scalingFactor = maxPdfHeight / pdfHeight;
      pdfWidth *= scalingFactor;
      pdfHeight = maxPdfHeight;
    }

    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save("your_output.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}
