const APP_NAME = "pwa-template", APP_VERSION = __webpack_hash__;
const CACHE_NAME = APP_NAME+'-'+APP_VERSION;
const FILES_TO_CACHE = serviceWorkerOption.assets
//.map(v=>"."+v);

self.portSW;
self.addEventListener('message',e=>{
  const { type } = e.data;
  console.log(type);
  switch (type) {
    case 'init':
      self.portSW = e.ports[0];
      console.log("initialized sw");
    break;

    default:
  }
  self.portSW && portSW.start();
})
console.log=(...args)=>{
  self.portSW && portSW.postMessage({type: "consoleLog", content: args });
}
self.addEventListener('install', function(event) {
  event.waitUntil(
  caches.open(CACHE_NAME)
  .then((cache)=> {
    console.log('[ServiceWorker] Pre-caching offline page');
    return cache.addAll(FILES_TO_CACHE.map(url => new Request(url, {credentials: 'same-origin'})));
  })
  );
});

self.addEventListener('activate', function(event) {  
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        console.log("key: "+key);
        if (key.indexOf(APP_NAME)===0 &&key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  
  );
  
});
self.addEventListener('fetch', function(evt) {
  const reqLogText = "request file:"+evt.request.url;
  evt.respondWith(
  caches.match(evt.request).then(res=>{
    if(res!=null){
      console.log(reqLogText+"\n ...cache exists");
      return res;
    }else{
      console.warn(reqLogText+"\n ...cache didn't exit");
      return fetch(evt.request);
    }
    
  })
  );
  
});

/*

s = ["72x72","96x96", "128x128", "144x144", "152x152", "192x192", "384x384", "512x512"]
for(x=0;x<s.length;x++){
  console.log(`{
  "src": "./icon-${s[x]}.png",
  "sizes": "${s[x]}",
  "type": "image/png"
  },`);
}

inkscape:[A-z]*-?[A-z]*="0"
(style|id)="[\S]*"
*/