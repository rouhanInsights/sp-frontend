"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo, getSessionById  } from "../../../utils/api"; // updated path
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendAudioToPipeline } from "../../../utils/api";
import SessionSidebar from "./components/SessionSidebar";
import UploadBlock from "./components/UploadBlock";
import ResultBlock from "./components/ResultBlock";
import Loader from "./components/Loader";
import {LogOut} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AIPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true); // control render

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserInfo();
        if (!data || data.detail) {
          localStorage.removeItem("access_token");
          router.push("/login");
        } else {
          setUser(data);
        }
      } catch (err) {
        localStorage.removeItem("access_token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
  
    fetchUser();
  }, [router]);
  

  if (loading) {
    return <div className="text-center p-10">{loading && <Loader />}</div>; // Prevent flicker
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  
    const file = e.target.files?.[0];
    if (file) setAudioFile(file);
  };

  const handleSessionClick = async (sessionId: number) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await getSessionById(sessionId);
      setResult(data);
    } catch (err) {
      setErrorMsg("❌ Failed to load session.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleProcess = async () => {
    if (!audioFile) {
      setErrorMsg("Please upload an audio file.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    setResult(null);

    try {
      const res = await sendAudioToPipeline(audioFile);
      setResult(res.data);
      console.log("✅ AI response:", res);
    } catch (err) {
      setErrorMsg("❌ Failed to process audio. Check your backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
          <SessionSidebar onSessionSelect={handleSessionClick}  onNewChat={() => {
    setResult(null);
    setErrorMsg("");
  }}/>
          <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Speech Fix</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button
                onClick={() => {
                  localStorage.removeItem("access_token");
                  router.push("/login");
                }}
                variant="outline"
                className="text-sm"
              ><LogOut />
                Logout
              </Button>
            </header>
            <div className="flex-1 flex flex-col">
            <main className="flex-1 overflow-auto p-6">
            <div className="max-w-5xl w-full mx-auto space-y-6">
              <UploadBlock
                loading={loading}
                onFileChange={handleFileChange}
                onProcess={handleProcess}
                errorMsg={errorMsg}
              />
                
                {result && (
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Transcription Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultBlock result={result} />
                    </CardContent>
                  </Card>
                )}
                </div>
              </main>
            </div>
          </SidebarInset>
        </SidebarProvider>
  );
}

