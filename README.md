# Digital Twin Óc Eo – Ba Thê

Trang triển khai: **https://vietflexmap.github.io/OcEo/**

Khung WebGIS/Digital Twin kết nối **địa hình 3D + ảnh vệ tinh + GIS di sản + VR 360° + timeline + mặt cắt DEM** trong một giao diện.

## Những gì đang chạy

- MapLibre GL JS, camera 3D và terrain.
- DEM toàn cầu thực qua Mapzen/AWS Terrarium; đây là DEM nền, **không thay thế DEM đo đạc địa phương**.
- Ảnh vệ tinh làm nền hiện trạng và OpenStreetMap làm nền tham chiếu.
- Toàn bộ **53 scene VR** hiện có được tách thành registry để Map ↔ VR dùng chung.
- Spatial Heritage Registry cho Núi Ba Thê, Óc Eo, Linh Sơn, Nhà trưng bày, Gò Sáu Thuận, Gò Út Trạnh, Gò Cây Thị, Gò Giồng Cát, Giồng Xoài, Nền Chùa…
- 4 khu thành phần theo cách gọi trong hồ sơ đề cử 2026:
  - **Khu A – Núi Ba Thê**
  - **Khu B – Khu đô thị Óc Eo**
  - **Khu C – Giồng Xoài**
  - **Khu D – Nền Chùa**
- Timeline **Óc Eo cổ → Khảo cổ → Hiện trạng 2026**.
- Kênh cổ/tuyến thủy lộ dạng khung tái dựng.
- Khối 3D (fill extrusion) cho di tích hiện trạng và tái dựng.
- Công cụ **mặt cắt địa hình A → B** lấy cao độ từ terrain.
- Đồng bộ scene giữa bản đồ và viewer VR 360°.

## Cấu trúc

```text
OcEo/
├── index.html
├── styles.css
├── vr.html
├── app/
│   ├── main.js
│   ├── twin.js
│   ├── data.js
│   ├── config.js
│   ├── profile.js
│   ├── vr-sync.js
│   └── vr-bridge.js
└── data/
    ├── registry/
    │   ├── poi-registry.json
    │   ├── scene-registry.json
    │   └── timeline-registry.json
    └── gis/
        ├── zones-abcd.geojson
        ├── ancient-canals.geojson
        └── reconstruction.geojson
```

## Mức độ tin cậy dữ liệu

Digital Twin phân biệt rõ dữ liệu nền và dữ liệu tái dựng.

| Lớp | Trạng thái |
|---|---|
| DEM terrain | dữ liệu độ cao toàn cầu thực / nền tham chiếu |
| Ảnh vệ tinh | nền ảnh hiện trạng |
| VR 360° | ảnh thực theo nguồn tour của dự án |
| Scene → GIS anchor | gồm tham chiếu, biên tập và neo xấp xỉ theo cụm |
| Khu A–B–C–D | **tên khu là theo hồ sơ 2026; polygon hiện tại là extent minh họa** |
| Kênh cổ | khung tái dựng/khái quát để tích hợp dữ liệu khảo cổ chính thức |
| Khối 3D | massing minh họa; có thể thay bằng footprint/GLB chính thức |

## Nguồn tham chiếu về 4 khu

- Bộ VHTTDL, 2026: hồ sơ đề cử gồm 4 khu thành phần, tổng diện tích đề cử khoảng 453,1 ha và vùng đệm khoảng 946,3 ha.
  https://bvhttdl.gov.vn/Pages/chi-tiet.aspx?url=%2Fchuyen-gia-icomos-hoan-tat-khao-sat-khu-di-tich-oc-eo-ba-the.htm
- Ban Quản lý Di tích văn hóa Óc Eo: Núi Ba Thê (A), đô thị Óc Eo (B), Giồng Xoài (C), Nền Chùa (D).
  https://vanhoaoceo.angiang.gov.vn/di-tich-khao-co-duoi-long-dat-oc-eo-ba
- MapLibre raster DEM hỗ trợ Mapzen Terrarium:
  https://maplibre.org/maplibre-style-spec/sources/

## Thay dữ liệu minh họa bằng dữ liệu chính thức

Không cần viết lại UI. Chỉ thay các file:

- `data/gis/zones-abcd.geojson`
- `data/gis/ancient-canals.geojson`
- `data/gis/reconstruction.geojson`
- tọa độ trong `data/registry/poi-registry.json` và `scene-registry.json`

Nếu có DEM GeoTIFF đo đạc, nên xử lý thành Terrain-RGB/Terrarium/PMTiles hoặc tile service riêng rồi đổi cấu hình `TERRAIN` trong `app/config.js`.
