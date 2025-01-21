import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { designationRef } from "@/db/firebase.db";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { useDataContext } from "@/context";

const DesignationSchema = z.object({
  department_id: z.string(),
  designation_name: z.string(),
});

type DesignationSchemaType = z.infer<typeof DesignationSchema>;

interface DesignationFormProps {
  onClose: any;
  componentFor?: "update" | "create";
  defaultValue?: DesignationSchemaType & { id: string };
}

const DesignationForm = ({
  onClose,
  defaultValue,
  componentFor = "create",
}: DesignationFormProps) => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { departments } = useDataContext();

  const form = useForm<DesignationSchemaType>({
    mode: "onChange",
    defaultValues: defaultValue || {},
    resolver: zodResolver(DesignationSchema),
  });

  const onSubmit = async (data: DesignationSchemaType) => {
    try {
      setLoading(true);

      const new_data = {
        createdAt: new Date().getTime(),
        modifiedAt: new Date().getTime(),
        ...data,
      };

      // for creating
      if (componentFor === "create") {
        await addDoc(designationRef, new_data);
      }

      // for updating
      else if (componentFor === "update" && defaultValue?.id) {
        const { id } = defaultValue;
        const { createdAt, ...updated_data } = new_data;
        await updateDoc(doc(designationRef, id), updated_data);
      }

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="py-4 space-y-6">
          {fields.map(
            ({ name, label, description, inputType, placeholder }) => {
              switch (inputType) {
                // ***
                // Input fields
                case "text":
                  return (
                    <FormField
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Input placeholder={placeholder} {...field} />
                          </FormControl>
                          <FormDescription>{description}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );

                // ***
                // Select fields
                case "select":
                  return (
                    <FormField
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? departments.find(
                                        (department) =>
                                          department.id === field.value
                                      )?.department_name
                                    : "Select department"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[335px] lg:w-[450px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search department..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    No department found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {departments.map(
                                      ({ id, department_name }) => (
                                        <CommandItem
                                          key={id}
                                          value={department_name}
                                          onSelect={() => {
                                            form.setValue("department_id", id);
                                            setOpen(false);
                                          }}
                                        >
                                          {department_name}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      )
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            {departments.length === 0
                              ? "NB : If there is no department created, you need to create a department first."
                              : description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
              }
            }
          )}
        </div>

        <DialogFooter className="gap-2 py-8">
          <Button type="reset" variant={"outline"} onClick={onClose}>
            Close
          </Button>
          <Button loading={loading} variant={"default"} type="submit">
            {componentFor === "update" ? "Update" : "Create"} Designation
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

type fieldType = {
  label: string;
  description: string;
  placeholder: string;
  inputType: "text" | "select";
  name: "department_id" | "designation_name";
};

const fields: fieldType[] = [
  {
    name: "designation_name",
    label: "Designation Name",
    description:
      "Enter the name of the new designation, e.g., 'Software Engineer'.",
    inputType: "text",
    placeholder: "Enter a designation name ...",
  },
  {
    name: "department_id",
    label: "Department Name",
    description:
      "Select the department this designation belongs to, e.g., 'DevSecOps'.",
    inputType: "select",
    placeholder: "Select a department name ...",
  },
];

export default DesignationForm;
