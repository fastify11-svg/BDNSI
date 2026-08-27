import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function SmartScanner({ onDataExtracted }) {
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [pastedText, setPastedText] = useState('');
    const [activeTab, setActiveTab] = useState('image'); // 'image' or 'text'
    const [detectedFields, setDetectedFields] = useState(null);
    const [rawScanText, setRawScanText] = useState('');
    const [prefilled, setPrefilled] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);

    const processImage = async (file) => {
        setScanning(true);
        setProgress(50); // Just a visual indicator for uploading
        setDetectedFields(null);
        setPrefilled(false);
        setCurrentFile(file);

        let imageSource = file;

        if (file.type === 'application/pdf') {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const page = await pdf.getPage(1);
                
                const scale = 2.0; 
                const viewport = page.getViewport({ scale });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({ canvasContext: context, viewport }).promise;
                imageSource = canvas.toDataURL('image/png');
                setImagePreview(imageSource);
            } catch (err) {
                console.error("PDF Parsing error: ", err);
                setScanning(false);
                return;
            }
        } else {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }

        try {
            const formData = new FormData();
            // If it's a PDF, we generated a base64 png, we should convert back to blob
            if (typeof imageSource === 'string' && imageSource.startsWith('data:image')) {
                const res = await fetch(imageSource);
                const blob = await res.blob();
                formData.append('image', blob, 'page.png');
            } else {
                formData.append('image', file);
            }

            const response = await axios.post('/gemini/extract-ocr', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProgress(100);
            
            const extracted = response.data;
            // Map the API output to our required keys if they don't exactly match
            const mappedFields = {
                name: extracted.Name || extracted.name || '',
                fathers_name: extracted["Father's Name"] || extracted.fathers_name || '',
                mothers_name: extracted["Mother's Name"] || extracted.mothers_name || '',
                date_of_birth: extracted["Date of Birth"] || extracted.date_of_birth || '',
                phone: extracted["Phone Number"] || extracted.phone || '',
                passport: extracted["Passport Number"] || extracted.passport || '',
                nid_or_birth: extracted["NID/Registration Number"] || extracted.nid_or_birth || extracted.nid || '',
                gender: extracted.Gender || extracted.gender || '',
                district: extracted.District || extracted.district || '',
                upazila: extracted.Upazila || extracted.upazila || '',
            };

            setDetectedFields(mappedFields);
            setRawScanText(JSON.stringify(extracted, null, 2));
            setScanning(false);
        } catch (err) {
            console.error("Gemini OCR Error:", err);
            const errMsg = "OCR Error: Unable to extract text. Details: " + (err.response?.data?.error || err.response?.data?.message || err.message || "Unknown API failure.");
            setRawScanText(errMsg);
            setDetectedFields(null);
            setScanning(false);
        }
    };

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            processImage(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
            'application/pdf': ['.pdf']
        }
    });

    const handleTextScan = () => {
        setScanning(true);
        setDetectedFields(null);
        setPrefilled(false);
        setProcessedPreview(null);
        setTimeout(() => {
            const extracted = extractDocumentData(pastedText);
            setDetectedFields(extracted);
            setRawScanText(pastedText);
            setScanning(false);
        }, 500);
    };

    const fieldLabels = detectedFields ? [
        { label: 'Name', value: detectedFields.name },
        { label: "Father's Name", value: detectedFields.fathers_name },
        { label: "Mother's Name", value: detectedFields.mothers_name },
        { label: 'Address / Reg No', value: detectedFields.registration || detectedFields.district },
        { label: 'Date of Birth', value: detectedFields.date_of_birth },
        { label: 'Phone Number', value: detectedFields.phone },
        { label: 'Passport Number', value: detectedFields.passport },
        { label: 'NID / Personal No', value: detectedFields.nid_or_birth },
        { label: 'Gender', value: detectedFields.gender },
        { label: 'District', value: detectedFields.district },
        { label: 'Thana', value: detectedFields.upazila },
    ] : [];

    return (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sticky top-6 h-fit">
            <div className="mb-4 pb-3 border-b border-slate-100">
                <h2 className="font-extrabold text-base text-slate-800 tracking-tight flex items-center gap-2">
                    <i className="fa-solid fa-wand-magic-sparkles text-[#7024A8]"></i>
                    OCR Import (Upload &amp; Prefill)
                </h2>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Extract <strong className="text-slate-700">Name, Father's Name, Mother's Name, Address, Date of Birth, Phone Number, Passport Number, Gender, District</strong> and <strong className="text-slate-700">Thana</strong> — then prefill the Registration form.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-4 gap-4">
                <button
                    type="button"
                    onClick={() => setActiveTab('image')}
                    className={`text-xs py-2 font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'image' ? 'border-[#7024A8] text-[#7024A8]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <i className="fa-regular fa-image"></i> Image OCR
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('text')}
                    className={`text-xs py-2 font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'text' ? 'border-[#7024A8] text-[#7024A8]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <i className="fa-solid fa-paste"></i> Text OCR
                </button>
            </div>

            {activeTab === 'image' && (
                <div 
                    {...getRootProps()} 
                    className={`relative overflow-hidden border border-slate-300 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50 ${
                        isDragActive ? 'border-[#7024A8] bg-[#7024A8]/5' : 'hover:border-[#7024A8]'
                    }`}
                >
                    <input {...getInputProps()} />
                    
                    {imagePreview ? (
                        <div className="relative py-2 space-y-3">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 mb-1">1. Original Document</p>
                                <img src={imagePreview} alt="Original Preview" className="max-h-48 mx-auto rounded shadow-xs object-contain border border-slate-200 bg-white" />
                            </div>
                            {scanning && (
                                <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center backdrop-blur-2xs rounded">
                                    <div className="text-white font-black text-xs drop-shadow-md flex items-center gap-2 bg-slate-800/90 px-5 py-2.5 rounded-full border border-slate-600 shadow-xl">
                                        <i className="fa-solid fa-circle-notch fa-spin text-[#F59E0B]"></i>
                                        Scanning with Gemini AI... {progress}%
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-1 py-4">
                            <div className="flex items-center justify-center gap-2 text-slate-600 text-xs font-semibold">
                                <span className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 font-bold transition">Choose file</span>
                                <span className="text-slate-400 font-normal">No file chosen</span>
                            </div>
                            <p className="text-[10px] text-slate-400 pt-1">Clear, upright photos or PDF work best.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'text' && (
                <div className="space-y-2.5">
                    <textarea 
                        rows="5"
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#7024A8] focus:border-[#7024A8] resize-none text-slate-700 bg-slate-50/30 font-mono"
                        placeholder="Paste any text here — structured or unstructured. E.g: name musharaf father name muhammad khalil mother fatima dob 12 jan 1990 address dhaka phone 01700000000"
                        value={pastedText}
                        onChange={(e) => {
                            setPastedText(e.target.value);
                            setPrefilled(false);
                        }}
                    ></textarea>
                    <p className="text-[10px] text-slate-400">Works with paragraphs, structured forms, or mixed text.</p>
                    <button 
                        type="button"
                        onClick={handleTextScan}
                        disabled={scanning || !pastedText.trim()}
                        className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        {scanning ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Extracting...</> : <><i className="fa-solid fa-bolt"></i> Extract from Text</>}
                    </button>
                </div>
            )}

            {detectedFields && !scanning && (
                <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-200 animate-fadeIn">
                    <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-xs text-slate-800 tracking-tight">Detected fields</h4>
                        <button 
                            type="button" 
                            onClick={() => { setDetectedFields(null); setImagePreview(null); setPastedText(''); setPrefilled(false); }} 
                            className="text-[10px] text-red-500 hover:text-red-700 font-bold underline cursor-pointer"
                        >
                            Clear
                        </button>
                    </div>
                    
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs bg-white shadow-2xs">
                        {fieldLabels.map((f, i) => (
                            <div key={i} className="flex justify-between items-center py-1.5 px-3 hover:bg-slate-50 transition-colors">
                                <span className="text-slate-500 font-medium">{f.label}</span>
                                <span className={`font-bold truncate max-w-[210px] text-right ${f.value ? 'text-slate-800' : 'text-slate-300'}`}>
                                    {f.value || '—'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {prefilled ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-2xs mt-3 animate-pulse">
                            <i className="fa-solid fa-check-circle text-emerald-600 text-sm"></i>
                            <span>Form Prefilled Successfully!</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                if (onDataExtracted) onDataExtracted(detectedFields, rawScanText, currentFile);
                                setPrefilled(true);
                            }}
                            className="w-full py-2.5 bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] text-slate-900 font-black rounded-xl shadow-md hover:shadow-lg transition-all text-xs tracking-wide flex items-center justify-center gap-1.5 cursor-pointer mt-3"
                        >
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                            Prefill Registration form
                        </button>
                    )}

                    <details className="mt-3 text-[11px] border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-600">
                        <summary className="font-bold cursor-pointer text-slate-700 select-none flex items-center justify-between">
                            <span><i className="fa-solid fa-code text-[#7024A8] mr-1"></i> View Raw OCR Text (Debug Log)</span>
                            <span className="text-[10px] text-slate-400">Click to expand</span>
                        </summary>
                        <div className="mt-2 font-mono whitespace-pre-wrap text-[10px] bg-white p-2.5 border border-slate-200 rounded max-h-36 overflow-y-auto text-slate-800">
                            {rawScanText || "No text detected yet."}
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
}
