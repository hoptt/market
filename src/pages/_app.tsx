import Container from "@/components/layout/Container";
import JggtLayout from "@/components/layout/JggtLayout";
import Wrapper from "@/components/layout/Wrapper";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <JggtLayout>
      <Head>
        <title>중고장터</title>
        <meta property="og:title" content="중고장터" key="title" />
      </Head>
      <Component {...pageProps} />
    </JggtLayout>
  );
}
