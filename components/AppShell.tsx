"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { CustomCursor } from "@/components/CustomCursor";
import { LenisProvider } from "@/components/LenisProvider";
import LoadingScreen from "@/components/LoadingScreen";
import StripeScrollIndicator from "@/components/StripeScrollIndicator";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio") ?? false;

  useEffect(() => {
    const modeClass = isStudio ? "studio-mode" : "portfolio-mode";
    const otherModeClass = isStudio ? "portfolio-mode" : "studio-mode";

    document.documentElement.classList.add(modeClass);
    document.body.classList.add(modeClass);
    document.documentElement.classList.remove(otherModeClass);
    document.body.classList.remove(otherModeClass);

    return () => {
      document.documentElement.classList.remove(modeClass);
      document.body.classList.remove(modeClass);
    };
  }, [isStudio]);

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <LenisProvider>
        <StripeScrollIndicator />
        {children}
      </LenisProvider>
    </>
  );
}
