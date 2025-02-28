import "../src/globals.css"; // Ensure path is correct
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const { basePath } = useRouter();

  useEffect(() => {
    document.documentElement.lang = "zh-CN"; // Force the entire app to use Chinese locale
  }, []);

  return (
    <div className="w-full">
      <Component {...pageProps} basePath={basePath} />
    </div>
  );
}

export default MyApp;
