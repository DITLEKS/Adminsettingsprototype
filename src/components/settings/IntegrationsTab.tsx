import React, { useState } from "react";
import { ServerTable } from "./integrations/ServerTable";
import { ServerSheet } from "./integrations/ServerSheet";
import { ServerConfig } from "./integrations/types";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

// Mock Data
const initialDirectoryServices: ServerConfig[] = [
  {
    id: "1",
    name: "Corp AD Primary",
    type: "AD",
    address: "10.0.0.5",
    port: "389",
    baseDN: "dc=corp,dc=local",
    isMain: true,
    stopTracking: false,
    status: "active",
    syncFrequency: "1 ч",
    availabilityCheckValue: 15,
    availabilityCheckUnit: "min",
  },
  {
    id: "2",
    name: "Corp AD Backup",
    type: "AD",
    address: "10.0.0.6",
    port: "389",
    baseDN: "dc=corp,dc=local",
    isMain: false,
    stopTracking: false,
    status: "disabled",
    syncFrequency: "1 ч",
    availabilityCheckValue: 30,
    availabilityCheckUnit: "min",
  },
];

const initialConfigSystems: ServerConfig[] = [];

export function IntegrationsTab() {
  const [directoryServices, setDirectoryServices] = useState<ServerConfig[]>(
    initialDirectoryServices
  );
  const [configSystems, setConfigSystems] = useState<ServerConfig[]>(
    initialConfigSystems
  );

  const [sheetState, setSheetState] = useState<{
    isOpen: boolean;
    variant: "directory" | "config";
    editingId?: string; // if undefined, it's creating mode
  }>({ isOpen: false, variant: "directory" });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    server: ServerConfig | null;
    variant: "directory" | "config";
  }>({ isOpen: false, server: null, variant: "directory" });

  const handleAdd = (variant: "directory" | "config") => {
    setSheetState({ isOpen: true, variant, editingId: undefined });
  };

  const handleEdit = (server: ServerConfig, variant: "directory" | "config") => {
    setSheetState({ isOpen: true, variant, editingId: server.id });
  };

  const handleDeleteRequest = (
    server: ServerConfig,
    variant: "directory" | "config"
  ) => {
    if (server.isMain) {
      toast.error("Невозможно удалить основной сервер", {
        description:
          "Пожалуйста, назначьте другой сервер основным перед удалением этого.",
      });
      return;
    }
    setDeleteDialog({ isOpen: true, server, variant });
  };

  const confirmDelete = () => {
    const { server, variant } = deleteDialog;
    if (!server) return;

    if (variant === "directory") {
      setDirectoryServices((prev) => prev.filter((s) => s.id !== server.id));
    } else {
      setConfigSystems((prev) => prev.filter((s) => s.id !== server.id));
    }
    toast.success("Сервер успешно удален");
    setDeleteDialog({ isOpen: false, server: null, variant: "directory" });
  };

  const handleSheetSubmit = (data: Omit<ServerConfig, "id" | "status">) => {
    const { variant, editingId } = sheetState;
    const isEdit = !!editingId;

    const newServer: ServerConfig = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      status: "active", // Default to active for new, logic can be refined
      ...data,
    };

    // Logic to handle "Main" server exclusivity
    if (data.isMain) {
      if (variant === "directory") {
        setDirectoryServices((prev) =>
          prev.map((s) => ({ ...s, isMain: false }))
        );
      } else {
        setConfigSystems((prev) =>
          prev.map((s) => ({ ...s, isMain: false }))
        );
      }
    }

    if (variant === "directory") {
      setDirectoryServices((prev) => {
        if (isEdit) {
          return prev.map((s) => (s.id === editingId ? { ...s, ...data } : s));
        }
        return [...prev, newServer];
      });
    } else {
      setConfigSystems((prev) => {
        if (isEdit) {
          return prev.map((s) => (s.id === editingId ? { ...s, ...data } : s));
        }
        return [...prev, newServer];
      });
    }

    toast.success(
      isEdit ? "Запись обновлена" : "Запись успешно создана"
    );
    setSheetState({ ...sheetState, isOpen: false });
  };

  const getCurrentEditingData = () => {
    if (!sheetState.editingId) return null;
    const list =
      sheetState.variant === "directory" ? directoryServices : configSystems;
    return list.find((s) => s.id === sheetState.editingId) || null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Directory Services Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Службы каталогов</h3>
          <Button
            onClick={() => handleAdd("directory")}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить
          </Button>
        </div>
        <ServerTable
          data={directoryServices}
          variant="directory"
          onEdit={(s) => handleEdit(s, "directory")}
          onDelete={(s) => handleDeleteRequest(s, "directory")}
        />
      </div>

      {/* Config Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Системы управления конфигурациями
          </h3>
          <Button
            onClick={() => handleAdd("config")}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить
          </Button>
        </div>
        <ServerTable
          data={configSystems}
          variant="config"
          onEdit={(s) => handleEdit(s, "config")}
          onDelete={(s) => handleDeleteRequest(s, "config")}
        />
      </div>

      <ServerSheet
        isOpen={sheetState.isOpen}
        onClose={() => setSheetState({ ...sheetState, isOpen: false })}
        onSubmit={handleSheetSubmit}
        initialData={getCurrentEditingData()}
        variant={sheetState.variant}
      />

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) =>
          !open && setDeleteDialog((prev) => ({ ...prev, isOpen: false }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Сервер будет удален из списка.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
