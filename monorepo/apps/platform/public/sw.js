if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,c)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>n(e,i),o={module:{uri:i},exports:t,require:r};s[i]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(c(...e),t)))}}define(["./workbox-49f2c8c8"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"434af078512000203212119bf342c673"},{url:"/_next/static/chunks/709-ba3e3548f795085c.js",revision:"eeE2Z30Ii5XTFlBp0A9H9"},{url:"/_next/static/chunks/709-ba3e3548f795085c.js.map",revision:"996cbfdb53058a18845027ecc184c038"},{url:"/_next/static/chunks/87c73c54-b9ae31ca0488d6cc.js",revision:"eeE2Z30Ii5XTFlBp0A9H9"},{url:"/_next/static/chunks/87c73c54-b9ae31ca0488d6cc.js.map",revision:"2b56e0f447c3040d70a3449a9548e908"},{url:"/_next/static/chunks/framework-6a1fffa0fa838280.js",revision:"eeE2Z30Ii5XTFlBp0A9H9"},{url:"/_next/static/chunks/framework-6a1fffa0fa838280.js.map",revision:"614eaf720a8ea5c9b309158d40b212f1"},{url:"/_next/static/chunks/main-app-bb4617d968f879ee.js",revision:"eeE2Z30Ii5XTFlBp0A9H9"},{url:"/_next/static/chunks/main-app-bb4617d968f879ee.js.map",revision:"13850b0a2038a3cbccb9fb8c11bdf05d"},{url:"/_next/static/chunks/main-fb69c092d6aa4160.js",revision:"eeE2Z30Ii5XTFlBp0A9H9"},{url:"/_next/static/chunks/main-fb69c092d6aa4160.js.map",revision:"dd7226e81cd1adc493b683e6d2f8b82f"},{url:"/_next/static/chunks/pages/_app-5dbcd5973f6d3b4d.js",revision:"eeE2Z30Ii5XTFlBp0A9H9"},{url:"/_next/static/chunks/pages/_app-5dbcd5973f6d3b4d.js.map",revision:"737a4fa17647066c5d90a5b076cd83bc"},{url:"/_next/static/chunks/pages/_error-33c97b721f30b394.js",revision:"eeE2Z30Ii5XTFlBp0A9H9"},{url:"/_next/static/chunks/pages/_error-33c97b721f30b394.js.map",revision:"680cc03cd1bb000133badb781fbc99f5"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-ce4c798ea18f5a73.js",revision:"eeE2Z30Ii5XTFlBp0A9H9"},{url:"/_next/static/chunks/webpack-ce4c798ea18f5a73.js.map",revision:"f412f9d461b4e6a7ac5b23e1345dbbfa"},{url:"/_next/static/eeE2Z30Ii5XTFlBp0A9H9/_buildManifest.js",revision:"bf4ecf6d985092b2f7067880a9296eb2"},{url:"/_next/static/eeE2Z30Ii5XTFlBp0A9H9/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/assets/analysis/negative.jpg",revision:"9e7d018f5418d134508ec0112997cd59"},{url:"/assets/analysis/neutral.jpg",revision:"047ffb327c82cc9e1199b0ee5f0799e5"},{url:"/assets/analysis/positive.jpg",revision:"6479fcb1b2ebe1046ab3a8f12c70194c"},{url:"/assets/analysis/unknown.jpg",revision:"ad27b75f75f0d211089c38251c976ef9"},{url:"/assets/icons/android-chrome-192x192.png",revision:"6ea53c6b17772e272b93249a893eaa05"},{url:"/assets/icons/android-chrome-512x512.png",revision:"34ecd82ccd498a4f418004fea74c54ae"},{url:"/assets/icons/apple-touch-icon.png",revision:"7dc07e05ec80a61aead83885e892ed0e"},{url:"/assets/icons/favicon-16x16.png",revision:"922b357b641976f4d0b0898b9a05ed82"},{url:"/assets/icons/favicon-32x32.png",revision:"7ea41323a26b3e1c826e242fb2639540"},{url:"/assets/icons/favicon.ico",revision:"03a20fe5143a0d56d01c6f5445c2d752"},{url:"/assets/screenshots/desktop/screenshot1.png",revision:"8bc9d7b568bc6a6d944e2e8135451ee3"},{url:"/assets/screenshots/desktop/screenshot2.png",revision:"614f6b0e8dedb62cc9756c386e1bae17"},{url:"/assets/screenshots/desktop/screenshot3.png",revision:"0df9c1261148e5fbc00feeb26754a21e"},{url:"/assets/screenshots/desktop/screenshot4.png",revision:"76667bda3a57a47c75ed9b35ee3cfc3c"},{url:"/assets/screenshots/mobile/screenshot1.png",revision:"445f2bf6ecb18ca09961a19eca938f4b"},{url:"/assets/screenshots/mobile/screenshot2.png",revision:"406cece1e47abf90cc2498982dc63c65"},{url:"/assets/screenshots/mobile/screenshot3.png",revision:"5f2725b5eb35c0d9a7c4adb46bbdda2d"},{url:"/assets/screenshots/mobile/screenshot4.png",revision:"2f4f565a51735a0fd90e6c3935987540"},{url:"/manifest.json",revision:"c97764ef9d3bae87e8732397b68895c6"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
//# sourceMappingURL=sw.js.map
