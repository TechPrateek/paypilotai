import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - PayPilot AI",
  description: "Login or register for PayPilot AI",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      {children}
    </div>
  );
}
