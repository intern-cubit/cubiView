import React, { useState } from 'react';

const UploadReport = () => {
    const [macId, setMacId] = useState('');
    const [file, setFile] = useState(null);
    const [uploadUrl, setUploadUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!macId || !file) {
            alert('Hey, don\'t forget the MAC ID and a .zip file!');
            return;
        }

        const formData = new FormData();
        formData.append('macId', macId);
        formData.append('reportZip', file);

        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/device/report', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Upload failed');
            }

            const data = await response.json();
            setUploadUrl(data.url);
        } catch (err) {
            console.error(err);
            alert(`🐛 Oops! ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const res = await fetch(uploadUrl);
            if (!res.ok) throw new Error('Could not fetch the ZIP');
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            link.setAttribute('download', `report_${macId}_${ts}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error(err);
            alert(`Download error: ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-900 to-black">
            <div className="w-full max-w-md">
                <div className="border border-yellow-500 rounded-t-2xl p-1 bg-gradient-to-r from-yellow-500 to-yellow-700">
                    <h1 className="text-center text-white font-bold py-2 text-2xl">
                        Upload Report
                    </h1>
                </div>

                <div
                    className="bg-gray-900 p-8 rounded-b-2xl shadow-xl w-full border-l border-r border-b border-yellow-500"
                >
                    <div className="mb-8 text-center">
                        <span className="inline-block p-4 rounded-full bg-gray-800 border border-yellow-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </span>
                    </div>

                    <div className="block mb-4">
                        <span className="text-sm font-medium text-yellow-500">MAC ID</span>
                        <input
                            type="text"
                            value={macId}
                            onChange={(e) => setMacId(e.target.value)}
                            className="mt-1 block w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="0123456789"
                        />
                    </div>

                    <div className="mb-6">
                        <span className="text-sm font-medium text-yellow-500 block mb-2">Choose ZIP file</span>
                        <div className="relative border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors">
                            <input
                                type="file"
                                accept=".zip"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-white">
                                {file ? (
                                    <p className="text-sm truncate">{file.name}</p>
                                ) : (
                                    <>
                                        <p className="text-yellow-500">Drop ZIP file here or click to browse</p>
                                        <p className="text-xs text-gray-500 mt-1">Only .zip files are accepted</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition duration-200 disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Upload Report'
                        )}
                    </button>
                </div>
            </div>

            {uploadUrl && (
                <div className="mt-8 bg-gray-900 p-6 rounded-xl border border-yellow-500 shadow-xl w-full max-w-md">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-yellow-500 rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-yellow-500 mb-4 text-center">
                        Upload Successful!
                    </p>
                    <div className="bg-gray-800 p-3 rounded-lg mb-4 overflow-hidden">
                        <p className="text-gray-400 text-sm break-all">
                            <span className="text-white">Reference URL:</span> {uploadUrl}
                        </p>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="w-full bg-gray-800 border border-yellow-500 text-yellow-500 font-medium py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download ZIP
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadReport;