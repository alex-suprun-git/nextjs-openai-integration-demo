if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let n={};const r=e=>a(e,t),o={module:{uri:t},exports:n,require:r};s[t]=Promise.all(c.map((e=>o[e]||r(e)))).then((e=>(i(...e),n)))}}define(["./workbox-49f2c8c8"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"0ea0cb3e43a84227051bacf5b570c140"},{url:"/_next/static/chunks/17a9af85-270866272fe5c908.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/17a9af85-270866272fe5c908.js.map",revision:"7e409c388f64b6c24eb2f5fc9daca779"},{url:"/_next/static/chunks/194-d56338da1869c1a8.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/194-d56338da1869c1a8.js.map",revision:"4fc10814be26ee77068e4a8c67f0e320"},{url:"/_next/static/chunks/205-bc3aa73f558ad14e.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/205-bc3aa73f558ad14e.js.map",revision:"85280352d262e588aa772cf45d735b39"},{url:"/_next/static/chunks/265-a9f3dbbc71a459d0.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/265-a9f3dbbc71a459d0.js.map",revision:"c2ae552693bdf9f404c43a57a4f40a43"},{url:"/_next/static/chunks/273.2238ca5cbf0a2540.js",revision:"2238ca5cbf0a2540"},{url:"/_next/static/chunks/273.2238ca5cbf0a2540.js.map",revision:"3635ac5b735fcc1d65d6c1ff3acf5278"},{url:"/_next/static/chunks/340-b3c0874b27188646.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/340-b3c0874b27188646.js.map",revision:"674e41ce5959bc7ae307758391f9ecfd"},{url:"/_next/static/chunks/483ecf8a-c5d4625e3ba6fada.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/483ecf8a-c5d4625e3ba6fada.js.map",revision:"0bed20c9ddfdfc5f69238890a387432a"},{url:"/_next/static/chunks/518-326e3f82e42dca65.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/518-326e3f82e42dca65.js.map",revision:"e760714f00f30b7bd3eb2c367d7de562"},{url:"/_next/static/chunks/521-374e2cccbfe72553.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/521-374e2cccbfe72553.js.map",revision:"ee7d84efd292b84986300e06615ba25f"},{url:"/_next/static/chunks/611-8fcaaedca48e471d.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/611-8fcaaedca48e471d.js.map",revision:"a00b57a22a3cfcef4e8427b664ed935e"},{url:"/_next/static/chunks/750-585965d551bd2623.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/750-585965d551bd2623.js.map",revision:"5125043bea5e3706d7a7017b99a94b71"},{url:"/_next/static/chunks/7dccf9e0-7b022c0c22f9618f.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/7dccf9e0-7b022c0c22f9618f.js.map",revision:"9da73c5b177a5cac4de08d7be2356c2e"},{url:"/_next/static/chunks/87c73c54-44a099fec0ac667c.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/87c73c54-44a099fec0ac667c.js.map",revision:"a2a67c6f96e08247b22b52b36ecbc7ad"},{url:"/_next/static/chunks/90bde008-fc496f3d78f9d967.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/90bde008-fc496f3d78f9d967.js.map",revision:"847fbf3fea98c3915b5f9ad9acdb2ea3"},{url:"/_next/static/chunks/956.c0612cf50b4569ad.js",revision:"c0612cf50b4569ad"},{url:"/_next/static/chunks/956.c0612cf50b4569ad.js.map",revision:"fbecd18043e6565886ddbb4ddd48c03c"},{url:"/_next/static/chunks/9fb599d8-64dfe66e04133a76.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/9fb599d8-64dfe66e04133a76.js.map",revision:"f8b64f868f9a76a64c3cdf1eb4230228"},{url:"/_next/static/chunks/a9f06191-b0c87a18b8f23316.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/a9f06191-b0c87a18b8f23316.js.map",revision:"51dc0f372b14dcb001d69ffb278e3687"},{url:"/_next/static/chunks/app/(pages)/%5Bid%5D/not-found-9db24a0c0ca632d3.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/(pages)/%5Bid%5D/not-found-9db24a0c0ca632d3.js.map",revision:"9092a0ef5a026dfa6bccb3d27d27ecd0"},{url:"/_next/static/chunks/app/(pages)/%5Bid%5D/page-3561ad5d5ec4c9f7.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/(pages)/layout-ace7de9e155c31a9.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/(pages)/layout-ace7de9e155c31a9.js.map",revision:"549f8e03300567185275cac9bbbc98ce"},{url:"/_next/static/chunks/app/(pages)/new-entry/page-eac9c4cc1e6b95f2.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/(pages)/page-e692cd7a8e57c87f.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/(pages)/page-e692cd7a8e57c87f.js.map",revision:"32f1e698d2eb929d7b7250b2cc05de5b"},{url:"/_next/static/chunks/app/(pages)/statistics/page-1251f4d06a675c69.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/(pages)/statistics/page-1251f4d06a675c69.js.map",revision:"91dbe4a7a3e413a116b76ed1798de156"},{url:"/_next/static/chunks/app/_not-found/page-52cbea60fd2dd69b.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/api/journal/%5Bid%5D/route-1bc4b7401e46cca7.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/api/journal/route-168c089d8db1bdf3.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/api/question/route-85908493e7281327.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/api/user-limits-renewal/route-3725e4d067d73034.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/api/user/route-c2535e353d1f7992.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/error-59c9cd426d304e30.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/error-59c9cd426d304e30.js.map",revision:"0d6d9e95f80a8a9f86ad0c2ff6fac4dc"},{url:"/_next/static/chunks/app/global-error-a5d7802d643ee0f3.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/global-error-a5d7802d643ee0f3.js.map",revision:"e5857027d0e6c0b87ca06f048f6a8404"},{url:"/_next/static/chunks/app/layout-f357ca01fe07e260.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/layout-f357ca01fe07e260.js.map",revision:"d953866529d26ad72b93bb0316750f37"},{url:"/_next/static/chunks/app/loading-54e1443c06a6896e.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/loading-54e1443c06a6896e.js.map",revision:"df8beb1ffc455417df7a606e06e89cb4"},{url:"/_next/static/chunks/app/new-user/loading-a16c91bfb6e1b2eb.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/new-user/loading-a16c91bfb6e1b2eb.js.map",revision:"7e89074e48fa73683d832edc4f9e31f5"},{url:"/_next/static/chunks/app/new-user/page-07aa611d69463d8b.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/not-found-94b4b24dfc1edb55.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/not-found-94b4b24dfc1edb55.js.map",revision:"b0053fd0fedb2ee13b3c8bc9954a3dfb"},{url:"/_next/static/chunks/app/sign-in/%5B%5B...sign-in%5D%5D/page-c0d054fce9c20c3b.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/sign-in/%5B%5B...sign-in%5D%5D/page-c0d054fce9c20c3b.js.map",revision:"a12a10b4edb12c8da47c3885a38af114"},{url:"/_next/static/chunks/app/sign-up/%5B%5B...sign-up%5D%5D/page-3f9724154b6c1201.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/app/sign-up/%5B%5B...sign-up%5D%5D/page-3f9724154b6c1201.js.map",revision:"ef4d1a14f9aace746fbb1184f28b4af2"},{url:"/_next/static/chunks/framework-245b786a2ca1157b.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/framework-245b786a2ca1157b.js.map",revision:"2866cf5467ea65f62538e3c2bf3f2126"},{url:"/_next/static/chunks/main-7dea5f45f3eb3b92.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/main-7dea5f45f3eb3b92.js.map",revision:"cc16bf7df6bf04183ce81429c7710993"},{url:"/_next/static/chunks/main-app-652d00471d54671a.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/main-app-652d00471d54671a.js.map",revision:"a8d9e5f60327684438a00bb2c232fab9"},{url:"/_next/static/chunks/pages/_app-db5226aabd7cc22e.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/pages/_app-db5226aabd7cc22e.js.map",revision:"3786189a4a525816df9d6c91584d5fb0"},{url:"/_next/static/chunks/pages/_error-dee591d27b090984.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/pages/_error-dee591d27b090984.js.map",revision:"dd4d18518afdd43bdea324c638721eab"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-ebb8efd424600bff.js",revision:"jLxS14ia79GeozjvPj_tA"},{url:"/_next/static/chunks/webpack-ebb8efd424600bff.js.map",revision:"bdabcb38d7c30750489758297cf2851d"},{url:"/_next/static/css/ac5d9ab56c20cfb8.css",revision:"ac5d9ab56c20cfb8"},{url:"/_next/static/css/ac5d9ab56c20cfb8.css.map",revision:"8969463d83f3ef3e7c8629dcb21b9fb4"},{url:"/_next/static/css/e0eb9e9dbe0ecf78.css",revision:"e0eb9e9dbe0ecf78"},{url:"/_next/static/css/e0eb9e9dbe0ecf78.css.map",revision:"441abf0702cdb30245b4e9d1cb105059"},{url:"/_next/static/jLxS14ia79GeozjvPj_tA/_buildManifest.js",revision:"134b18eeca06a079c8ab2350f0bf62f0"},{url:"/_next/static/jLxS14ia79GeozjvPj_tA/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/assets/analysis/negative.jpg",revision:"9e7d018f5418d134508ec0112997cd59"},{url:"/assets/analysis/neutral.jpg",revision:"047ffb327c82cc9e1199b0ee5f0799e5"},{url:"/assets/analysis/positive.jpg",revision:"6479fcb1b2ebe1046ab3a8f12c70194c"},{url:"/assets/analysis/unknown.jpg",revision:"ad27b75f75f0d211089c38251c976ef9"},{url:"/assets/icons/android-chrome-192x192.png",revision:"6ea53c6b17772e272b93249a893eaa05"},{url:"/assets/icons/android-chrome-512x512.png",revision:"34ecd82ccd498a4f418004fea74c54ae"},{url:"/assets/icons/apple-touch-icon.png",revision:"7dc07e05ec80a61aead83885e892ed0e"},{url:"/assets/icons/favicon-16x16.png",revision:"922b357b641976f4d0b0898b9a05ed82"},{url:"/assets/icons/favicon-32x32.png",revision:"7ea41323a26b3e1c826e242fb2639540"},{url:"/assets/icons/favicon.ico",revision:"03a20fe5143a0d56d01c6f5445c2d752"},{url:"/assets/screenshots/desktop/screenshot1.png",revision:"8bc9d7b568bc6a6d944e2e8135451ee3"},{url:"/assets/screenshots/desktop/screenshot2.png",revision:"614f6b0e8dedb62cc9756c386e1bae17"},{url:"/assets/screenshots/desktop/screenshot3.png",revision:"0df9c1261148e5fbc00feeb26754a21e"},{url:"/assets/screenshots/desktop/screenshot4.png",revision:"76667bda3a57a47c75ed9b35ee3cfc3c"},{url:"/assets/screenshots/mobile/screenshot1.png",revision:"445f2bf6ecb18ca09961a19eca938f4b"},{url:"/assets/screenshots/mobile/screenshot2.png",revision:"406cece1e47abf90cc2498982dc63c65"},{url:"/assets/screenshots/mobile/screenshot3.png",revision:"5f2725b5eb35c0d9a7c4adb46bbdda2d"},{url:"/assets/screenshots/mobile/screenshot4.png",revision:"2f4f565a51735a0fd90e6c3935987540"},{url:"/manifest.json",revision:"9e101fa4b76360e6a4e4ab9944dae43c"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
//# sourceMappingURL=sw.js.map
