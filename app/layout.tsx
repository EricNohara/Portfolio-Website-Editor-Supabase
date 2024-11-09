import "./globals.css";
import Navigation from "./navigation";

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
        <Navigation />
        <div className="container" style={{ padding: "50px 0 500px 0" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
