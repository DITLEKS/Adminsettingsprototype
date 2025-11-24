import React from "react";
import { useForm } from "react-hook-form@7.55.0";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner@2.0.3";

const securitySchema = z.object({
  sessionLifetime: z.coerce
    .number()
    .min(1, "Минимум 1 час")
    .max(24, "Максимум 24 часа"),
  maxSessions: z.coerce
    .number()
    .min(1, "Минимум 1 сессия")
    .max(10, "Максимум 10 сессий"),
  inactivityTimeout: z.coerce
    .number()
    .min(10, "Минимум 10 минут")
    .max(1440, "Максимум 1440 минут"),
});

export function SecurityTab() {
  const form = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      sessionLifetime: 12,
      maxSessions: 5,
      inactivityTimeout: 30,
    },
  });

  const onSubmit = (values: z.infer<typeof securitySchema>) => {
    toast.success("Настройки безо��асности обновлены");
    console.log(values);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Настройки безопасности</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
              <fieldset className="space-y-6 border p-4 rounded-lg">
                <legend className="text-sm font-medium px-2 text-gray-700">Пользователи</legend>
                
                <FormField
                  control={form.control}
                  name="sessionLifetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Срок жизни сессии (ч)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={24} {...field} />
                      </FormControl>
                      <FormDescription>От 1 до 24 часов</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxSessions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Кол-во одновременно открытых сессий</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={10} {...field} />
                      </FormControl>
                      <FormDescription>От 1 до 10 сессий</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inactivityTimeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тайм-аут неактивности (мин.)</FormLabel>
                      <FormControl>
                        <Input type="number" min={10} max={1440} {...field} />
                      </FormControl>
                      <FormDescription>От 10 до 1440 минут</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>

              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Сохранить настройки
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
