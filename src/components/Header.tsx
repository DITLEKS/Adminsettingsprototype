import React, { useState } from "react";
import { cn } from "./ui/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Settings, Users, BarChart3, LayoutGrid, Package, ChevronDown } from "lucide-react";

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const components: { title: string; id: string; description: string }[] = [
  {
    title: "Общее",
    id: "general",
    description: "Версия системы, контакты и общая информация",
  },
  {
    title: "Интеграции",
    id: "integrations",
    description: "Управление службами каталогов и системами конфигурации",
  },
  {
    title: "Безопасность",
    id: "security",
    description: "Настройки сессий и доступов",
  },
];

export function Header({ activeSection, onNavigate }: HeaderProps) {
  // We use a simple state for mobile or explicit interaction if needed, 
  // but primarily rely on CSS group-hover for the requested behavior.
  // However, to match the "on hover" request robustly, we can use state to allow for better control if needed.
  // For this "simplified" version to fix errors, we will use standard React state for the dropdown visibility on hover.
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="border-b bg-white relative z-50">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-default">
            <div className="h-8 w-8 bg-green-600 rounded-md flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none">App Manager</h1>
              <p className="text-xs text-muted-foreground">Панель администратора</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <NavButton icon={<LayoutGrid className="mr-2 h-4 w-4" />}>
              Все приложения
            </NavButton>
            <NavButton icon={<Users className="mr-2 h-4 w-4" />}>
              Пользователи
            </NavButton>
            <NavButton icon={<BarChart3 className="mr-2 h-4 w-4" />}>
              Статистика
            </NavButton>
            
            {/* Settings Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsSettingsOpen(true)}
              onMouseLeave={() => setIsSettingsOpen(false)}
            >
              <button 
                className={cn(
                  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  (activeSection !== "" || isSettingsOpen) && "bg-accent text-accent-foreground"
                )}
                onClick={() => onNavigate("general")} // Default to general if clicked directly
              >
                <Settings className="mr-2 h-4 w-4" />
                Настройки
                <ChevronDown className={cn("ml-1 h-3 w-3 transition-transform duration-200", isSettingsOpen ? "rotate-180" : "")} />
              </button>

              {/* Dropdown Menu */}
              {isSettingsOpen && (
                <div 
                  className="absolute top-full left-0 min-w-[200px] p-2 bg-white border rounded-md shadow-lg mt-1 animate-in fade-in-0 zoom-in-95 duration-200 origin-top-left"
                >
                  <ul className="grid gap-1">
                    {components.map((component) => (
                      <li key={component.title}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(component.id);
                            setIsSettingsOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left outline-none focus:bg-accent",
                            activeSection === component.id && "bg-accent/50"
                          )}
                        >
                          {component.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">Администратор</div>
            <div className="text-xs text-muted-foreground">
              admin@example.com
            </div>
          </div>
          <Avatar className="h-10 w-10 bg-green-600">
            <AvatarImage src="" />
            <AvatarFallback className="bg-green-600 text-white">A</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

function NavButton({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
      {icon}
      {children}
    </button>
  );
}
