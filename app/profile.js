function haversine(a,b) {
  const R=6371000, rad=x=>x*Math.PI/180;
  const dLat=rad(b[1]-a[1]), dLon=rad(b[0]-a[0]);
  const lat1=rad(a[1]), lat2=rad(b[1]);
  const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}

export class ProfileTool {
  constructor(twin,ui) {
    this.twin=twin; this.map=twin.map; this.ui=ui; this.points=[]; this.active=false;
    this.onClick=e=>this.capture([e.lngLat.lng,e.lngLat.lat]);
  }
  ensureLayers() {
    if (!this.map.getSource("profile")) {
      this.map.addSource("profile",{type:"geojson",data:{type:"FeatureCollection",features:[]}});
      this.map.addLayer({id:"profile-line",type:"line",source:"profile",paint:{"line-color":"#fff","line-width":3,"line-dasharray":[2,1]}});
      this.map.addLayer({id:"profile-points",type:"circle",source:"profile",paint:{"circle-color":"#e8c66e","circle-radius":6,"circle-stroke-color":"#07120d","circle-stroke-width":2}});
    }
  }
  start() {
    this.ensureLayers(); this.points=[]; this.active=true; this.ui.drawer.classList.add("show");
    this.ui.title.textContent="Mặt cắt địa hình · chọn điểm A";
    this.ui.meta.textContent="Nhấp hai điểm trên bản đồ để lấy profile từ DEM.";
    this.ui.chart.innerHTML='<div class="profile-empty">A → B</div>';
    this.map.getCanvas().style.cursor="crosshair"; this.map.on("click",this.onClick); this.updateGeometry();
  }
  stop() {
    if (!this.active) return; this.active=false; this.map.off("click",this.onClick); this.map.getCanvas().style.cursor="";
  }
  close(){ this.stop(); this.ui.drawer.classList.remove("show"); }
  async capture(coord) {
    if (!this.active) return;
    if (this.points.length>=2) this.points=[];
    this.points.push(coord); this.updateGeometry();
    if (this.points.length===1) { this.ui.title.textContent="Mặt cắt địa hình · chọn điểm B"; return; }
    this.stop(); this.ui.title.textContent="Mặt cắt địa hình A → B";
    await new Promise(r=>setTimeout(r,500)); this.renderProfile();
  }
  updateGeometry() {
    const features=[];
    if (this.points.length) this.points.forEach((p,i)=>features.push({type:"Feature",properties:{label:i?"B":"A"},geometry:{type:"Point",coordinates:p}}));
    if (this.points.length===2) features.push({type:"Feature",properties:{},geometry:{type:"LineString",coordinates:this.points}});
    const s=this.map.getSource("profile"); if (s) s.setData({type:"FeatureCollection",features:features});
  }
  renderProfile() {
    const a=this.points[0], b=this.points[1], samples=72, dist=haversine(a,b), vals=[];
    for (let i=0;i<samples;i++) {
      const t=i/(samples-1), p=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
      vals.push({d:dist*t,z:this.twin.queryElevation(p)});
    }
    const valid=vals.filter(x=>Number.isFinite(x.z));
    if (valid.length<4) {
      this.ui.meta.textContent="Chiều dài "+(dist/1000).toFixed(2)+" km · DEM chưa tải đủ tại tuyến này.";
      this.ui.chart.innerHTML='<div class="profile-empty">Di chuyển/zoom đến tuyến và thử lại.</div>'; return;
    }
    const min=Math.min.apply(null,valid.map(x=>x.z)), max=Math.max.apply(null,valid.map(x=>x.z));
    const W=680,H=170,pad=22,span=Math.max(1,max-min);
    const pts=vals.map((v,i)=>[pad+(W-pad*2)*(i/(samples-1)),H-pad-(H-pad*2)*(((Number.isFinite(v.z)?v.z:min)-min)/span)]);
    const line=pts.map(p=>p.join(",")).join(" ");
    const area=pad+","+(H-pad)+" "+line+" "+(W-pad)+","+(H-pad);
    this.ui.chart.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Biểu đồ mặt cắt địa hình"><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8c66e" stop-opacity=".45"/><stop offset="1" stop-color="#e8c66e" stop-opacity=".03"/></linearGradient></defs><line x1="'+pad+'" y1="'+(H-pad)+'" x2="'+(W-pad)+'" y2="'+(H-pad)+'" class="axis"/><polygon points="'+area+'" fill="url(#pg)"/><polyline points="'+line+'" class="profile-line"/><text x="'+pad+'" y="16" class="profile-text">max '+max.toFixed(1)+' m</text><text x="'+(W-pad)+'" y="'+(H-5)+'" text-anchor="end" class="profile-text">'+(dist/1000).toFixed(2)+' km</text></svg>';
    this.ui.meta.textContent="Dài "+(dist/1000).toFixed(2)+" km · thấp "+min.toFixed(1)+" m · cao "+max.toFixed(1)+" m · chênh "+(max-min).toFixed(1)+" m";
  }
}
