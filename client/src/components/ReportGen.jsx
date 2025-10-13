import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Download, Eye, Upload, X, Plus, Trash2, Save, RefreshCw } from 'lucide-react';

// Sample data for quick testing
const SAMPLE_DATA = {
  doctor: {
    name: "Dr. Sourav Mondal (SAMPLE)",
    qualification: "Orthopaedic Surgeon, MBBS, MS(Ortho)",
    hospital: "Demo Hospital — SAMPLE DATA ONLY",
    regNo: "Reg. No. 73997",
    phone: "+91-XXXXXXXXXX",
    email: "demo@example.com",
    logo: ""
  },
  patient: {
    name: "Sahirazam Begat (SAMPLE)",
    age: "41",
    sex: "M",
    weight: "70 kg",
    address: "123 Sample Road, Demo City, State - 000000",
    date: new Date().toISOString().split('T')[0],
    patientId: "P12345",
    knownDiabetic: true
  },
  rx: "Tab. Zerodol-SP\nTab. Pantop-D\nCap. Lyser\n\nAdvice:\n• Rest and ice application\n• Avoid strenuous activities\n• Follow up after 7 days",
  diagnosis: "Trigger thumb - sample diagnosis only",
  prescriptions: [
    { id: 1, name: "Tab. Zerodol-SP", dose: "1", freq: "BID", duration: "7 days" },
    { id: 2, name: "Tab. Pantop-D", dose: "1", freq: "OD", duration: "7 days" },
    { id: 3, name: "Cap. Lyser", dose: "1", freq: "TID", duration: "5 days" }
  ],
  signature: "Dr. Sourav Mondal"
};

const SAMPLE_MEDICATIONS = [
  "Tab. Zerodol-SP",
  "Tab. Pantop-D",
  "Cap. Lyser",
  "Tab. Paracetamol 500mg",
  "Tab. Ibuprofen 400mg"
];

