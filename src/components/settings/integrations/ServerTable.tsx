import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ServerConfig } from "./types";

interface ServerTableProps {
  data: ServerConfig[];
  onEdit: (server: ServerConfig) => void;
  onDelete: (server: ServerConfig) => void;
  variant: "directory" | "config";
}

export function ServerTable({
  data,
  onEdit,
  onDelete,
  variant,
}: ServerTableProps) {
  const getStatusColor = (server: ServerConfig) => {
    if (server.status === "unavailable") return "bg-red-500";
    if (server.status === "disabled") return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Используется";
      case "disabled":
        return "Отключен администратором";
      case "unavailable":
        return "Не используется";
      default:
        return status;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Статус</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Адрес</TableHead>
            <TableHead>Порт</TableHead>
            {variant === "directory" && <TableHead>Base DN</TableHead>}
            <TableHead>Статус сервера</TableHead>
            <TableHead className="w-[100px] text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={variant === "directory" ? 8 : 7}
                className="h-24 text-center"
              >
                Нет данных
              </TableCell>
            </TableRow>
          ) : (
            data.map((server) => (
              <TableRow key={server.id}>
                <TableCell>
                  <div
                    className={`h-3 w-3 rounded-full ${getStatusColor(server)}`}
                    title={getStatusText(server.status)}
                  />
                </TableCell>
                <TableCell className="font-medium">{server.name}</TableCell>
                <TableCell>{server.type}</TableCell>
                <TableCell>{server.address}</TableCell>
                <TableCell>{server.port || "-"}</TableCell>
                {variant === "directory" && (
                  <TableCell>{server.baseDN || "-"}</TableCell>
                )}
                <TableCell>{getStatusText(server.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(server)}
                      title="Редактировать"
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(server)}
                      title="Удалить"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
