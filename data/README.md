# Digital Twin data layer

Các file trong thư mục này là khung dữ liệu cho Digital Twin Óc Eo – Ba Thê.

- `registry/scene-registry.json`: toàn bộ scene VR trích từ tour hiện hữu.
- `registry/poi-registry.json`: các điểm/cụm di tích nối GIS ↔ VR.
- `registry/timeline-registry.json`: cấu hình timeline.
- `gis/zones-abcd.geojson`: khung 4 khu A–B–C–D.
- `gis/ancient-canals.geojson`: tuyến kênh cổ tái dựng minh họa.
- `gis/reconstruction.geojson`: footprint phục vụ khối 3D.

**Quan trọng:** các geometry có thuộc tính `status: illustrative` hoặc `reconstruction-illustrative` chỉ phục vụ UX và khung tích hợp. Khi có dữ liệu khảo sát / hồ sơ pháp lý, thay GeoJSON tương ứng mà không phải đổi UI.
