"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Users, TrendingUp } from "lucide-react";

import { MissionsTab } from "./missions-tab";
import { RankingTab } from "./ranking-tab";
import { ProfileTab } from "./profile-tab";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tab, setTab] = useState("dashboard");

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => {
        setActiveTab(val);
        setTab(val);
      }}
      className="space-y-6 p-4"
    >
      <TabsList className="grid w-full grid-cols-4 gap-2 rounded-lg bg-gray-100">
        <TabsTrigger
          value="dashboard"
          className={tab === "dashboard" ? "bg-white shadow rounded-md" : ""}
        >
          <TrendingUp className="h-4 w-4" />
          <span> Dashboard</span>
        </TabsTrigger>

        <TabsTrigger
          value="missions"
          className={tab === "missions" ? "bg-white shadow rounded-md" : ""}
        >
          <Target className="h-4 w-4" />
          <span> Missões</span>
        </TabsTrigger>

        <TabsTrigger
          value="ranking"
          className={tab === "ranking" ? "bg-white shadow rounded-md" : ""}
        >
          <Trophy className="h-4 w-4" />
          <span> Ranking</span>
        </TabsTrigger>

        <TabsTrigger
          value="profile"
          className={tab === "profile" ? "bg-white shadow rounded-md" : ""}
        >
          <Users className="h-4 w-4" />
          <span> Perfil</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="missions">
        <MissionsTab />
      </TabsContent>

      <TabsContent value="ranking">
        <RankingTab />
      </TabsContent>

      <TabsContent value="profile">
        <ProfileTab />
      </TabsContent>
    </Tabs>
  );
}
