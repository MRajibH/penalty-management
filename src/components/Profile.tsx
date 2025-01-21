import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PiCaretUpDownBold } from "react-icons/pi";
import { Settings2, User } from "lucide-react";
import { FiLogOut } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/";
import { Link } from "react-router-dom";

interface ProfileProps {
  iconOnly?: boolean;
  className?: string;
}

const Profile = ({ className, iconOnly = false }: ProfileProps) => {
  const { SignOut } = useAuthContext();

  return (
    <div className={cn("", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <div className="p-1 rounded-md flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              {!iconOnly && (
                <>
                  <div className="w-full">
                    <h3 className="text-xs font-bold">Brotecs</h3>
                    <p className="text-xs text-gray-500">Admin | Devsecops</p>
                  </div>

                  <div>
                    <PiCaretUpDownBold className="w-4 h-4 text-gray-500" />
                  </div>
                </>
              )}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link to={"/app/profile"}>
              <DropdownMenuItem>
                <User />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link to={"/app/settings"}>
              <DropdownMenuItem>
                <Settings2 />
                Settings
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={SignOut}
            className="text-red-600 hover:text-red-600 hover:bg-red-50"
          >
            <FiLogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
