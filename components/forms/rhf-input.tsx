import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { FieldValues, Control, FieldPath } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CheckCheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { countryPhoneCodes } from "@/utils/country-phone-codes";
import Image from "next/image";

interface Props<T extends FieldValues> {
  control: Control<T>;
  label: string;
  name: FieldPath<T>;
  placeholder: string;
  type:
    | "text"
    | "number"
    | "password"
    | "email"
    | "tel"
    | "file"
    | "date"
    | "time"
    | "textarea";
}

export const CustomInput = <T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  type,
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "textarea" ? (
              <Textarea
                placeholder={placeholder}
                {...field}
                className="focus-visible:ring-0 w-full border-0 border-b-2 rounded-none border-foreground dark:border-foreground"
              />
            ) : type === "tel" ? (
              <div className="flex gap-2 items-center">
                <Input
                  {...field}
                  placeholder={placeholder}
                  type="tel"
                  className="focus-visible:ring-0 w-full border-0 border-b-2 rounded-none border-blue-400 dark:border-blue-600"
                />
              </div>
            ) : (
              <Input
                placeholder={placeholder}
                {...field}
                type={type}
                className="focus-visible:ring-0 w-full border-0 border-b-2 rounded-none border-blue-400 dark:border-blue-600"
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface CountrySelectProps {
  control: Control<any>; //eslint-disable-line
  name: string;
  label: string;
}

export function CountrySelect({ control, name, label }: CountrySelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-label="Select country"
                  className="flex items-center justify-between bg-background-light dark:bg-background rounded-none border-0 border-b-2 border-blue-400 dark:border-blue-600"
                >
                  <span className="flex items-center">
                    {/* Find the selected country */}
                    {(() => {
                      const selectedCountry = countryPhoneCodes.find(
                        (item) => item.code === field.value,
                      );
                      return selectedCountry ? (
                        <Image
                          src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                          alt={selectedCountry.name}
                          width={20}
                          height={15}
                          className="w-6 h-4 mr-2"
                        />
                      ) : (
                        <Image
                          src={`https://flagcdn.com/w40/${countryPhoneCodes[0].code.toLowerCase()}.png`}
                          alt={countryPhoneCodes[0].name}
                          width={20}
                          height={15}
                          className="w-6 h-4 mr-2"
                        />
                      );
                    })()}
                  </span>
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandInput placeholder="Search Country..." />
                  <CommandList>
                    <CommandEmpty>Country not found.</CommandEmpty>
                    <CommandGroup>
                      {countryPhoneCodes.map((item) => (
                        <CommandItem
                          key={item.code}
                          value={item.name}
                          onSelect={() => {
                            field.onChange(item.code);
                            setOpen(false);
                          }}
                        >
                          <CheckCheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === item.code
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <Image
                            src={`https://flagcdn.com/w40/${item.code.toLowerCase()}.png`}
                            alt={item.name}
                            width={20}
                            height={15}
                            className="w-6 h-4 mr-2"
                          />
                          {item.name} ({item.code})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
