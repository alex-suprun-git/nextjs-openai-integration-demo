if(!self.define){let e,a={};const s=(s,c)=>(s=new URL(s+".js",c).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(c,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(a[t])return;let i={};const r=e=>s(e,t),d={module:{uri:t},exports:i,require:r};a[t]=Promise.all(c.map((e=>d[e]||r(e)))).then((e=>(n(...e),i)))}}define(["./workbox-49f2c8c8"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"420c615ee8258c69f0dd762e1a63eb88"},{url:"/_next/static/4Vyh-0nJv5aXbwYzM6C67/_buildManifest.js",revision:"a97bdf7406777285f3e706dd884eeb1a"},{url:"/_next/static/4Vyh-0nJv5aXbwYzM6C67/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/234-a84bd341c5f9b637.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/234-a84bd341c5f9b637.js.map",revision:"cc25d6cc3252153a65cda1e2ae1cdb07"},{url:"/_next/static/chunks/294-2449c6ca9beddfb3.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/294-2449c6ca9beddfb3.js.map",revision:"d074cb3f9cbb8983218efa093220c193"},{url:"/_next/static/chunks/664-2f72b9d1b2bb515d.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/664-2f72b9d1b2bb515d.js.map",revision:"65c2d50941ac8f76c44b30c80489c59c"},{url:"/_next/static/chunks/758-80f6beb13703f53d.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/758-80f6beb13703f53d.js.map",revision:"de20515169bb1aafde4cab9b2b378b59"},{url:"/_next/static/chunks/87c73c54-65312cf495289ba5.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/87c73c54-65312cf495289ba5.js.map",revision:"affefaab6c44803ab62fd6e8760d6af4"},{url:"/_next/static/chunks/968-e607e3cc40124f97.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/968-e607e3cc40124f97.js.map",revision:"950b69480d1461fe5c53521b9dada39d"},{url:"/_next/static/chunks/app/_not-found/page-498d47584019633a.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/app/about-me/page-cb7af745a4a95b11.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/app/about-me/page-cb7af745a4a95b11.js.map",revision:"c2d9b5f279969fc9e92462afbbe46cdb"},{url:"/_next/static/chunks/app/error-ada7113821982c24.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/app/error-ada7113821982c24.js.map",revision:"74533eba0f1648eca5ffc3aaa19f54f8"},{url:"/_next/static/chunks/app/global-error-1653da1cc0c52cba.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/app/global-error-1653da1cc0c52cba.js.map",revision:"49ddebc22e9a4e1f422e1ab3a0072067"},{url:"/_next/static/chunks/app/layout-7cb7e4c155a6be6f.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/app/layout-7cb7e4c155a6be6f.js.map",revision:"78727845a7abdc580733afbd316dd802"},{url:"/_next/static/chunks/app/loading-acd7a82ad4c77aa5.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/app/loading-acd7a82ad4c77aa5.js.map",revision:"514b3e17bc482329f20eb325dbed399d"},{url:"/_next/static/chunks/app/not-found-1fb60977714c0d13.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/app/not-found-1fb60977714c0d13.js.map",revision:"1e1735ee3d69177a723f888b8beba1b8"},{url:"/_next/static/chunks/app/page-096c7bce2e78d75e.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/app/page-096c7bce2e78d75e.js.map",revision:"d21994e989029fa86ec0b66bdd4202a4"},{url:"/_next/static/chunks/framework-a5b8a6910515e10f.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/framework-a5b8a6910515e10f.js.map",revision:"efd0f3cc8e2ae5a92f9c59e47168aab7"},{url:"/_next/static/chunks/main-2cf726d7391d0b49.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/main-2cf726d7391d0b49.js.map",revision:"a95d5f7454e7360f573b6d072cb29c17"},{url:"/_next/static/chunks/main-app-6e7eda9e6bde99d2.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/main-app-6e7eda9e6bde99d2.js.map",revision:"520ea6152d3c53fbec2954e925adba3e"},{url:"/_next/static/chunks/pages/_app-0266af28cd498419.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/pages/_app-0266af28cd498419.js.map",revision:"987f71d02294fc8143352a5d7e41e1e7"},{url:"/_next/static/chunks/pages/_error-864b96498641eb19.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/pages/_error-864b96498641eb19.js.map",revision:"8580f58b3270c36da84ced2bbe02e938"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-2aa61228cdd9d9f5.js",revision:"4Vyh-0nJv5aXbwYzM6C67"},{url:"/_next/static/chunks/webpack-2aa61228cdd9d9f5.js.map",revision:"e9d7cb245b01770a46b21accac5bbb69"},{url:"/_next/static/css/346c317616e17c9d.css",revision:"346c317616e17c9d"},{url:"/_next/static/css/346c317616e17c9d.css.map",revision:"56b4f3e1c3955a35895d4abd28c3cb4e"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:s,state:c})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
//# sourceMappingURL=sw.js.map
