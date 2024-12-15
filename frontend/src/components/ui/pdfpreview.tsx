import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";

const PDFPreview = ({ fileUrl }: { fileUrl: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPage) => Math.min(prevPage + 1, numPages));
  };

  return (
    <div className="pdf-preview-container">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center"
      >
        <Page pageNumber={pageNumber} width={600} className="shadow-lg mb-4" />
      </Document>

      <div className="pdf-controls flex justify-center items-center space-x-4 mt-4">
        <Button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          variant="outline"
        >
          Previous Page
        </Button>

        <span className="text-gray-600">
          Page {pageNumber} of {numPages}
        </span>

        <Button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          variant="outline"
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};

export default PDFPreview;
