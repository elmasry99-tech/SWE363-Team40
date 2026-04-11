import "./globals.css";

export const metadata = {
  title: "CypherNet | Secure Communication Platform",
  description:
    "A React front-end for CypherNet covering secure messaging, tenant governance, compliance, and guest collaboration.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
