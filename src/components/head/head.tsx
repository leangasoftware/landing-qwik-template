import { component$ } from "@builder.io/qwik";
import { Social } from "./social";

import "./head.css";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const loc = useLocation();
  return (
    <head lang="es">
      <meta name="google" content="notranslate" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={loc.href} />
      <meta name="theme-color" content="#1a1a1a"></meta>

      <Social />
    </head>
  );
});
