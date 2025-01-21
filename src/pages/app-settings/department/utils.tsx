import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import DepartmentForm from "./DepartmentForm";
import useBoolean, { UseBooleanType } from "@/hooks/use-boolean";
import { Separator } from "@/components/ui/separator";
import { DataTableRowActions } from "@/components/data-table/DataTableRowActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { departmentRef } from "@/db/firebase.db";

export const CreateDepartment = () => {
  const { open, setOpen, onClose } = useBoolean();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"}>
          Add Department
          <Plus />
        </Button>
      </SheetTrigger>

      <SheetContent className="lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Add Department</SheetTitle>
          <SheetDescription>Create a new department.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <DepartmentForm onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] ml-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] ml-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "department_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department Name" />
    ),
    cell: ({ row }) => (
      <div className="w-full">{row.getValue("department_name")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        align="center"
        column={column}
        title="Created At"
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt")).toDateString();
      return <div className="w-full text-center">{date}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "modifiedAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        align="center"
        column={column}
        title="Modified At"
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("modifiedAt")).toDateString();
      return <div className="w-full text-center">{date}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader align="center" column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const EditBoolean = useBoolean();
      const DeleteBoolean = useBoolean();

      return (
        <div className="flex justify-center">
          <DataTableRowActions
            onClickEdit={EditBoolean.onOpen}
            onClickDelete={DeleteBoolean.onOpen}
          />
          <EditDepartment data={row.original} {...EditBoolean} />
          <DeleteDepartment data={row.original} {...DeleteBoolean} />
        </div>
      );
    },
  },
];

interface EditDepartmentProps extends UseBooleanType {
  data: departmentType;
}

const EditDepartment = ({ data, ...boolean }: EditDepartmentProps) => {
  const { open, setOpen, onClose } = boolean;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="lg:min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
          <SheetDescription>Update the Department data.</SheetDescription>
        </SheetHeader>
        <Separator className="mt-6" />
        <DepartmentForm
          defaultValue={data}
          componentFor={"update"}
          onClose={onClose}
        />
      </SheetContent>
    </Sheet>
  );
};

interface DeleteDepartmentProps extends UseBooleanType {
  data: departmentType;
}

const DeleteDepartment = ({ data, ...boolean }: DeleteDepartmentProps) => {
  const { toast } = useToast();
  const { open, setOpen, onClose } = boolean;
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const { id } = data;
    try {
      setLoading(true);
      await deleteDoc(doc(departmentRef, id));
      onClose();
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(err?.message || err, null, 2)}
            </code>
          </pre>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] pb-4">
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription className="py-2">
            Are you sure you want to delete this Department?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant={"ghost"} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={"ghost"}
            loading={loading}
            onClick={handleClick}
            className="text-red-600 hover:text-red-600 hover:bg-red-50"
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
