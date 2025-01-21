import Profile from "@/components/Profile";
import SearchBox from "@/components/SearchBox";
import { Sidebar } from "@/components/Sidebar";
import { buttonVariants } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthContext } from "@/context";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const navCollapsedSize = 4;
const defaultLayout = [20, 32, 48];

const RootLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { currentUser } = useAuthContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (pathname === "/app" || pathname === "/app/") {
      navigate("/app/dashboard", { replace: true });
    }
  }, [pathname]);

  return (
    <div className="h-screen overflow-auto">
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
              sizes
            )}`;
          }}
          className="h-full items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={11}
            maxSize={14}
            onCollapse={() => {
              setIsCollapsed(true);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                true
              )}`;
            }}
            onResize={() => {
              setIsCollapsed(false);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                false
              )}`;
            }}
            className={cn(
              isCollapsed &&
                "min-w-[50px] transition-all duration-300 ease-in-out"
            )}
          >
            <Sidebar isCollapsed={isCollapsed} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
            <div className="h-[52px] flex items-center justify-between px-8 overflow-auto">
              <h2 className="font-bold text-lg">Dashboard</h2>

              <div className="flex items-center gap-2">
                <SearchBox />
                <Separator orientation="vertical" className="h-[32px]" />
                {currentUser ? (
                  <Profile iconOnly />
                ) : (
                  <Link
                    to={"/login"}
                    className={cn(
                      "ml-2",
                      buttonVariants({
                        size: "sm",
                        variant: "default",
                      })
                    )}
                  >
                    Login
                    <LogIn />
                  </Link>
                )}
              </div>
            </div>
            <Separator />

            <ScrollArea>
              <div className="h-[calc(100vh-60px)]">
                <Outlet />
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
};

export default RootLayout;
