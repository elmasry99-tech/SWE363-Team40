'use client';
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, ShieldCheck, X, Trash2 } from 'lucide-react';
import axios from 'axios';

export const FileUploader = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
const [uploadedFile, setUploadedFile] = useState(null);
const [abortController, setAbortController] = useState(null);

const handleCancel = () => {
  if (abortController) {
    abortController.abort(); 
    setUploading(false);
    setProgress(0);
    console.log("Upload cancelled by user.");
}
};

const handleDelete = () => {
  setUploadedFile(null);
  setProgress(0);
};

const onDrop = useCallback(async (acceptedFiles) => {
  const file = acceptedFiles[0];
  const controller = new AbortController(); 
  setAbortController(controller);
  setUploading(true);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:8000/upload', formData, {
      signal: controller.signal, 
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
        setProgress(percentCompleted);
      },
    });
    
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    });
  } catch (error) {
    if (error.name === 'CanceledError') {
      console.log('Request was canceled');
    } else {
      console.error('Upload Error:', error);
    }
  } finally {
    setUploading(false);
  }
}, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full max-w-2xl p-6 bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 hover:border-blue-500 transition-all cursor-pointer">
      <div {...getRootProps()} className="flex flex-col items-center justify-center space-y-4">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-400 font-bold">Drop your file here...</p>
        ) : (
          <>
            <Upload className="w-12 h-12 text-slate-400" />
            <p className="text-slate-300">Drag your file here or click to select</p>
          </>
        )}
        
        {uploading && (
          <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        {uploadedFile && (
  <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-blue-500 flex items-center space-x-4 animate-in fade-in zoom-in">
{uploading && (
  <div className="w-full mt-4 flex items-center space-x-3">
    <div className="flex-1 bg-slate-700 rounded-full h-2.5">
      <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
    </div>
    <button 
      onClick={handleCancel}
      className="text-xs text-red-400 hover:text-red-300 font-bold border border-red-900 px-2 py-1 rounded"
    >
      Cancel
    </button>
  </div>
)}

{/* بعد الرفع: كارت الملف مع زرار الحذف */}
{uploadedFile && (
  <div className="relative mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700 flex items-center space-x-4">
    {/* زرار الحذف (X) في الركن */}
    <button 
      onClick={handleDelete}
      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg transition-transform hover:scale-110"
    >
      <X className="w-4 h-4" />
    </button>

    {/* باقي كود عرض الملف اللي عملناه قبل كده... */}
    <div className="w-12 h-12 bg-slate-700 rounded-md flex items-center justify-center">
        {uploadedFile.type.startsWith('image/') ? (
            <img src={uploadedFile.url} className="w-full h-full object-cover rounded" />
        ) : (
            <File className="text-blue-400" />
        )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-medium truncate">{uploadedFile.name}</p>
      <p className="text-slate-500 text-xs">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
    </div>
  </div>
)}

        <div className="flex-1">
        <p className="text-white font-medium truncate w-48">{uploadedFile.name}</p>
        <p className="text-slate-400 text-xs">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
        </div>

        <div className="flex items-center space-x-2">
        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded">SECURE</span>
        <ShieldCheck className="text-green-500 w-5 h-5" />
        </div>
    </div>
    )}
      </div>
    </div>
  );
};