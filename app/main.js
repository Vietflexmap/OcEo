import { loadTwinData } from "./data.js";
import { HeritageTwinMap } from "./twin.js";
import { ProfileTool } from "./profile.js";
import { VRSynchronizer } from "./vr-sync.js";
import { CAMERA, STORY } from "./config.js";

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const data = await loadTwinData();
const twin = new HeritageTwinMap("map", data);
const state = { activePoi:null, activeScene:null, storyIndex:0 };

const profile = new ProfileTool(twin, {
  drawer: $("#profileDrawer"),
  title: $("#profileTitle"),
  meta: $("#profileMeta"),
  chart: $("#profileChart")
});

const vr = new VRSynchronizer(data, {
  overlay: $("#vrOverlay"),
  frame: $("#vrFrame"),
  title: $("#vrTitle"),
  close: $("#vrClose")
});

function esc(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c];
  });
}

function accuracyText(value) {
  const labels = {
    reference:"Tọa độ tham chiếu",
    curated:"Tọa độ biên tập",
    illustrative:"Vị trí minh họa",
    "reference-or-curated":"Tham chiếu / biên tập",
    "group-approximate":"Neo theo cụm VR",
    "literature-approximate":"Xấp xỉ theo tư liệu"
  };
  return labels[value] || value || "Chưa phân loại";
}

function toast(msg) {
  const el=$("#toast");
  el.textContent=msg; el.classList.add("show");
  clearTimeout(toast.t);
  toast.t=setTimeout(function(){el.classList.remove("show");},2200);
}

function sceneCard(scene) {
  return '<button class="scene-card" data-scene="'+esc(scene.id)+'">'+
    '<img src="'+esc(scene.vrImage)+'" alt="" loading="lazy">'+
    '<span><b>'+esc(scene.title)+'</b><small>'+esc(scene.group)+'</small></span>'+
    '<i>360°</i></button>';
}

function renderPois(filter) {
  const q=(filter||"").trim().toLowerCase();
  const items=data.pois.filter(function(p){
    return !q || (p.name+" "+p.summary).toLowerCase().includes(q);
  });
  $("#poiList").innerHTML=items.map(function(p){
    return '<button class="poi-row" data-poi="'+esc(p.id)+'">'+
      '<span class="poi-dot '+esc(p.accuracy)+'"></span>'+
      '<span><b>'+esc(p.name)+'</b><small>Khu '+esc(p.zone||"–")+' · '+esc(accuracyText(p.accuracy))+'</small></span>'+
      '<em>'+((p.vrSceneIds&&p.vrSceneIds.length)||0)+'</em></button>';
  }).join("") || '<div class="empty">Không có kết quả.</div>';
}

function renderScenes(filter) {
  const q=(filter||"").trim().toLowerCase();
  const filtered=data.scenes.filter(function(s){
    return !q || (s.title+" "+s.group).toLowerCase().includes(q);
  });
  const groups={};
  filtered.forEach(function(s){ (groups[s.group]||(groups[s.group]=[])).push(s); });
  $("#sceneList").innerHTML=Object.keys(groups).map(function(group){
    const scenes=groups[group];
    return '<details class="scene-group" '+(q?'open':'')+'>'+
      '<summary><span>'+esc(group)+'</span><b>'+scenes.length+'</b></summary>'+
      '<div class="scene-mini-list">'+scenes.map(function(s){
        return '<button data-scene="'+esc(s.id)+'"><span>'+esc(s.title)+'</span><small>'+(s.viewType==="aerial"?"trên cao":"thực địa")+'</small></button>';
      }).join("")+'</div></details>';
  }).join("") || '<div class="empty">Không có scene phù hợp.</div>';
  $("#sceneCount").textContent=data.scenes.length+" scene";
}

