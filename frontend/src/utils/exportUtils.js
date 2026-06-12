import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads data as a CSV file.
 * @param {Array<Object>} data Array of objects to export
 * @param {string} filename Name of the downloaded file
 */
export const exportToCSV = (data, filename = 'metrics.csv') => {
    if (!data || !data.length) return;

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Convert to CSV string
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Exports a DOM element as a PNG image.
 * @param {string} elementId The ID of the DOM element to capture
 * @param {string} filename Name of the downloaded file
 */
export const exportToPNG = async (elementId, filename = 'chart.png') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = imgData;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error exporting to PNG:", error);
    }
};

/**
 * Exports a DOM element as a PDF document.
 * @param {string} elementId The ID of the DOM element to capture
 * @param {string} filename Name of the downloaded file
 */
export const exportToPDF = async (elementId, filename = 'report.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(filename);
    } catch (error) {
        console.error("Error exporting to PDF:", error);
    }
};
