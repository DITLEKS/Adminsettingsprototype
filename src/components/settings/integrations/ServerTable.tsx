import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
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
        return "Недоступен";
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
            <TableHead className="w-[50px]"></TableHead>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(server)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(server)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
