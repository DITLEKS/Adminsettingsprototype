import React, { useState } from "react";
import { Header } from "./components/Header";
import { GeneralTab } from "./components/settings/GeneralTab";
import { IntegrationsTab } from "./components/settings/IntegrationsTab";
import { SecurityTab } from "./components/settings/SecurityTab";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [activeSection, setActiveSection] = useState("general");

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return <GeneralTab />;
      case "integrations":
        return <IntegrationsTab />;
      case "security":
        return <SecurityTab />;
      default:
        return <GeneralTab />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "general":
        return "Общее";
      case "integrations":
        return "Интеграции";
      case "security":
        return "Безопасность";
      default:
        return "Настройки";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      <Header activeSection={activeSection} onNavigate={setActiveSection} />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Настройки</h2>
          <p className="text-muted-foreground">
            Управление конфигурацией системы &mdash; {getSectionTitle()}
          </p>
        </div>

        {renderContent()}
      </main>
      
      <Toaster />
    </div>
  );
}
