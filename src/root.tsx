import { QwikCity, RouterOutlet } from "@builder.io/qwik-city";
import { partytownSnippet } from "@builder.io/partytown/integration";
import Head from "./components/head/head";

import "./global.css";

export default () => {
  const snippetText = partytownSnippet();
  const googlePixel = ` window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-TPZPYJ5SJT'); `;
  const facebookPixel = `!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '1515077412248821'); fbq('track', 'PageView');`;

  return (
    <QwikCity>
      <Head />
      <script>{snippetText}</script>
      <script type="text/partytown">{googlePixel}</script>
      <script type="text/partytown">{facebookPixel}</script>

      <script
        type="text/partytown"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-TPZPYJ5SJT"
      />
      <script
        type="text/partytown"
        async
        src="https://player.vimeo.com/api/player.js"
      />
      <noscript>
        <img
          height="1"
          width="1"
          style="display:none"
          src="https://www.facebook.com/tr?id=1515077412248821&ev=PageView&noscript=1"
        />
      </noscript>
      <body lang="es">
        <RouterOutlet />
      </body>
    </QwikCity>
  );
};
