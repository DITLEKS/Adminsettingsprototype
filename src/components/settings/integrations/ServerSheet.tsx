import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form@7.55.0";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../../ui/sheet";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import { ServerConfig } from "./types";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface ServerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ServerConfig, "id" | "status">) => void;
  initialData?: ServerConfig | null;
  variant: "directory" | "config";
}

const formSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  type: z.string().min(1, "Тип обязателен"),
  address: z.string().min(1, "Адрес обязателен"),
  port: z.string().optional(),
  baseDN: z.string().optional(),
  isMain: z.boolean().default(false),
  stopTracking: z.boolean().default(false),
  syncFrequency: z.string(),
  availabilityCheckValue: z.coerce.number().min(1),
  availabilityCheckUnit: z.enum(["min", "h"]),
});

export function ServerSheet({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  variant,
}: ServerSheetProps) {
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "AD",
      address: "",
      port: "",
      baseDN: "",
      isMain: false,
      stopTracking: false,
      syncFrequency: "1 ч",
      availabilityCheckValue: 15,
      availabilityCheckUnit: "min",
    },
  });

  // Reset form when opening/closing or changing data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          type: initialData.type,
          address: initialData.address,
          port: initialData.port || "",
          baseDN: initialData.baseDN || "",
          isMain: initialData.isMain,
          stopTracking: initialData.stopTracking,
          syncFrequency: initialData.syncFrequency,
          availabilityCheckValue: initialData.availabilityCheckValue,
          availabilityCheckUnit: initialData.availabilityCheckUnit as "min" | "h",
        });
      } else {
        form.reset({
          name: "",
          type: "AD",
          address: "",
          port: "",
          baseDN: "",
          isMain: false,
          stopTracking: false,
          syncFrequency: "1 ч",
          availabilityCheckValue: 15,
          availabilityCheckUnit: "min",
        });
      }
      setConnectionStatus("idle");
    }
  }, [isOpen, initialData, form]);

  // Watch fields for mutual exclusivity logic
  const isMain = form.watch("isMain");
  const stopTracking = form.watch("stopTracking");

  // Watch fields for "Check Connection" enablement
  const name = form.watch("name");
  const type = form.watch("type");
  const address = form.watch("address");
  const port = form.watch("port");

  const handleCheckConnection = async () => {
    setConnectionStatus("loading");
    
    // Basic validation for check
    const isValid = !!name && !!type && !!address && !!port;

    setTimeout(() => {
      if (isValid) {
        setConnectionStatus("success");
      } else {
        setConnectionStatus("error");
      }
    }, 2000); // 2 second delay
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    // onClose handled by parent or logic
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[540px] w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {initialData ? "Редактирование сервера" : "Добавление сервера"}
          </SheetTitle>
          <SheetDescription>
            {variant === "directory"
              ? "Служба каталогов"
              : "Система управления конфигурациями"}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Название сервера" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип <span className="text-red-500">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AD">AD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-4 gap-4">
                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Адрес (IPv4 или FQDN) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="192.168.1.1" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Порт <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="389" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {variant === "directory" && (
                <FormField
                  control={form.control}
                  name="baseDN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base DN</FormLabel>
                      <FormControl>
                        <Input placeholder="dc=example,dc=com" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50">
                <FormField
                  control={form.control}
                  name="isMain"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue("stopTracking", false);
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Основной сервер</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stopTracking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          disabled={isMain}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className={isMain ? "text-gray-400" : ""}>
                          Перестать отслеживать
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleCheckConnection}
                  disabled={connectionStatus === "loading"}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  {connectionStatus === "loading" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Проверить соединение
                </Button>
                
                {connectionStatus === "success" && (
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Соединение успешно установлено
                  </div>
                )}
                {connectionStatus === "error" && (
                  <div className="flex items-center text-red-600 text-sm font-medium">
                    <XCircle className="mr-2 h-4 w-4" />
                    Не удалось установить соединение с сервером
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-sm text-gray-900">Расписание</h4>
                <FormField
                  control={form.control}
                  name="syncFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Частота синхронизации</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите частоту" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15 мин">15 мин</SelectItem>
                          <SelectItem value="30 мин">30 мин</SelectItem>
                          <SelectItem value="45 мин">45 мин</SelectItem>
                          <SelectItem value="1 ч">1 ч</SelectItem>
                          <SelectItem value="5 ч">5 ч</SelectItem>
                          <SelectItem value="10 ч">10 ч</SelectItem>
                          <SelectItem value="15 ч">15 ч</SelectItem>
                          <SelectItem value="24 ч">24 ч</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="availabilityCheckValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Проверка доступности каждые</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="availabilityCheckUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Размерность</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="min">мин</SelectItem>
                            <SelectItem value="h">ч</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <SheetFooter className="pt-6 flex-row gap-2 sm:justify-end">
                 <Button type="button" variant="outline" onClick={onClose}>
                  Отмена
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {initialData ? "Сохранить" : "Создать"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
