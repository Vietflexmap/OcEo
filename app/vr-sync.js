export class VRSynchronizer {
  constructor(data,ui) {
    this.data=data; this.ui=ui; this.onSceneChange=null; this.currentSceneId=null;
    window.addEventListener("message",e=>{
      if (e.origin!==location.origin || !e.data || e.data.type!=="oc-eo:scene-change") return;
      const scene=this.data.scenes.find(s=>s.id===e.data.sceneId);
      if (!scene) return;
      this.currentSceneId=scene.id; this.ui.title.textContent=scene.title;
      if (this.onSceneChange) this.onSceneChange(scene);
    });
    this.ui.close.addEventListener("click",()=>this.close());
  }
  open(scene) {
    this.currentSceneId=scene.id; this.ui.title.textContent=scene.title; this.ui.overlay.classList.add("show");
    this.ui.frame.src="./vr.html?embed=1&scene="+encodeURIComponent(scene.id);
  }
  close(){ this.ui.overlay.classList.remove("show"); this.ui.frame.src="about:blank"; }
  openById(id){ const scene=this.data.scenes.find(s=>s.id===id); if (scene) this.open(scene); }
  sendScene(id){ if (this.ui.frame.contentWindow) this.ui.frame.contentWindow.postMessage({type:"oc-eo:open-scene",sceneId:id},location.origin); }
}
