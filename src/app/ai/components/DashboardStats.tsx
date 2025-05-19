"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Gauge,
  Clock3,
  Database,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type StatsData = {
  total_sessions: number;
  avg_duration: number;
  accuracy: number;
  storage_used: number;
  processing_time: number;
  growth_rate: number;
};

type SessionItem = {
  session: string;
  date: string;
  status: string;
  duration: string;
  clarity: number | null;
  fluency: number | null;
  correctness: number | null;
  link: string;
};

export default function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentSessions, setRecentSessions] = useState<SessionItem[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/metrics`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Stats not found");

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.warn("Failed to fetch stats", err);
      }
    };

    const fetchRecentSessions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/recent-sessions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Session fetch failed");

        const data = await res.json();
        setRecentSessions(data);
      } catch (err) {
        console.warn("Failed to fetch sessions", err);
      }
    };

    fetchStats();
    fetchRecentSessions();
  }, []);

  if (!stats) return null;

  return (
    <>
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Gauge className="h-5 w-5 text-green-600" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total_sessions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Clock3 className="h-5 w-5 text-blue-600" />
              Avg. Speech Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.avg_duration} min</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Activity className="h-5 w-5 text-orange-600" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.accuracy}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Database className="h-5 w-5 text-purple-600" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.storage_used} MB</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Sessions</CardTitle>
          <Button variant="outline" size="sm">
            View all
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Clarity/10</th>
                <th className="px-4 py-2">Fluency/10</th>
                <th className="px-4 py-2">Correctness/10</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((session, index) => (
                <tr key={index} className="border-b hover:bg-muted/40">
                  <td className="px-4 py-2">{session.session}</td>
                  <td className="px-4 py-2">{session.date}</td>
                  <td className="px-4 py-2">
                    <Badge variant="success">{session.status}</Badge>
                  </td>
                  <td className="px-4 py-2">{session.duration}</td>
                  <td className="px-4 py-2">
                    {session.clarity !== null ? session.clarity : "--"}
                  </td>
                  <td className="px-4 py-2">
                    {session.fluency !== null ? session.fluency : "--"}
                  </td>
                  <td className="px-4 py-2">
                    {session.correctness !== null ? session.correctness : "--"}
                  </td>
                  <td className="px-4 py-2">
                    <a href={session.link} className="text-blue-500 underline text-sm">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