const MedicalReportGen = () => {
  const [formData, setFormData] = useState(SAMPLE_DATA);
  const [showPreview, setShowPreview] = useState(false);
  const [useHandwriting, setUseHandwriting] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [signaturePreview, setSignaturePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const modalRef = useRef(null);
  const previewRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('medicalReportDemo');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  // Autosave to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('medicalReportDemo', JSON.stringify(formData));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Modal animations and accessibility
  useEffect(() => {
    if (showPreview && modalRef.current) {
      modalRef.current.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPreview) {
        setShowPreview(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showPreview]);

  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const updatePrescription = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const addPrescription = () => {
    const newId = Math.max(...formData.prescriptions.map(p => p.id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { id: newId, name: '', dose: '', freq: '', duration: '' }]
    }));
  };

  const removePrescription = (id) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter(p => p.id !== id)
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        updateField('doctor', 'logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patient.name.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData.patient.date) newErrors.date = 'Date is required';
    if (formData.prescriptions.length === 0) newErrors.prescriptions = 'At least one prescription is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleExport = () => {
     console.log(formData)
  };

  const clearData = () => {
    if (confirm('Clear all demo data and reset to sample values?')) {
      setFormData(SAMPLE_DATA);
      setLogoPreview('');
      setSignaturePreview('');
      localStorage.removeItem('medicalReportDemo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-violet-900 py-8 px-4">
      {/* Disclaimer Banner */}
      <div className="max-w-7xl mx-auto mb-6 bg-red-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-bold text-lg">⚠️ DEMO / SAMPLE DATA ONLY — NOT A MEDICAL DOCUMENT</p>
            <p className="text-sm">This UI is for design/demo purposes and must not be used to create, modify, or distribute actual medical records.</p>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                📋 Medical Report Demo
                <span className="text-lg font-normal text-white/70">(UI Only)</span>
              </h1>
              <div className="flex gap-2">
                {saved && <span className="text-green-400 text-sm flex items-center gap-1"><Save className="w-4 h-4" /> Saved</span>}
                <button
                  onClick={clearData}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition flex items-center gap-2"
                  aria-label="Clear demo data"
                >
                  <RefreshCw className="w-4 h-4" /> Clear Data
                </button>
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="bg-white/5 backdrop-blur rounded-xl p-6 mb-6 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Doctor Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="doctorName">Full Name *</label>
                <input
                  id="doctorName"
                  type="text"
                  value={formData.doctor.name}
                  onChange={(e) => updateField('doctor', 'name', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="qualification">Qualification</label>
                <input
                  id="qualification"
                  type="text"
                  value={formData.doctor.qualification}
                  onChange={(e) => updateField('doctor', 'qualification', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm mb-2" htmlFor="hospital">Hospital/Clinic</label>
                <input
                  id="hospital"
                  type="text"
                  value={formData.doctor.hospital}
                  onChange={(e) => updateField('doctor', 'hospital', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="regNo">Registration Number</label>
                <input
                  id="regNo"
                  type="text"
                  value={formData.doctor.regNo}
                  onChange={(e) => updateField('doctor', 'regNo', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.doctor.phone}
                  onChange={(e) => updateField('doctor', 'phone', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.doctor.email}
                  onChange={(e) => updateField('doctor', 'email', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="logo">Logo Upload (Optional)</label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
                {logoPreview && <img src={logoPreview} alt="Logo preview" className="mt-2 h-16 rounded" />}
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-white/5 backdrop-blur rounded-xl p-6 mb-6 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Patient Information</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm mb-2" htmlFor="patientName">Patient Name *</label>
                <input
                  id="patientName"
                  type="text"
                  value={formData.patient.name}
                  onChange={(e) => updateField('patient', 'name', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.patientName ? 'border-red-500' : 'border-white/20'}`}
                />
                {errors.patientName && <p className="text-red-400 text-sm mt-1">{errors.patientName}</p>}
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="patientId">Patient ID</label>
                <input
                  id="patientId"
                  type="text"
                  value={formData.patient.patientId}
                  onChange={(e) => updateField('patient', 'patientId', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="age">Age</label>
                <input
                  id="age"
                  type="text"
                  value={formData.patient.age}
                  onChange={(e) => updateField('patient', 'age', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="sex">Sex</label>
                <select
                  id="sex"
                  value={formData.patient.sex}
                  onChange={(e) => updateField('patient', 'sex', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="weight">Weight</label>
                <input
                  id="weight"
                  type="text"
                  value={formData.patient.weight}
                  onChange={(e) => updateField('patient', 'weight', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm mb-2" htmlFor="address">Address</label>
                <textarea
                  id="address"
                  value={formData.patient.address}
                  onChange={(e) => updateField('patient', 'address', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2" htmlFor="date">Date *</label>
                <input
                  id="date"
                  type="date"
                  value={formData.patient.date}
                  onChange={(e) => updateField('patient', 'date', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.date ? 'border-red-500' : 'border-white/20'}`}
                />
                {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
              </div>
              <div className="md:col-span-3">
                <label className="flex items-center gap-2 text-white/80">
                  <input
                    type="checkbox"
                    checked={formData.patient.knownDiabetic}
                    onChange={(e) => updateField('patient', 'knownDiabetic', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  Known Diabetic
                </label>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Rx Section */}
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">Rx</h2>
                <label className="flex items-center gap-2 text-white/80 text-sm">
                  <input
                    type="checkbox"
                    checked={useHandwriting}
                    onChange={(e) => setUseHandwriting(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  Handwritten Style
                </label>
              </div>
              <textarea
                value={formData.rx}
                onChange={(e) => setFormData(prev => ({ ...prev, rx: e.target.value }))}
                rows={12}
                style={{ fontFamily: useHandwriting ? 'cursive' : 'inherit' }}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Enter prescription details..."
              />
            </div>

            {/* Diagnosis & Prescriptions */}
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-4">Diagnosis</h2>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter diagnosis..."
                />
              </div>

              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white">Prescriptions</h2>
                  <button
                    onClick={addPrescription}
                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-white rounded-lg transition flex items-center gap-1 text-sm"
                    aria-label="Add prescription"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {errors.prescriptions && <p className="text-red-400 text-sm mb-2">{errors.prescriptions}</p>}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {formData.prescriptions.map((rx) => (
                    <div key={rx.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={rx.name}
                          onChange={(e) => updatePrescription(rx.id, 'name', e.target.value)}
                          placeholder="Medicine name"
                          className="flex-1 px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <button
                          onClick={() => removePrescription(rx.id)}
                          className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-white rounded transition"
                          aria-label="Remove prescription"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={rx.dose}
                          onChange={(e) => updatePrescription(rx.id, 'dose', e.target.value)}
                          placeholder="Dose"
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <input
                          type="text"
                          value={rx.freq}
                          onChange={(e) => updatePrescription(rx.id, 'freq', e.target.value)}
                          placeholder="Freq"
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <input
                          type="text"
                          value={rx.duration}
                          onChange={(e) => updatePrescription(rx.id, 'duration', e.target.value)}
                          placeholder="Duration"
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-white/80 text-sm mb-2">Quick Add Sample Med:</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const newId = Math.max(...formData.prescriptions.map(p => p.id), 0) + 1;
                        setFormData(prev => ({
                          ...prev,
                          prescriptions: [...prev.prescriptions, { id: newId, name: e.target.value, dose: '1', freq: 'BID', duration: '7 days' }]
                        }));
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select medication...</option>
                    {SAMPLE_MEDICATIONS.map((med, i) => (
                      <option key={i} value={med}>{med}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePreview}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 shadow-lg font-semibold"
            >
              <Eye className="w-5 h-5" /> Preview Report
            </button>
            <button
              onClick={handleExport}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2 shadow-lg font-semibold"
            >
              <Download className="w-5 h-5" /> Export PDF (Demo)
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowPreview(false)}
          style={{
            animation: prefersReducedMotion ? 'none' : 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
            tabIndex={-1}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: prefersReducedMotion ? 'none' : 'scaleIn 0.3s ease-out'
            }}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition z-10"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Preview Content */}
            <div ref={previewRef} className="p-8 relative">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                <div className="text-gray-400 text-6xl font-bold opacity-10 transform -rotate-45 whitespace-nowrap">
                  SAMPLE — NOT A MEDICAL DOCUMENT
                </div>
              </div>

              {/* Disclaimer in Preview */}
              <div className="bg-red-100 border-2 border-red-500 text-red-800 p-4 rounded-lg mb-6 relative z-10">
                <p className="font-bold text-center">⚠️ SAMPLE DATA ONLY — THIS IS A DEMO. NOT A MEDICAL DOCUMENT.</p>
              </div>

              {/* Report Header */}
              <div className="border-b-2 border-gray-300 pb-4 mb-6 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {logoPreview && (
                      <img src={logoPreview} alt="Clinic logo" className="h-20 mb-2" />
                    )}
                    <h1 className="text-3xl font-bold text-gray-800">{formData.doctor.name}</h1>
                    <p className="text-lg text-gray-600">{formData.doctor.qualification}</p>
                    <p className="text-gray-600">{formData.doctor.hospital}</p>
                    <p className="text-sm text-gray-500 mt-2">{formData.doctor.regNo}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>📞 {formData.doctor.phone}</p>
                    <p>✉️ {formData.doctor.email}</p>
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 relative z-10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="font-semibold">Patient Name:</span> {formData.patient.name}</p>
                    <p><span className="font-semibold">Age/Sex:</span> {formData.patient.age} / {formData.patient.sex}</p>
                    <p><span className="font-semibold">Weight:</span> {formData.patient.weight}</p>
                  </div>
                  <div>
                    <p><span className="font-semibold">Date:</span> {new Date(formData.patient.date).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Patient ID:</span> {formData.patient.patientId}</p>
                    {formData.patient.knownDiabetic && (
                      <p><span className="font-semibold">Known Diabetic:</span> Yes</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p><span className="font-semibold">Address:</span> {formData.patient.address}</p>
                  </div>
                </div>
              </div>

              {/* Main Content - Two Columns */}
              <div className="grid grid-cols-2 gap-6 mb-6 relative z-10">
                {/* Left Column - Rx */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Rx</h2>
                  <div 
                    className="whitespace-pre-wrap text-gray-700"
                    style={{ fontFamily: useHandwriting ? 'cursive' : 'inherit', fontSize: useHandwriting ? '1.1rem' : '1rem' }}
                  >
                    {formData.rx}
                  </div>
                </div>

                {/* Right Column - Diagnosis & Prescriptions */}
                <div className="space-y-4">
                  <div className="border border-gray-300 rounded-lg p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Diagnosis</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.diagnosis}</p>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Prescriptions</h2>
                    <div className="space-y-2">
                      {formData.prescriptions.map((rx, index) => (
                        <div key={rx.id} className="text-sm text-gray-700">
                          <p className="font-semibold">{index + 1}. {rx.name}</p>
                          <p className="ml-4 text-gray-600">
                            Dose: {rx.dose} | Frequency: {rx.freq} | Duration: {rx.duration}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-8 flex justify-end relative z-10">
                <div className="text-center">
                  {signaturePreview ? (
                    <img src={signaturePreview} alt="Doctor signature" className="h-16 mb-2" />
                  ) : (
                    <p className="text-2xl mb-2" style={{ fontFamily: 'cursive' }}>
                      {formData.signature}
                    </p>
                  )}
                  <div className="border-t-2 border-gray-400 pt-2">
                    <p className="font-semibold text-gray-800">{formData.doctor.name}</p>
                    <p className="text-sm text-gray-600">{formData.doctor.qualification}</p>
                    <p className="text-sm text-gray-600">{formData.doctor.regNo}</p>
                  </div>
                </div>
              </div>

              {/* Footer Disclaimer */}
              <div className="mt-8 pt-4 border-t-2 border-gray-300 text-center text-xs text-gray-500 relative z-10">
                <p className="font-bold text-red-600">SAMPLE DOCUMENT FOR DEMONSTRATION PURPOSES ONLY</p>
                <p>This is not a valid medical document and should not be used for any medical or legal purposes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }
          
          #preview-modal, #preview-modal * {
            visibility: visible;
          }
          
          #preview-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          button {
            display: none !important;
          }
        }

        /* Focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid #60a5fa;
          outline-offset: 2px;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MedicalReportGen;