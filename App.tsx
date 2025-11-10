
import React, { useState, useCallback } from 'react';
import { transcribeVideo } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import FileUpload from './components/FileUpload';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import Loader from './components/Loader';

type AppState = 'idle' | 'loading' | 'success' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    setTranscription('');
    setErrorMessage('');
    setAppState('idle');
  };

  const handleTranscription = useCallback(async () => {
    if (!videoFile) return;

    setAppState('loading');
    setErrorMessage('');
    setTranscription('');

    try {
      setStatusMessage('Converting video to base64...');
      const base64Data = await fileToBase64(videoFile);
      
      setStatusMessage('Sending video to Gemini for transcription...');
      const result = await transcribeVideo(videoFile.type, base64Data);

      setTranscription(result);
      setAppState('success');
      setVideoFile(null); // Clear the file after success
    } catch (error) {
      console.error('Transcription error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
      setAppState('error');
    } finally {
      setStatusMessage('');
    }
  }, [videoFile]);
  
  const handleReset = () => {
    setVideoFile(null);
    setTranscription('');
    setErrorMessage('');
    setAppState('idle');
    setStatusMessage('');
  };

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <Loader message={statusMessage} />;
      case 'success':
        return <TranscriptionDisplay transcription={transcription} onReset={handleReset} />;
      case 'error':
        return (
          <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
            <h2 className="text-xl font-bold text-red-400 mb-4">Transcription Failed</h2>
            <p className="text-red-300 mb-6">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        );
      case 'idle':
      default:
        return <FileUpload onFileSelect={handleFileSelect} onTranscribe={handleTranscription} file={videoFile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Video Transcriber AI
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Upload a video to get a shareable transcription.</p>
        </header>
        <main className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
            {renderContent()}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
