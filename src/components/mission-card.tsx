"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle } from "lucide-react";

interface Mission {
  id: number;
  title: string;
  description: string;
  points: number;
  status: string;
}

interface MissionCardProps {
  mission: Mission;
  onComplete: () => void;
}

export function MissionCard({ mission, onComplete }: MissionCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-lg ${
        mission.status === "COMPLETED"
          ? "bg-green-50 border-green-200"
          : "bg-white"
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{mission.title}</CardTitle>
          {mission.status === "COMPLETED" && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>
        <CardDescription>{mission.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1 text-sm font-medium">
            <Star className="h-4 w-4 text-yellow-600" />
            <span>{mission.points} pts</span>
          </div>
        </div>

        {mission.status === "ACTIVE" && (
          <div className="flex space-x-2">
            <Button size="sm" className="bg-green-500" onClick={onComplete}>
              Completar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