function openPoi(poi, fly) {
  if (fly===undefined) fly=true;
  state.activePoi=poi; state.activeScene=null;
  if (fly) twin.focusPoi(poi);
  const scenes=(poi.vrSceneIds||[]).map(function(id){return data.scenes.find(function(s){return s.id===id;});}).filter(Boolean);

  $("#contextPanel").classList.add("show");
  $("#contextEyebrow").textContent="KHU "+(poi.zone||"–")+" · "+accuracyText(poi.accuracy);
  $("#contextTitle").textContent=poi.name;

  let html='<p class="context-summary">'+esc(poi.summary)+'</p>'+
    '<div class="context-coords">'+poi.coordinates[1].toFixed(5)+'°N · '+poi.coordinates[0].toFixed(5)+'°E</div>'+
    '<div class="context-actions"><button id="contextFly">◎ Bay tới</button>'+
    (scenes.length?'<button id="contextVR" class="gold">◉ VR 360°</button>':'')+
    '</div><div class="context-section-title">Scene liên quan <span>'+scenes.length+'</span></div>'+
    '<div class="context-scenes">'+(scenes.map(sceneCard).join("")||'<div class="empty">Chưa gắn scene VR.</div>')+'</div>'+
    '<div class="data-note"><b>Độ tin cậy không gian</b><span>'+esc(accuracyText(poi.accuracy))+'. Các đối tượng minh họa cần được thay bằng dữ liệu khảo sát/hồ sơ chính thức khi công bố khoa học.</span></div>';
  $("#contextBody").innerHTML=html;

  const flyBtn=$("#contextFly"); if (flyBtn) flyBtn.addEventListener("click",function(){twin.focusPoi(poi);});
  const vrBtn=$("#contextVR"); if (vrBtn) vrBtn.addEventListener("click",function(){vr.open(scenes[0]);});
}

function openScene(scene, fly) {
  if (fly===undefined) fly=true;
  state.activeScene=scene;
  if (fly) twin.focusScene(scene);
  $("#contextPanel").classList.add("show");
  $("#contextEyebrow").textContent=scene.group+" · "+accuracyText(scene.anchorAccuracy);
  $("#contextTitle").textContent=scene.title;

  let hotspots=scene.hotspotTargets.map(function(h){
    return '<button data-scene="'+esc(h.target)+'">→ '+esc(h.title)+'</button>';
  }).join("");
  if (!hotspots) hotspots='<div class="empty">Không có hotspot.</div>';

  $("#contextBody").innerHTML=
    '<div class="scene-hero"><img src="'+esc(scene.vrImage)+'" alt=""></div>'+
    '<div class="context-coords">'+scene.coordinates[1].toFixed(5)+'°N · '+scene.coordinates[0].toFixed(5)+'°E</div>'+
    '<div class="context-actions"><button id="contextFly">◎ Bay tới</button><button id="contextVR" class="gold">◉ Mở VR 360°</button></div>'+
    '<div class="context-section-title">Liên kết không gian <span>'+scene.hotspotTargets.length+'</span></div>'+
    '<div class="hotspot-list">'+hotspots+'</div>'+
    '<div class="data-note"><b>Neo GIS của scene</b><span>'+esc(accuracyText(scene.anchorAccuracy))+'. VR là ảnh thực; vị trí neo trên GIS có thể là vị trí đại diện của cụm.</span></div>';

  $("#contextFly").addEventListener("click",function(){twin.focusScene(scene);});
  $("#contextVR").addEventListener("click",function(){vr.open(scene);});
}

function setTab(name) {
  $$(".tab-btn").forEach(function(b){b.classList.toggle("active",b.dataset.tab===name);});
  $$(".tab-pane").forEach(function(p){p.classList.toggle("active",p.id==="tab-"+name);});
}

function nearestFrame(value) {
  return data.timeline.keyframes.reduce(function(best,k){
    return Math.abs(k.value-value)<Math.abs(best.value-value)?k:best;
  },data.timeline.keyframes[0]);
}

function updateTimeline(value) {
  twin.applyTimeline(value);
  const k=nearestFrame(Number(value));
  $("#timeEra").textContent=k.label;
  $("#timeYear").textContent=k.year;
  $("#timeDescription").textContent=k.description;
  $$(".time-stop").forEach(function(b){b.classList.toggle("active",Number(b.dataset.value)===k.value);});
}

