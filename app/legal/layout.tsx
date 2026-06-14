export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container" style={{ padding: "32px 16px", maxWidth: 800 }}>
      {children}
    </main>
  );
}
