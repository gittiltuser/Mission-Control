import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://tame-mockingbird-306.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <Component {...pageProps} />
    </ConvexProvider>
  );
}
