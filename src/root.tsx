import { QwikCity, RouterOutlet } from "@builder.io/qwik-city";
import { partytownSnippet } from "@builder.io/partytown/integration";
import Head from "./components/head/head";

import "./global.css";

export default () => {
  const snippetText = partytownSnippet({
    resolveUrl: function (url) {
      if (url.hostname === "connect.facebook.net") {
        const proxyMap: any = {
          "connect.facebook.net": "d2gn02yz3528v5.cloudfront.net",
        };
        url.hostname = proxyMap[url.hostname] || url.hostname;
        return url;
      }
      return url;
    },
    forward: ["dataLayer.push", "fbq"],
  });

  const googlePixel = `function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","G-NHJQPYGYCB");`;
  const facebookPixel = `!function(e,t,n,a,c,o,s){e.fbq||(c=e.fbq=function(){c.callMethod?c.callMethod.apply(c,arguments):c.queue.push(arguments)},e._fbq||(e._fbq=c),c.push=c,c.loaded=!0,c.version="2.0",c.queue=[],(o=t.createElement(n)).async=!0,o.src=a,(s=t.getElementsByTagName(n)[0]).parentNode.insertBefore(o,s))}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js"),fbq("init","1236522833796620"),fbq("track","PageView");`;

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
          src="https://www.facebook.com/tr?id=1236522833796620&ev=PageView&noscript=1"
        />
      </noscript>
      <body lang="es">
        <RouterOutlet />
      </body>
    </QwikCity>
  );
};
