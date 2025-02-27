import "../src/globals.css"; // Ensure path is correct
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.lang = "zh-CN"; // Force the entire app to use Chinese locale
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
