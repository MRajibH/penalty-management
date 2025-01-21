import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDataContext } from "@/context";
import { employeeRef } from "@/db/firebase.db";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, doc, updateDoc } from "firebase/firestore";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EmployeeFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be greater then 3 characters." })
    .max(30, { message: "Name can not be longer than 30 characters." }),
  email: z.string().email("Must be a valid email address."),
  phone: z.string(),
  designation_id: z.string(),
});

type EmployeeFormSchemaType = z.infer<typeof EmployeeFormSchema>;

interface EmployeeFormProps {
  onClose: any;
  componentFor?: "update" | "create";
  defaultValue?: EmployeeFormSchemaType & { id: string };
}

const EmployeeForm = ({
  onClose,
  defaultValue,
  componentFor = "create",
}: EmployeeFormProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { designations, designationMapped } = useDataContext();

  const form = useForm<EmployeeFormSchemaType>({
    mode: "onChange",
    defaultValues: defaultValue || {},
    resolver: zodResolver(EmployeeFormSchema),
  });

  const onSubmit = async (data: EmployeeFormSchemaType) => {
    try {
      setLoading(true);
      const new_data = {
        createdAt: new Date().getTime(),
        modifiedAt: new Date().getTime(),
        ...data,
      };
      // for creating
      if (componentFor === "create") {
        await addDoc(employeeRef, new_data);
      }

      // for updating
      else if (componentFor === "update" && defaultValue?.id) {
        const { id } = defaultValue;
        const { createdAt, ...updated_data } = new_data;
        await updateDoc(doc(employeeRef, id), updated_data);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    ? designationMapped[field.value]
                                        ?.designation_name
                                    : placeholder}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[335px] lg:w-[450px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder={placeholder}
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    No designation found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {designations.map(
                                      ({ id, designation_name }) => (
                                        <CommandItem
                                          key={id}
                                          value={designation_name}
                                          onSelect={() => {
                                            form.setValue("designation_id", id);
                                            setOpen(false);
                                          }}
                                        >
                                          {designation_name}
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
                            {designations.length === 0
                              ? "NB : If there is no designation created, you need to create a designation first."
                              : description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );

                // ***
                // File fields
                // case "file":
                //   return (
                //     <FormField
                //       control={form.control}
                //       name={name}
                //       render={({ field }) => (
                //         <FormItem>
                //           <FormLabel>{label}</FormLabel>
                //           <FormControl>
                //             <Input
                //               type="file"
                //               placeholder="Your full name here ..."
                //               {...field}
                //             />
                //           </FormControl>
                //           <FormDescription>{description}</FormDescription>
                //           <FormMessage />
                //         </FormItem>
                //       )}
                //     />
                //   );
              }
            }
          )}
        </div>

        <DialogFooter className="gap-2 py-8">
          <Button type="reset" variant={"outline"} onClick={onClose}>
            Close
          </Button>
          <Button loading={loading} variant={"default"} type="submit">
            {componentFor === "update" ? "Update" : "Create"} Employee
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
  inputType: "text" | "select" | "file";
  name: "name" | "email" | "phone" | "designation_id";
};

const fields: fieldType[] = [
  {
    name: "name",
    inputType: "text",
    label: "Full Name",
    placeholder: "Name",
    description: "Enter the employee's full name, e.g., 'John Doe'.",
  },
  {
    name: "email",
    label: "Email",
    inputType: "text",
    placeholder: "john.doe@example.com",
    description:
      "Enter the employee's official email address, e.g., 'john.doe@example.com'.",
  },
  {
    name: "phone",
    label: "Phone",
    inputType: "text",
    placeholder: "Phone number",
    description: "Enter the employee's phone number, e.g., '01756160530'.",
  },
  {
    name: "designation_id",
    label: "Designation",
    placeholder: "Select a Designation",
    description:
      "Select the designation this employee belongs to, e.g., 'Software Engineer'.",
    inputType: "select",
  },
];

export default EmployeeForm;
