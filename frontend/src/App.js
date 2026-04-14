console.log("NEW APP JS LOADED");

import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import ExtractionRow from './components/ExtractionRow';
import DocumentViewer from './components/DocumentViewer';
import FooterBar from './components/FooterBar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';

function App() {
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [fileName, setFileName] = useState('No document uploaded');
  const [isUploading, setIsUploading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [uploadedFields, setUploadedFields] = useState([]);
  const [hasUploadedDocument, setHasUploadedDocument] = useState(false);
  const [rawResponse, setRawResponse] = useState(null);
  const fileInputRef = useRef(null);

  const fields = uploadedFields;
  console.log('FIELDS IN UI:', fields);

  const selectedField = selectedFieldId
    ? fields.find((f) => f.id === selectedFieldId) || null
    : null;

  const getFieldValue = (field) => {
    return editedValues[field.id] !== undefined
      ? editedValues[field.id]
      : field.extractedValue;
  };

  const handleEdit = useCallback((fieldId, value) => {
    setEditedValues((prev) => ({ ...prev, [fieldId]: value }));
    setLastUpdated(new Date());
  }, []);

  const handleView = useCallback((fieldId) => {
    setSelectedFieldId(fieldId);
  }, []);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setSelectedFieldId(null);
    setUploadedFields([]);
    setEditedValues({});
    setHasUploadedDocument(true);
    setRawResponse(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('RAW UPLOAD RESPONSE:', data);
      setRawResponse(data);

      const mappedFields = Array.isArray(data?.fields)
        ? data.fields.map((item, index) => ({
            id: item.id || `field_${index}`,
            fieldLabel: item.fieldLabel || item.field_name || `FIELD ${index + 1}`,
            extractedValue: item.extractedValue || item.value || '',
            sourceSentence: item.sourceSentence || item.source_sentence || '',
            matchedText: item.matchedText || item.matched_text || '',
            page: item.page || item.page_number || 1,
            confidence:
              typeof item.confidence === 'number' ? item.confidence : 0.94,
          }))
        : [];

      console.log('MAPPED FIELDS:', mappedFields);
      console.log('MAPPED FIELDS LENGTH:', mappedFields.length);

      setUploadedFields(mappedFields);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Upload error:', error);
      setUploadedFields([]);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const avgConfidence = fields.length
    ? Math.round(
        fields.reduce((acc, f) => acc + (f.confidence || 0), 0) / fields.length
      )
    : 0;

  const downloadFile = (content, dlFileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dlFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!fields.length) return;

    const header = [
      'Field Label',
      'Extracted Value',
      'Source Sentence',
      'Page',
      'Matched Text',
    ];

    const rows = fields.map((f) => [
      `"${String(f.fieldLabel || '').replace(/"/g, '""')}"`,
      `"${String(getFieldValue(f) || '').replace(/"/g, '""')}"`,
      `"${String(f.sourceSentence || '').replace(/"/g, '""')}"`,
      f.page ?? 1,
      `"${String(f.matchedText || '').replace(/"/g, '""')}"`,
    ]);

    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csv, 'aomatch_export.csv', 'text/csv');
  };

  const exportJSON = () => {
    if (!fields.length) return;

    const payload = {
      document: fileName,
      exportedAt: new Date().toISOString(),
      totalFields: fields.length,
      avgConfidence,
      fields: fields.map((f) => ({
        id: f.id,
        fieldLabel: f.fieldLabel,
        extractedValue: getFieldValue(f),
        originalValue: f.extractedValue,
        isEdited: editedValues[f.id] !== undefined,
        sourceSentence: f.sourceSentence,
        matchedText: f.matchedText,
        page: f.page,
        confidence: f.confidence,
      })),
    };

    downloadFile(
      JSON.stringify(payload, null, 2),
      'aomatch_export.json',
      'application/json'
    );
  };

  return (
    <div className="App flex flex-col h-screen overflow-hidden bg-white" data-testid="app-root">
      <Header
        fileName={fileName}
        totalFields={fields.length}
        onUpload={handleUploadClick}
        onExportCSV={exportCSV}
        onExportJSON={exportJSON}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={handleFileChange}
        data-testid="file-input"
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 flex flex-col overflow-hidden border-r border-slate-200">
          <div
            className="flex-shrink-0 grid bg-[#1a2332] text-white px-4 py-3"
            style={{ gridTemplateColumns: '1fr 110px 1fr' }}
            data-testid="table-header"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              Source Sentence
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-center">
              View
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest pl-4">
              Field &amp; Extracted Info
            </span>
          </div>

          <div className="flex-1 overflow-y-auto" data-testid="extraction-table">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                <div className="w-7 h-7 border-[2.5px] border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500 font-medium">
                  Extracting fields from document...
                </p>
                <p className="text-xs text-slate-400 font-mono">{fileName}</p>
              </div>
            ) : !hasUploadedDocument ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="max-w-md text-center">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Upload a document to begin extraction review
                  </h2>
                  <p className="text-slate-500 mb-6">
                    No document has been uploaded yet. Upload a document to extract
                    fields and review them here.
                  </p>
                  <button
                    onClick={handleUploadClick}
                    className="px-5 py-3 rounded-lg bg-[#142033] text-white font-medium hover:bg-[#1c2b44]"
                  >
                    Upload Document
                  </button>
                </div>
              </div>
            ) : fields.length === 0 ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="max-w-2xl text-center">
                  <h2 className="text-xl font-bold text-slate-900 mb-3">
                    No fields were extracted
                  </h2>
                  <p className="text-slate-500 mb-6">
                    The document uploaded successfully, but no usable fields were returned from the backend.
                  </p>

                  {rawResponse && (
                    <pre className="text-left bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs overflow-auto max-h-80 whitespace-pre-wrap break-words">
                      {JSON.stringify(rawResponse, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {fields.map((field, idx) => (
                  <ExtractionRow
                    key={field.id}
                    field={field}
                    editedValue={getFieldValue(field)}
                    onEdit={(value) => handleEdit(field.id, value)}
                    onView={() => handleView(field.id)}
                    isSelected={selectedFieldId === field.id}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 overflow-hidden bg-slate-50 flex flex-col">
          {!hasUploadedDocument ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-md text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Original Document
                </h2>
                <p className="text-slate-500">
                  Upload a document to view extracted fields and highlighted source
                  context here.
                </p>
              </div>
            </div>
          ) : fields.length === 0 || !selectedField ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-md text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Original Document
                </h2>
                <p className="text-slate-500">
                  {fields.length === 0
                    ? 'No extracted fields are available for this document.'
                    : 'Click "View" on a row to inspect the highlighted source in the document.'}
                </p>
              </div>
            </div>
          ) : (
            <DocumentViewer
              mode="grant"
              selectedField={selectedField}
              selectedFieldId={selectedFieldId}
            />
          )}
        </div>
      </div>

      <FooterBar
        totalFields={fields.length}
        avgConfidence={avgConfidence}
        status={hasUploadedDocument ? 'Ready' : 'Waiting'}
        lastUpdated={lastUpdated}
      />
    </div>
  );
}

export default App;