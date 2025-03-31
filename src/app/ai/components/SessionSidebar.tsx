"use client";

import * as React from "react";
import {
  Command,
  LifeBuoy,
  Send,
  BookOpen,
  Plus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { getUserSessions } from "../../../../utils/api";

// Format date like: March 2025
function formatMonthYear(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

function SessionSidebar({
  onSessionSelect,
  onNewChat,
  ...props
}: {
  onSessionSelect?: (id: number) => void;
  onNewChat?: () => void;
} & React.ComponentProps<typeof Sidebar>) {
  const [navMainItems, setNavMainItems] = React.useState<
    {
      title: string;
      url: string;
      icon: any;
      isActive: boolean;
      items: { title: string; url: string; onClick?: () => void }[];
    }[]
  >([]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAndGroupSessions() {
      try {
        const sessions = await getUserSessions();

        // Group sessions by month-year
        const grouped: { [month: string]: any[] } = {};
        for (const session of sessions) {
          const month = formatMonthYear(session.created_at);
          if (!grouped[month]) grouped[month] = [];
          grouped[month].push(session);
        }

        // Flatten into one-level array with fake group headers
        const formattedItems: { title: string; url: string; onClick?: () => void }[] = [];

        Object.entries(grouped).forEach(([month, sessions]) => {
          // Push month heading
          formattedItems.push({ title: `📅 ${month}`, url: "#" });

          // Push all sessions under that month
          sessions.forEach((session) => {
            formattedItems.push({
              title: `Session #${session.id}`,
              url: "#",
              onClick: () => onSessionSelect?.(session.id),
            });
          });
        });

        // Inject into navMain format
        setNavMainItems([
          {
            title: "Saved files",
            url: "#",
            icon: BookOpen,
            isActive: true,
            items: formattedItems,
          },
        ]);
      } catch (err) {
        console.error("❌ Failed to load sessions", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAndGroupSessions();
  }, []);

  const sidebarData = {
    user: {
      name: "Speech fix",
      email: "m@example.com",
      avatar: "/images/img4.jpeg",
    },
    navMain: navMainItems,
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Speech fix</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              onClick={() => onNewChat?.()}
              className="mr-auto h-auto w-full justify-start shadow-md border"
            >
              <Plus className="mr-2 h-3 w-4 shadow-sm border" />
              New Chat
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {loading ? (
          <div className="text-sm text-muted-foreground p-4">Loading sessions...</div>
        ) : (
          <>
            <NavMain items={sidebarData.navMain} />
            <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default SessionSidebar;
