import { QwikCity, RouterOutlet } from "@builder.io/qwik-city";
import App from "./routes";
import Head from "./components/head/head";

import "./global.css";

export default () => {
  return (
    <QwikCity>
      <Head />
      <body lang="es">
        <RouterOutlet />
      </body>
    </QwikCity>
  );
};
