import {
  Calendar,
  AlertCircle,
  Briefcase,
  CheckCheck,
  OctagonAlert,
  CircleOff,
} from "lucide-react";
import { Penalty } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useAuthContext } from "@/context";
import { cn } from "@/lib/utils";

interface PenaltyCardProps {
  penalty: Penalty;
  onStatusChange: (id: string, status: Penalty["status"]) => void;
}

export const BDT = ({ className = "" }) => (
  <svg
    className={cn("", className)}
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    width="20px"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M18.09 10.5V9h-8.5V4.5A1.5 1.5 0 0 0 8.09 3a1.5 1.5 0 0 0-1.5 1.5A1.5 1.5 0 0 0 8.09 6v3h-3v1.5h3v6.2c0 2.36 1.91 4.27 4.25 4.3c2.34-.04 4.2-1.96 4.16-4.3c0-1.59-.75-3.09-2-4.08a4.08 4.08 0 0 0-.7-.47c-.22-.1-.46-.15-.7-.15c-.71 0-1.36.39-1.71 1c-.19.3-.29.65-.29 1c.01 1.1.9 2 2.01 2c.62 0 1.2-.31 1.58-.8c.21.47.31.98.31 1.5c.04 1.5-1.14 2.75-2.66 2.8c-1.53 0-2.76-1.27-2.75-2.8v-6.2h8.5Z"
    />
  </svg>
);

export function PenaltyCard({ penalty, onStatusChange }: PenaltyCardProps) {
  const { currentUser } = useAuthContext();

  const getStatusBgColor = (status: Penalty["status"]) => {
    switch (status) {
      case "PAID": {
        return "bg-emerald-100 text-emerald-800";
      }

      case "PENDING": {
        return "bg-amber-100 text-amber-800";
      }

      case "DISPUTED": {
        return "bg-red-100 text-red-800";
      }
    }
  };

  const getStatusIcon = (status: Penalty["status"]) => {
    switch (status) {
      case "PAID": {
        return <CheckCheck className="w-4 h-4" />;
      }

      case "PENDING": {
        return <OctagonAlert className="w-4 h-4" />;
      }

      case "DISPUTED": {
        return <CircleOff className="w-3.5 h-3.5" />;
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="grid gap-1">
              <CardTitle>{penalty.engineerName}</CardTitle>
              <CardDescription className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                <span>{penalty.department}</span>
              </CardDescription>
            </div>
            <div>
              <span
                className={cn(
                  "flex items-center gap-2 text-xs font-bold bg-slate-300 pl-2.5 pr-3.5 py-2 rounded-full",
                  getStatusBgColor(penalty.status)
                )}
              >
                {getStatusIcon(penalty.status)}
                {penalty.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 rounded-md border p-4">
            <div className="flex items-center text-gray-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>{penalty.reason}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <BDT />
              <span>{penalty.amount.toFixed(2)}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(penalty.date).toDateString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-4">
          {penalty.status === "PENDING" && currentUser && (
            <>
              <Button
                variant={"outline"}
                className="w-full"
                onClick={() => onStatusChange(penalty.id, "DISPUTED")}
              >
                Dispute
              </Button>
              <Button
                className="w-full"
                onClick={() => onStatusChange(penalty.id, "PAID")}
              >
                Mark as Paid
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
