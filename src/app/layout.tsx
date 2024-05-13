import { ReactNode } from "react";
import { Noto_Sans_KR } from "next/font/google";
import "@/styles/globals.css";
import { Metadata } from "next";
import MarketLayout from "@/components/layout/MarketLayout";
import localFont from "next/font/local";
import classNames from "classnames";
type Props = {
  children: ReactNode;
};

const notoSansKr = Noto_Sans_KR({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

const materialSymbols = localFont({
  src: "../../node_modules/material-symbols/material-symbols-outlined.woff2",
  style: "normal",
  weight: "100 700",
  adjustFontFallback: false,
  display: "block",
  variable: "--material-symbols-outlined",
});

export const metadata: Metadata = {
  title: "중고장터",
  openGraph: {
    title: "중고장터",
  },
};
export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="ko"
      className={classNames(notoSansKr.className, materialSymbols.variable)}
    >
      <body>
        <MarketLayout>{children}</MarketLayout>
      </body>
    </html>
  );
}
