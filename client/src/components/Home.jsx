import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Eye, Download, Shield, Users, Clock, ChevronRight } from 'lucide-react';

// Sample data for templates
const templates = [
  {
    id: 1,
    name: "General Health Report",
    description: "Comprehensive overview of patient health metrics and vital signs",
    preview: {
      patientName: "John Doe — SAMPLE",
      id: "P-00000-DEMO",
      date: "2025-01-15",
      doctor: "Dr. Jane Smith — SAMPLE",
      vitals: {
        bloodPressure: "120/80 mmHg",
        heartRate: "72 bpm",
        temperature: "98.6°F",
        weight: "165 lbs"
      },
      notes: "Sample notes for demonstration purposes only. This is not real medical data."
    }
  },
  {
    id: 2,
    name: "Lab Results Template",
    description: "Standard laboratory test results with reference ranges",
    preview: {
      patientName: "Jane Smith — SAMPLE",
      id: "P-00001-DEMO",
      date: "2025-01-16",
      doctor: "Dr. Robert Johnson — SAMPLE",
      tests: [
        { name: "Hemoglobin", value: "14.5 g/dL", range: "12-16 g/dL", status: "Normal" },
        { name: "White Blood Cell", value: "7.2 K/uL", range: "4-11 K/uL", status: "Normal" },
        { name: "Glucose", value: "95 mg/dL", range: "70-100 mg/dL", status: "Normal" }
      ],
      notes: "Sample laboratory data for demonstration only. Not actual medical results."
    }
  },
  {
    id: 3,
    name: "Prescription Template",
    description: "Medication prescription format with dosage and instructions",
    preview: {
      patientName: "Bob Wilson — SAMPLE",
      id: "P-00002-DEMO",
      date: "2025-01-17",
      doctor: "Dr. Emily Davis — SAMPLE",
      medications: [
        { name: "Sample Medication A", dosage: "10mg", frequency: "Twice daily", duration: "14 days" },
        { name: "Sample Medication B", dosage: "5mg", frequency: "Once daily", duration: "30 days" }
      ],
      notes: "Fictitious prescription for UI demonstration only. Never use as actual prescription."
    }
  }
];

