'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import Button from './ui/Button';

export default function DownloadResumeButton({ resumeId = null, type = 'master', variant = 'primary', enhance = true }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: type === 'tailored' ? resumeId : null,
          type,
          enhance, // Include enhancement flag
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download resume');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `resume-${type}.pdf`;
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        variant={variant}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        {isDownloading ? 'Generating PDF...' : enhance ? 'Download ATS Resume' : 'Download Resume'}
      </Button>
      {error && (
        <p className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
