import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "비료비서 | AI 맞춤 비료 추천",
  description: "곤충 부산물 기반 AI 맞춤 비료 추천, 주문, 배송, 마이페이지 웹 앱"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
