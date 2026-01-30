import '@/app/globals.css';

export default function PointHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
