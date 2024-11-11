import "./globals.css";
import Navigation from "./navigation";
import { AuthProvider } from "./context/AuthProvider";

export const metadata = {
  title: "Portfolio Website Editor",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navigation />
          <div className="container" style={{ padding: "50px 0 500px 0" }}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
