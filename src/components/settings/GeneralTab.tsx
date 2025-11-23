import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";

export function GeneralTab() {
  return (
    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Информация о системе</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Текущая версия</Label>
              <div className="text-2xl font-bold">2.4.0</div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">
                Дата последнего обновления
              </Label>
              <div className="text-lg font-medium">23.11.2025</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Контакты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label className="text-muted-foreground">Техническая поддержка</Label>
            <div className="font-medium">support@appstore.local</div>
            <div className="font-medium">+7 (999) 000-00-00</div>
          </div>
          <Separator />
          <div className="grid gap-1">
            <Label className="text-muted-foreground">Администратор системы</Label>
            <div className="font-medium">admin@appstore.local</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
