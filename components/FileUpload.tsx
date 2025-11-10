
import React, { useRef, useState, DragEvent } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { VideoIcon } from './icons/VideoIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onTranscribe: () => void;
  file: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onTranscribe, file }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon />
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">Any common video format (MP4, MOV, etc.)</p>
          </div>
          <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="w-full text-center p-6 bg-gray-700 rounded-lg">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <VideoIcon />
            <div>
              <p className="font-semibold text-white break-all">{file.name}</p>
              <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            onClick={onTranscribe}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Transcribe Video
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
