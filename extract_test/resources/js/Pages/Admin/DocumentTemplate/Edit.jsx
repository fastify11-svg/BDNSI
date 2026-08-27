import React, { useState, useRef, useEffect, useCallback } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { getUrl } from '@/utils/urlHelper';

export default function Edit(props) {
    const { template } = props;
    
    // Undo/Redo State
    const [history, setHistory] = useState([template.fields || []]);
    const [historyIndex, setHistoryIndex] = useState(0);
    
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [snapToGrid, setSnapToGrid] = useState(false);
    const [zoom, setZoom] = useState(1);
    
    const fields = history[historyIndex];

    const pushToHistory = (newFields) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newFields);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setSelectedFieldId(null);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setSelectedFieldId(null);
        }
    };
    
    const availableVariables = [
        // Student Info
        { key: 'student_name', label: 'Student Name', sample: 'John Doe', type: 'text', group: 'Student' },
        { key: 'fathers_name', label: 'Father\'s Name', sample: 'James Doe', type: 'text', group: 'Student' },
        { key: 'mothers_name', label: 'Mother\'s Name', sample: 'Jane Doe', type: 'text', group: 'Student' },
        { key: 'student_roll', label: 'Roll Number', sample: '123456', type: 'text', group: 'Student' },
        { key: 'student_registration', label: 'Registration No', sample: 'REG-7890', type: 'text', group: 'Student' },
        { key: 'student_phone', label: 'Student Phone', sample: '01700000000', type: 'text', group: 'Student' },
        // Course Info
        { key: 'course_name', label: 'Course Name', sample: 'Diploma in Computer Science', type: 'text', group: 'Course' },
        { key: 'course_duration', label: 'Course Duration', sample: '1 Year', type: 'text', group: 'Course' },
        { key: 'session_name', label: 'Session', sample: 'Jan-Dec 2024', type: 'text', group: 'Course' },
        // Center Info
        { key: 'center_name', label: 'Center Name', sample: 'Dhaka Main Campus', type: 'text', group: 'Center' },
        { key: 'center_code', label: 'Center Code', sample: 'DH101', type: 'text', group: 'Center' },
        // Results & Certificate
        { key: 'cgpa', label: 'CGPA', sample: '4.50', type: 'text', group: 'Result' },
        { key: 'grade', label: 'Grade', sample: 'A+', type: 'text', group: 'Result' },
        { key: 'serial_no', label: 'Serial No', sample: '123456789', type: 'text', group: 'Result' },
        { key: 'exam_date', label: 'Exam Date', sample: '25-June-2024', type: 'text', group: 'Result' },
        { key: 'result_published_date', label: 'Result Published', sample: '30-June-2024', type: 'text', group: 'Result' },
        { key: 'issue_date', label: 'Issue Date', sample: '10 Oct 2024', type: 'text', group: 'Result' },
        // Media
        { key: 'qr_code', label: 'QR Code', sample: '[QR]', type: 'image', group: 'Media' },
        { key: 'student_image', label: 'Student Photo', sample: '[PHOTO]', type: 'image', group: 'Media' },
        // Tables
        // Tables
        { key: 'semester_table_1_page', label: '1-Page Semester Grid', sample: '[1-Page Table Placeholder]', type: 'html', group: 'Tables' },
        { key: 'semester_table_8_page', label: '8-Page Semester Breakdown', sample: '[8-Page Table Placeholder]', type: 'html', group: 'Tables' },
        // Static Elements
        { key: 'static_text', label: 'Custom Text Block', sample: 'Double click to edit', type: 'static_text', group: 'Static Elements' },
        { key: 'static_image', label: 'Custom Image Layer', sample: '[Upload Image]', type: 'static_image', group: 'Static Elements' },
    ];

    const canvasRef = useRef(null);
    const [draggingId, setDraggingId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e, field) => {
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'select') return;
        
        e.preventDefault();
        setDraggingId(field.id);
        setSelectedFieldId(field.id);
        
        const rect = e.target.getBoundingClientRect();
        // Calculate offset considering zoom
        setDragOffset({
            x: (e.clientX - rect.left) / zoom,
            y: (e.clientY - rect.top) / zoom
        });
    };

    const handleMouseMove = useCallback((e) => {
        if (!draggingId || !canvasRef.current) return;
        
        const canvasRect = canvasRef.current.getBoundingClientRect();
        
        // Calculate raw coordinates accounting for zoom
        let newX = (e.clientX - canvasRect.left) / zoom - dragOffset.x;
        let newY = (e.clientY - canvasRect.top) / zoom - dragOffset.y;
        
        if (snapToGrid) {
            newX = Math.round(newX / 10) * 10;
            newY = Math.round(newY / 10) * 10;
        }

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        
        const newFields = fields.map(f => {
            if (f.id === draggingId) {
                return { ...f, position_x: `${newX}px`, position_y: `${newY}px` };
            }
            return f;
        });

        // Don't push to history continuously while dragging, just update current state temporarily
        // We'll commit to history on mouseUp
        const tempHistory = [...history];
        tempHistory[historyIndex] = newFields;
        setHistory(tempHistory);
        
    }, [draggingId, dragOffset, snapToGrid, fields, zoom, history, historyIndex]);

    const handleMouseUp = useCallback(() => {
        if (draggingId) {
            // Commit drag to history
            const tempHistory = [...history];
            const currentFields = tempHistory[historyIndex];
            
            // Remove the temporary change, and push proper new state
            tempHistory[historyIndex] = history[historyIndex]; 
            
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(currentFields);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
            
            setDraggingId(null);
        }
    }, [draggingId, history, historyIndex]);

    useEffect(() => {
        if (draggingId) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingId, handleMouseMove, handleMouseUp]);

    // Keyboard Nudging & Undo/Redo Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undo();
                return;
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                redo();
                return;
            }

            if (!selectedFieldId) return;

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault(); // Prevent scrolling
                const step = e.shiftKey ? 10 : 1; // Shift+Arrow moves by 10px
                
                const newFields = fields.map(f => {
                    if (f.id === selectedFieldId) {
                        let curX = parseInt(f.position_x) || 0;
                        let curY = parseInt(f.position_y) || 0;
                        
                        if (e.key === 'ArrowUp') curY -= step;
                        if (e.key === 'ArrowDown') curY += step;
                        if (e.key === 'ArrowLeft') curX -= step;
                        if (e.key === 'ArrowRight') curX += step;
                        
                        return { ...f, position_x: `${curX}px`, position_y: `${curY}px` };
                    }
                    return f;
                });
                pushToHistory(newFields);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedFieldId, fields, historyIndex]);

    const addField = (variable) => {
        const newField = {
            id: 'temp_' + Date.now(),
            variable_key: variable.key,
            position_x: '50px',
            position_y: '50px',
            font_size: '16px',
            font_family: 'Roboto',
            font_weight: 'normal',
            color: '#000000',
            text_align: 'left',
            z_index: fields.length + 1,
            letter_spacing: '0px',
            text_transform: 'none',
            text_shadow: 'none',
            width: variable.type === 'image' || variable.type === 'static_image' ? '100px' : variable.type === 'html' ? '800px' : null,
            height: variable.type === 'image' || variable.type === 'static_image' ? '100px' : variable.type === 'html' ? '400px' : null,
            element_type: variable.type, // Store the type for backend rendering
            content: variable.type === 'static_text' ? variable.sample : (variable.type === 'static_image' ? null : null),
            isNew: true,
            sample: variable.sample
        };
        pushToHistory([...fields, newField]);
        setSelectedFieldId(newField.id);
    };

    const removeField = (id) => {
        pushToHistory(fields.filter(f => f.id !== id));
        if (selectedFieldId === id) setSelectedFieldId(null);
    };

    const updateSelectedField = (key, value) => {
        const newFields = fields.map(f => {
            if (f.id === selectedFieldId) {
                return { ...f, [key]: value };
            }
            return f;
        });
        pushToHistory(newFields);
    };

    const selectedField = fields.find(f => f.id === selectedFieldId);
    const isImageField = selectedField ? (availableVariables.find(v => v.key === selectedField.variable_key)?.type === 'image' || availableVariables.find(v => v.key === selectedField.variable_key)?.type === 'static_image') : false;
    const isHtmlField = selectedField ? availableVariables.find(v => v.key === selectedField.variable_key)?.type === 'html' : false;
    const hasDimensions = isImageField || isHtmlField;

    const [isSaving, setIsSaving] = useState(false);
    
    const handleAssetUpload = async (e, fieldId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('asset', file);

        try {
            const response = await fetch(getUrl('/admin/document-templates/upload-asset'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formData
            });
            const data = await response.json();
            if (data.url) {
                const newFields = fields.map(f => {
                    if (f.id === fieldId) {
                        return { ...f, content: data.url };
                    }
                    return f;
                });
                pushToHistory(newFields);
            }
        } catch (error) {
            console.error('Error uploading asset:', error);
            alert('Failed to upload asset.');
        }
    };
    
    const saveLayout = () => {
        setIsSaving(true);
        Inertia.put(getUrl(`/admin/document-templates/${template.id}`), {
            fields: fields
        }, {
            preserveScroll: true,
            onSuccess: () => setIsSaving(false),
            onError: () => setIsSaving(false)
        });
    };

    const fonts = [
        'Roboto', 'Open Sans', 'Montserrat', 'Playfair Display', 
        'Great Vibes', 'Lato', 'Oswald', 'Poppins', 'Cinzel'
    ];

    // Dynamically inject Google Fonts
    useEffect(() => {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fonts.map(f => f.replace(' ', '+')).join('&family=')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    return (
        <AdminLayout title={`Edit Template: ${template.name}`}>
            <Head title={`Design: ${template.name}`} />
            
            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <Link href={getUrl('/admin/document-templates')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                Back
                            </Link>
                            <h2 className="mt-2 text-2xl font-bold text-gray-900 leading-tight">Design Builder: {template.name}</h2>
                        </div>
                        <div className="flex space-x-3">
                            <button 
                                onClick={undo}
                                disabled={historyIndex === 0}
                                className="inline-flex items-center p-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                                title="Undo (Ctrl+Z)"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                            </button>
                            <button 
                                onClick={redo}
                                disabled={historyIndex === history.length - 1}
                                className="inline-flex items-center p-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                                title="Redo (Ctrl+Y)"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"></path></svg>
                            </button>
                            <button 
                                onClick={saveLayout}
                                disabled={isSaving}
                                className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Layout'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)]">
                        
                        {/* Left Panel: Toolbox */}
                        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
                            
                            {/* Insert Elements */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800">Insert Elements</h3>
                                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-semibold">{fields.length} added</span>
                                </div>
                                <div className="p-4 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
                                    {Object.entries(
                                        availableVariables.reduce((acc, v) => {
                                            if (!acc[v.group]) acc[v.group] = [];
                                            acc[v.group].push(v);
                                            return acc;
                                        }, {})
                                    ).map(([group, vars]) => (
                                        <div key={group}>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{group}</h4>
                                            <div className="space-y-1.5">
                                                {vars.map(v => (
                                                    <button 
                                                        key={v.key}
                                                        onClick={() => addField(v)}
                                                        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-md hover:bg-indigo-50 transition-all group"
                                                    >
                                                        <span className="font-medium text-gray-700 group-hover:text-indigo-700">{v.label}</span>
                                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Properties Panel */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                    <h3 className="font-bold text-gray-800">Properties</h3>
                                </div>
                                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                                    {!selectedField ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                                            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                                            <p className="text-sm font-medium">Select an element on the canvas to edit its properties.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="pb-3 border-b border-gray-100 flex justify-between items-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {selectedField.variable_key}
                                                </span>
                                                <button 
                                                    onClick={() => removeField(selectedField.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                                    title="Delete Element"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>

                                            {/* Static Text Content */}
                                            {selectedField.variable_key === 'static_text' && (
                                                <div className="border-b border-gray-100 pb-3">
                                                    <label className="block text-[10px] uppercase text-gray-400 mb-1">Text Content</label>
                                                    <textarea 
                                                        value={selectedField.content || ''} 
                                                        onChange={e => updateSelectedField('content', e.target.value)}
                                                        rows="3"
                                                        className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        placeholder="Enter text..."
                                                    ></textarea>
                                                </div>
                                            )}

                                            {/* Static Image Content */}
                                            {selectedField.variable_key === 'static_image' && (
                                                <div className="border-b border-gray-100 pb-3">
                                                    <label className="block text-[10px] uppercase text-gray-400 mb-1">Upload Image</label>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={(e) => handleAssetUpload(e, selectedField.id)}
                                                        className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
                                                    />
                                                    {selectedField.content && (
                                                        <div className="mt-2 text-xs text-green-600 font-medium">Image uploaded successfully</div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Layer & Position */}
                                            <div className="grid grid-cols-2 gap-3 border-b border-gray-100 pb-3">
                                                <div>
                                                    <label className="block text-[10px] uppercase text-gray-400 mb-1">X Pos</label>
                                                    <input 
                                                        type="text" 
                                                        value={selectedField.position_x || ''} 
                                                        onChange={e => updateSelectedField('position_x', e.target.value)}
                                                        className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] uppercase text-gray-400 mb-1">Y Pos</label>
                                                    <input 
                                                        type="text" 
                                                        value={selectedField.position_y || ''} 
                                                        onChange={e => updateSelectedField('position_y', e.target.value)}
                                                        className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-[10px] uppercase text-gray-400 mb-1">Layer (Z-Index)</label>
                                                    <div className="flex items-center space-x-2">
                                                        <input 
                                                            type="number" 
                                                            value={selectedField.z_index || 1} 
                                                            onChange={e => updateSelectedField('z_index', parseInt(e.target.value))}
                                                            className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        />
                                                        <button onClick={() => updateSelectedField('z_index', (selectedField.z_index || 1) + 1)} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">Forward</button>
                                                        <button onClick={() => updateSelectedField('z_index', Math.max(1, (selectedField.z_index || 1) - 1))} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">Backward</button>
                                                    </div>
                                                </div>
                                            </div>

                                            {hasDimensions && (
                                                <div className="grid grid-cols-2 gap-3 border-b border-gray-100 pb-3">
                                                    <div>
                                                        <label className="block text-[10px] uppercase text-gray-400 mb-1">Width</label>
                                                        <input 
                                                            type="text" 
                                                            value={selectedField.width || ''} 
                                                            onChange={e => updateSelectedField('width', e.target.value)}
                                                            className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase text-gray-400 mb-1">Height</label>
                                                        <input 
                                                            type="text" 
                                                            value={selectedField.height || ''} 
                                                            onChange={e => updateSelectedField('height', e.target.value)}
                                                            className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {!hasDimensions && (
                                                <>
                                                    <div className="border-b border-gray-100 pb-3">
                                                        <label className="block text-[10px] uppercase text-gray-400 mb-1">Typography</label>
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            <input 
                                                                type="color" 
                                                                value={selectedField.color || '#000000'} 
                                                                onChange={e => updateSelectedField('color', e.target.value)}
                                                                className="w-8 h-8 rounded border-0 cursor-pointer shadow-sm"
                                                                title="Text Color"
                                                            />
                                                            <select 
                                                                value={selectedField.font_family || 'Roboto'} 
                                                                onChange={e => updateSelectedField('font_family', e.target.value)}
                                                                className="flex-1 text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            >
                                                                {fonts.map(font => (
                                                                    <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                                            <div>
                                                                <label className="block text-[10px] uppercase text-gray-400 mb-1">Size</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={selectedField.font_size || ''} 
                                                                    onChange={e => updateSelectedField('font_size', e.target.value)}
                                                                    placeholder="16px"
                                                                    className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] uppercase text-gray-400 mb-1">Weight</label>
                                                                <select 
                                                                    value={selectedField.font_weight || 'normal'} 
                                                                    onChange={e => updateSelectedField('font_weight', e.target.value)}
                                                                    className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                >
                                                                    <option value="normal">Normal</option>
                                                                    <option value="bold">Bold</option>
                                                                    <option value="500">Medium</option>
                                                                    <option value="600">Semi-Bold</option>
                                                                    <option value="800">Extra-Bold</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-[10px] uppercase text-gray-400 mb-1">Alignment</label>
                                                            <div className="flex bg-gray-100 p-1 rounded-md">
                                                                {['left', 'center', 'right'].map(align => (
                                                                    <button
                                                                        key={align}
                                                                        onClick={() => updateSelectedField('text_align', align)}
                                                                        className={`flex-1 py-1 text-sm rounded ${selectedField.text_align === align || (!selectedField.text_align && align === 'left') ? 'bg-white shadow text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                                                    >
                                                                        {align.charAt(0).toUpperCase() + align.slice(1)}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Advanced Styling */}
                                                    <div className="pt-3 border-gray-100 pb-3">
                                                        <label className="block text-[10px] uppercase text-gray-400 mb-2">Advanced Styling</label>
                                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                                            <div>
                                                                <label className="block text-[10px] text-gray-400 mb-1">Letter Spacing</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={selectedField.letter_spacing || '0px'} 
                                                                    onChange={e => updateSelectedField('letter_spacing', e.target.value)}
                                                                    placeholder="2px"
                                                                    className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] text-gray-400 mb-1">Transform</label>
                                                                <select 
                                                                    value={selectedField.text_transform || 'none'} 
                                                                    onChange={e => updateSelectedField('text_transform', e.target.value)}
                                                                    className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                >
                                                                    <option value="none">None</option>
                                                                    <option value="uppercase">UPPERCASE</option>
                                                                    <option value="lowercase">lowercase</option>
                                                                    <option value="capitalize">Capitalize</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <label className="block text-[10px] text-gray-400 mb-1">Text Shadow</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={selectedField.text_shadow || 'none'} 
                                                                    onChange={e => updateSelectedField('text_shadow', e.target.value)}
                                                                    placeholder="1px 1px 2px #ccc"
                                                                    className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Canvas Environment */}
                        <div className="flex-1 bg-gray-200 rounded-xl overflow-hidden shadow-inner border border-gray-300 flex flex-col relative">
                            {/* Canvas Toolbar */}
                            <div className="h-12 bg-white border-b border-gray-300 flex items-center justify-between px-4 z-10">
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center text-sm text-gray-700 font-medium cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={snapToGrid} 
                                            onChange={e => setSnapToGrid(e.target.checked)} 
                                            className="mr-2 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                        />
                                        Snap (10px)
                                    </label>
                                    
                                    <div className="flex items-center space-x-2 border-l pl-6 border-gray-300">
                                        <span className="text-sm font-medium text-gray-700">Zoom:</span>
                                        <select 
                                            value={zoom} 
                                            onChange={e => setZoom(parseFloat(e.target.value))}
                                            className="text-sm rounded border-gray-300 py-1 pl-2 pr-8 focus:ring-indigo-500"
                                        >
                                            <option value="0.25">25%</option>
                                            <option value="0.5">50%</option>
                                            <option value="0.75">75%</option>
                                            <option value="1">100%</option>
                                            <option value="1.25">125%</option>
                                            <option value="1.5">150%</option>
                                            <option value="2">200%</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                    Canvas: {template.width} × {template.height}
                                </div>
                            </div>

                            {/* Scrollable Canvas Area */}
                            <div className="flex-1 overflow-auto p-8 relative flex justify-center items-start custom-scrollbar">
                                <div 
                                    className="transform-gpu origin-top-center transition-transform duration-200 ease-in-out"
                                    style={{ transform: `scale(${zoom})` }}
                                >
                                        <div 
                                        ref={canvasRef}
                                        className="relative bg-white shadow-2xl border border-gray-300"
                                        style={{ 
                                            width: template.width, 
                                            height: template.height,
                                            backgroundColor: template.background_color || '#ffffff',
                                            backgroundImage: template.background_image ? `url(/storage/${template.background_image})` : 'none',
                                            backgroundSize: '100% 100%',
                                            backgroundRepeat: 'no-repeat',
                                            minWidth: template.width,
                                            minHeight: template.height,
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        {/* Grid Overlay if enabled */}
                                        {snapToGrid && (
                                            <div className="absolute inset-0 pointer-events-none opacity-20 z-0" style={{
                                                backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
                                                backgroundSize: '10px 10px'
                                            }}></div>
                                        )}

                                        {fields.map(field => {
                                            const isSelected = selectedFieldId === field.id;
                                            const fieldType = availableVariables.find(v => v.key === field.variable_key)?.type;
                                            const isImage = fieldType === 'image' || fieldType === 'static_image';
                                            const isHtml = fieldType === 'html';
                                            const isStaticText = fieldType === 'static_text';
                                            
                                            let sampleText = field.sample || availableVariables.find(v => v.key === field.variable_key)?.sample || `[${field.variable_key}]`;
                                            if (isStaticText) sampleText = field.content || 'Double click to edit';
                                            
                                            return (
                                                <div
                                                    key={field.id}
                                                    onMouseDown={(e) => handleMouseDown(e, field)}
                                                    className={`absolute cursor-move select-none transition-shadow ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 shadow-lg' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'}`}
                                                    style={{
                                                        left: field.position_x,
                                                        top: field.position_y,
                                                        zIndex: field.z_index || 1,
                                                        ...(isImage ? {
                                                            width: field.width || '100px',
                                                            height: field.height || '100px',
                                                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                                            border: '2px dashed #6366f1',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#6366f1',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold'
                                                        } : isHtml ? {
                                                            width: field.width || '800px',
                                                            height: field.height || '400px',
                                                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                            border: '2px dashed #10b981',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#10b981',
                                                            fontSize: '16px',
                                                            fontWeight: 'bold',
                                                            padding: '20px'
                                                        } : {
                                                            fontSize: field.font_size || '16px',
                                                            fontFamily: field.font_family || 'Roboto',
                                                            fontWeight: field.font_weight || 'normal',
                                                            color: field.color || '#000000',
                                                            textAlign: field.text_align || 'left',
                                                            letterSpacing: field.letter_spacing || 'normal',
                                                            textTransform: field.text_transform || 'none',
                                                            textShadow: field.text_shadow || 'none',
                                                            whiteSpace: 'nowrap',
                                                            padding: '2px 4px',
                                                            border: isSelected ? '1px dashed transparent' : '1px dashed transparent',
                                                        })
                                                    }}
                                                >
                                                    {fieldType === 'static_image' && field.content ? (
                                                        <img src={field.content} alt="Static Layer" className="w-full h-full object-cover" />
                                                    ) : (
                                                        sampleText
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 14px;
                    height: 14px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 10px;
                    border: 3px solid #f1f5f9;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
                .origin-top-center {
                    transform-origin: top center;
                }
            `}</style>
        </AdminLayout>
    );
}
