import React from "react";
import { renderToString } from "react-dom/server";
import ReportPDF from "@/components/ReportPDF";

export const renderPdf = async (companyName: string, reportData?: any) => {
  try {
    // Render the ReportPDF component to HTML string
    const htmlString = renderToString(
      React.createElement(ReportPDF, { 
        companyName,
        ...reportData 
      })
    );
    
    return htmlString;
  } catch (error) {
    console.error("Error rendering PDF component:", error);
    throw new Error("Failed to render PDF component");
  }
};