function playStory(index) {
  state.storyIndex=(index+STORY.length)%STORY.length;
  const step=STORY[state.storyIndex];
  const poi=data.pois.find(function(p){return p.id===step.id;});
  if (!poi) return;
  openPoi(poi,true);
  $("#storyPill").classList.add("show");
  $("#storyLabel").textContent=step.title;
  $("#storyCounter").textContent=(state.storyIndex+1)+"/"+STORY.length;
}

function dynamicClick(e) {
  const pb=e.target.closest("[data-poi]");
  if (pb) {
    const poi=data.pois.find(function(p){return p.id===pb.dataset.poi;});
    if (poi) openPoi(poi);
    return;
  }
  const sb=e.target.closest("[data-scene]");
  if (sb) {
    const scene=data.scenes.find(function(s){return s.id===sb.dataset.scene;});
    if (scene) openScene(scene);
  }
}

renderPois("");
renderScenes("");
document.addEventListener("click",dynamicClick);

$$(".tab-btn").forEach(function(b){b.addEventListener("click",function(){setTab(b.dataset.tab);});});
$("#searchInput").addEventListener("input",function(e){
  renderPois(e.target.value); renderScenes(e.target.value);
  if (e.target.value.trim()) setTab("scenes");
});

$("#contextClose").addEventListener("click",function(){$("#contextPanel").classList.remove("show");});
$("#panelToggle").addEventListener("click",function(){$("#leftPanel").classList.toggle("collapsed");});

$("#basemapSatellite").addEventListener("change",function(){twin.setBasemap("satellite");});
$("#basemapOSM").addEventListener("change",function(){twin.setBasemap("osm");});
$("#terrainToggle").addEventListener("change",function(e){twin.setTerrain(e.target.checked);});
$("#terrainRange").addEventListener("input",function(e){
  twin.setTerrainExaggeration(e.target.value);
  $("#terrainValue").textContent=Number(e.target.value).toFixed(1)+"×";
});

["zones","canals","reconstruction","scenes","hillshade","pois"].forEach(function(id){
  const el=document.getElementById("layer-"+id);
  if (el) el.addEventListener("change",function(e){twin.setLayer(id,e.target.checked);});
});

$("#timelineRange").addEventListener("input",function(e){updateTimeline(e.target.value);});
$$(".time-stop").forEach(function(b){b.addEventListener("click",function(){
  $("#timelineRange").value=b.dataset.value; updateTimeline(b.dataset.value);
});});

$("#btnOverview").addEventListener("click",function(){twin.flyCamera(CAMERA.overview);});
$("#btnMountain").addEventListener("click",function(){twin.flyCamera(CAMERA.mountain);});
$("#btnProfile").addEventListener("click",function(){profile.start();});
$("#profileClose").addEventListener("click",function(){profile.close();});
$("#profileRestart").addEventListener("click",function(){profile.start();});

$("#btnStory").addEventListener("click",function(){playStory(0);});
$("#storyPrev").addEventListener("click",function(){playStory(state.storyIndex-1);});
$("#storyNext").addEventListener("click",function(){playStory(state.storyIndex+1);});
$("#storyClose").addEventListener("click",function(){$("#storyPill").classList.remove("show");});

$("#btnVR").addEventListener("click",function(){
  const first=data.scenes.find(function(s){return s.title==="Toàn cảnh núi Ba Thê";})||data.scenes[0];
  if (first) vr.open(first);
});

$("#btnAbout").addEventListener("click",function(){$("#aboutDialog").showModal();});
$("#aboutClose").addEventListener("click",function(){$("#aboutDialog").close();});

twin.on("poi",function(poi){openPoi(poi,false);});
twin.on("scene",function(scene){openScene(scene,false);});
twin.on("camera",function(c){
  $("#mapStatus").textContent=c.lat.toFixed(4)+"°N · "+c.lng.toFixed(4)+"°E · z"+c.zoom.toFixed(1)+" · pitch "+Math.round(c.pitch)+"°";
});
vr.onSceneChange=function(scene){
  openScene(scene,true);
  $("#contextPanel").classList.remove("show");
};

await twin.init();
updateTimeline(100);
toast("Digital Twin sẵn sàng · "+data.pois.length+" cụm · "+data.scenes.length+" scene VR");
