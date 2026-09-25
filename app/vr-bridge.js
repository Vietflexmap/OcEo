(function(){
  const params=new URLSearchParams(location.search);
  const embed=params.get("embed")==="1";
  const initialScene=params.get("scene");

  if (embed) {
    document.documentElement.classList.add("embedded-vr");
    const style=document.createElement("style");
    style.textContent="#back-webgis{display:none!important}.embedded-vr #toggle-sidebar{top:78px}.embedded-vr #scene-title{bottom:22px}.embedded-vr #sidebar{padding-top:66px}";
    document.head.appendChild(style);
  }

  const original=typeof goToScene==="function"?goToScene:null;
  if (original) {
    goToScene=function(sceneId){
      original(sceneId);
      try {
        const scene=typeof SCENES!=="undefined"?SCENES.find(function(s){return s.id===sceneId;}):null;
        if (scene && window.parent!==window) {
          window.parent.postMessage({type:"oc-eo:scene-change",sceneId:scene.id,title:scene.title,group:scene.group},location.origin);
        }
      } catch(e) {}
    };
  }

  window.addEventListener("message",function(e){
    if (e.origin!==location.origin || !e.data || e.data.type!=="oc-eo:open-scene") return;
    if (typeof goToScene==="function") goToScene(e.data.sceneId);
  });

  window.addEventListener("load",function(){
    if (initialScene && typeof goToScene==="function") {
      setTimeout(function(){goToScene(initialScene);},450);
    }
  });
})();