const MedicalReportDemo = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef(null);
  const templatesRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Initialize particles
  useEffect(() => {
    const particleCount = 50;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2
    }));
    setParticles(newParticles);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Simple scroll animation without GSAP (using IntersectionObserver)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            entry.target.classList.add('animate-in');
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (templatesRef.current) {
      const cards = templatesRef.current.querySelectorAll('.template-card');
      cards.forEach((card) => observer.observe(card));
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const openModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedTemplate(null), 300);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) closeModal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="animated-bg">
        {/* Parallax Gradient Layers */}
        <div 
          className="gradient-layer parallax-layer"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        />
        <div 
          className="gradient-layer parallax-layer opacity-60"
          style={{
            transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)`,
            animationDelay: '5s'
          }}
        />
        
        {/* Particle Field */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `float-particle ${15 + particle.id % 10}s ease-in-out infinite`,
              animationDelay: `${particle.id * 0.1}s`
            }}
          />
        ))}
      </div>

      

      {/* Warning Banner */}
      <div className="warning-banner text-white py-3 px-4 text-center font-bold text-sm md:text-base sticky top-0 z-50">
        <Shield className="inline-block mr-2 w-5 h-5" />
        SAMPLE DATA — NOT A MEDICAL DOCUMENT — FOR DEMONSTRATION PURPOSES ONLY
      </div>

      {/* Navigation */}
      <nav className="sticky top-12 z-40 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold">MedTemplate Demo</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
              <a href="#templates" className="hover:text-cyan-400 transition-colors">Templates</a>
              <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
              <a href="#accessibility" className="hover:text-cyan-400 transition-colors">Accessibility</a>
              <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
              <button className="text-cyan-400 border border-cyan-400 px-4 py-1 rounded-full hover:bg-cyan-400 hover:text-slate-900 transition-all">
                Demo Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center hero-animate">
          <div className="emoji-float text-8xl mb-8">🏥</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Medical Report Templates
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Professional UI templates for healthcare documentation
          </p>
          <div className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg mb-8 font-semibold">
            ⚠️ DEMO ONLY — Sample Data — Not for Medical Use
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#templates" className="cta-pulse bg-cyan-500 text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cyan-400 transition-all inline-flex items-center">
              Preview Templates
              <ChevronRight className="ml-2 w-5 h-5" />
            </a>
            <button className="glass-card px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      

      {/* Templates Section */}
      <section id="templates" ref={templatesRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Sample Templates</h2>
          <p className="text-center text-gray-300 mb-12 text-lg">All templates contain fictitious data for demonstration purposes</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {templates.map((template, idx) => (
              <div key={template.id} className="template-card glass-card p-8 rounded-3xl hover:shadow-2xl hover:scale-105 transition-all relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                  SAMPLE
                </div>
                <FileText className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">{template.name}</h3>
                <p className="text-gray-300 mb-6">{template.description}</p>
                <button
                  onClick={() => openModal(template)}
                  className="w-full bg-cyan-500 text-slate-900 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-all inline-flex items-center justify-center"
                  aria-label={`Preview ${template.name}`}
                >
                  <Eye className="mr-2 w-5 h-5" />
                  Preview Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How to Use This Demo</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: "1. Browse Templates", desc: "Explore sample medical report formats with fictitious data" },
              { icon: FileText, title: "2. Preview Designs", desc: "View full template layouts in modal previews" },
              { icon: Shield, title: "3. Demo Only", desc: "Never use for real medical records — UI demonstration only" }
            ].map((step, idx) => (
              <div key={idx} className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform">
                <step.icon className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section id="accessibility" className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Accessibility & Compliance</h2>
          <p className="text-lg text-gray-300 mb-4">
            This demo follows WCAG AA standards for accessibility. All templates are keyboard navigable with proper ARIA labels.
          </p>
          <p className="text-red-400 font-semibold text-lg">
            ⚠️ Important: This is a UI demonstration only. Never use these templates for actual medical documentation without proper legal review, HIPAA compliance, and healthcare professional oversight.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black/40 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">About</h4>
              <p className="text-gray-400 text-sm">UI template demonstration for medical report formats. Not for production use.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400">Terms of Use</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">FAQ</a></li>
                <li><a href="#" className="hover:text-cyan-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-cyan-400">Report Issue</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="GitHub">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors" aria-label="LinkedIn">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 MedTemplate Demo. All rights reserved. This is a demonstration project only.</p>
            <p className="mt-2 text-red-400 font-semibold">NOT FOR MEDICAL USE — UI DEMONSTRATION ONLY</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && selectedTemplate && (
        <div 
          className="modal-backdrop fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="modal-content glass-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 rounded-full p-2 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 md:p-12 relative">
              {/* Watermark */}
              <div className="watermark">SAMPLE ONLY</div>

              {/* Disclaimer */}
              <div className="bg-red-600 text-white p-4 rounded-xl mb-6 font-bold text-center relative z-10">
                ⚠️ DEMONSTRATION ONLY — NOT A REAL MEDICAL DOCUMENT — SAMPLE DATA
              </div>

              <h2 id="modal-title" className="text-3xl font-bold mb-6 relative z-10">{selectedTemplate.name}</h2>

              {/* Template Content */}
              <div className="bg-white/10 rounded-2xl p-6 space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Patient Name</p>
                    <p className="font-semibold">{selectedTemplate.preview.patientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Patient ID</p>
                    <p className="font-semibold">{selectedTemplate.preview.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="font-semibold">{selectedTemplate.preview.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Healthcare Provider</p>
                    <p className="font-semibold">{selectedTemplate.preview.doctor}</p>
                  </div>
                </div>

                {/* Vitals (if available) */}
                {selectedTemplate.preview.vitals && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-3">Vital Signs (Sample)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(selectedTemplate.preview.vitals).map(([key, value]) => (
                        <div key={key} className="bg-white/5 p-3 rounded-xl">
                          <p className="text-gray-400 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Tests (if available) */}
                {selectedTemplate.preview.tests && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-3">Laboratory Results (Sample)</h3>
                    <div className="space-y-2">
                      {selectedTemplate.preview.tests.map((test, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{test.name}</p>
                            <p className="text-sm text-gray-400">Range: {test.range}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{test.value}</p>
                            <p className="text-sm text-green-400">{test.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medications (if available) */}
                {selectedTemplate.preview.medications && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-3">Prescriptions (Sample)</h3>
                    <div className="space-y-2">
                      {selectedTemplate.preview.medications.map((med, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-xl">
                          <p className="font-semibold text-lg">{med.name}</p>
                          <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                            <div>
                              <p className="text-gray-400">Dosage</p>
                              <p>{med.dosage}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Frequency</p>
                              <p>{med.frequency}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Duration</p>
                              <p>{med.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl">
                  <h4 className="font-bold mb-2">Clinical Notes</h4>
                  <p className="text-sm text-gray-300">{selectedTemplate.preview.notes}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 relative z-10">
                <button className="flex-1 bg-cyan-500 text-slate-900 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-all inline-flex items-center justify-center">
                  <Download className="mr-2 w-5 h-5" />
                  Download Sample (Demo)
                </button>
                <button 
                  onClick={closeModal}
                  className="flex-1 glass-card py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meta tags for machine readability */}
      <div style={{ display: 'none' }}>
        <meta name="description" content="Medical Report Template Demo - UI demonstration only, not for medical use" />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Medical Report Template Demo - Sample Data Only" />
      </div>
    </div>
  );
};

export default MedicalReportDemo;