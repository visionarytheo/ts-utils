import { BRAND } from "@/config/brand";

export default function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-slate-200/60 bg-white">
      <div className="max-w-md mx-auto text-center px-4">
        <p className="text-[10px] font-bold text-slate-400 tracking-wide">
          &copy; {new Date().getFullYear()} {BRAND.name.toUpperCase()}. All Rights Reserved.
        </p>
        <p className="text-[9px] font-medium text-slate-400/80 mt-1">
          Designed and Engineered by{" "}
          <span className="font-extrabold text-indigo-600 tracking-tight">
            {BRAND.studio}
          </span>
        </p>
      </div>
    </footer>
  );
}
