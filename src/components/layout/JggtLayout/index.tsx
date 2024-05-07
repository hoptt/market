import { ReactNode } from "react";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import UserInfo from "./_components/UserInfo";
import Aside from "./_components/Aside";
import Container from "../Container";

interface Props {
  children: ReactNode;
}
export default function JggtLayout({ children }: Props) {
  return (
    <div style={{ minWidth: 1000 }}>
      <UserInfo />
      <Header>
        <Aside />
      </Header>
      <main style={{ minHeight: "calc(100vh - 28px - 108px - 65px)" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
