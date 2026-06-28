import { cn } from "@/lib/utils";

type PassStrengthProps = {
  passStrength: number;
};

export const PasswordStrength = ({ passStrength }: PassStrengthProps) => {
  return (
    <div
      className={cn("flex col-span-2 gap-2 justify-around p-1", {
        "justify-around": passStrength === 3,
        "justify-start": passStrength < 3,
      })}
    >
      {Array.from({ length: passStrength + 1 }).map((_, i) => (
        <div
          key={i}
          className={cn("h-1 w-1/4 rounded-md", {
            "bg-red-700 dark:bg-red-500": passStrength === 0,
            "bg-orange-700 dark:bg-orange-500": passStrength === 1,
            "bg-yellow-700 dark:bg-yellow-500": passStrength === 2,
            "bg-green-700 dark:bg-green-500": passStrength === 3,
          })}
        ></div>
      ))}
    </div>
  );
};
