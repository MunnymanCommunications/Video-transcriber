
import { useState, useCallback } from 'react';

type CopyStatus = 'inactive' | 'copied' | 'failed';

export const useCopyToClipboard = (): [CopyStatus, (text: string) => void] => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('inactive');

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('inactive'), 2000); // Reset after 2 seconds
      },
      () => {
        setCopyStatus('failed');
        setTimeout(() => setCopyStatus('inactive'), 2000);
      }
    );
  }, []);

  return [copyStatus, copy];
};
