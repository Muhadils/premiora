import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  textClassName?: string;
}

export function Logo({ className, textClassName = "text-white" }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      <Image 
        src="/prora.png" 
        alt="Premiora Logo" 
        width={40} 
        height={40} 
        className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
        priority
        unoptimized
      />
      <span className={cn("text-xl font-bold tracking-tight", textClassName)}>
        Premi<span className="text-gradient-logo">ora</span>
      </span>
    </Link>
  );
}
