
import React from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { CopyIcon } from './icons/CopyIcon';
import { ShareIcon } from './icons/ShareIcon';

interface TranscriptionDisplayProps {
  transcription: string;
  onReset: () => void;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcription, onReset }) => {
  const [copyStatus, copy] = useCopyToClipboard();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Video Transcription',
          text: transcription,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Share API is not supported on your browser. You can use the copy button.');
    }
  };

  const copyButtonText = copyStatus === 'copied' ? 'Copied!' : 'Copy';

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">Transcription Result</h2>
      <div className="w-full p-4 bg-gray-900 rounded-lg max-h-96 overflow-y-auto border border-gray-700 mb-6">
        <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{transcription}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => copy(transcription)}
          className="flex items-center justify-center px-5 py-2.5 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
        >
          <CopyIcon />
          <span className="ml-2">{copyButtonText}</span>
        </button>
        {navigator.share && (
            <button
            onClick={handleShare}
            className="flex items-center justify-center px-5 py-2.5 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
            >
            <ShareIcon />
            <span className="ml-2">Share</span>
            </button>
        )}
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
        >
          Transcribe Another Video
        </button>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
