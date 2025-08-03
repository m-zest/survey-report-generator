import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Eye, Save, Calculator } from 'lucide-react';
import { SurveyForm } from './components/SurveyForm';
import { PDFPreview } from './components/PDFPreview';
import { ReportHistory } from './components/ReportHistory';
import { Header } from './components/Header';
import { SurveyData } from './types/survey';

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'preview' | 'history'>('form');
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [savedReports, setSavedReports] = useState<SurveyData[]>([]);

  const handleFormSubmit = (data: SurveyData) => {
    setSurveyData(data);
    setCurrentView('preview');
  };

  const handleSaveReport = (data: SurveyData) => {
    const reportWithId = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSavedReports(prev => [reportWithId, ...prev]);
    setSurveyData(reportWithId);
  };

  const handleEditReport = (data: SurveyData) => {
    setSurveyData(data);
    setCurrentView('form');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'form':
        return (
          <SurveyForm 
            onSubmit={handleFormSubmit}
            initialData={surveyData}
            onSave={handleSaveReport}
          />
        );
      case 'preview':
        return surveyData ? (
          <PDFPreview 
            data={surveyData} 
            onBack={() => setCurrentView('form')}
          />
        ) : null;
      case 'history':
        return (
          <ReportHistory 
            reports={savedReports}
            onEdit={handleEditReport}
            onDelete={(id) => setSavedReports(prev => prev.filter(r => r.id !== id))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        hasData={!!surveyData}
      />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;