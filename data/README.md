# Digital Twin data layer

Thư mục này là lớp dữ liệu tách rời UI để có thể thay dữ liệu nghiên cứu mà không sửa logic ứng dụng.

## Registry

- `registry/scene-registry.json`: 53 scene VR lấy từ tour hiện hữu; gồm ID, nhóm, tiêu đề, ảnh, hotspot và neo GIS.
- `registry/poi-registry.json`: cụm di sản/điểm tham chiếu để nối GIS ↔ VR.
- `registry/timeline-registry.json`: ba trạng thái Óc Eo cổ / khảo cổ / hiện trạng 2026.

## GIS

- `gis/zones-abcd.geojson`: A – Núi Ba Thê; B – Đô thị Óc Eo; C – Giồng Xoài; D – Nền Chùa.
- `gis/ancient-canals.geojson`: khung kênh cổ và tuyến Lung Lớn – Nền Chùa.
- `gis/reconstruction.geojson`: footprint cho fill-extrusion 3D.

## Cảnh báo

Tên bốn khu dựa trên tài liệu/hồ sơ công khai năm 2026, nhưng **polygon hiện tại không phải ranh giới hồ sơ đề cử**. Chúng mang thuộc tính `illustrative-extent`.

Các tuyến có thuộc tính `reconstruction-illustrative` hoặc `schematic-from-literature` cũng chỉ dùng để trình diễn kiến trúc Digital Twin cho đến khi có vector khảo cổ chính thức.

Nền Chùa được neo bằng tọa độ tham chiếu công khai; Giồng Xoài hiện neo xấp xỉ theo mô tả tư liệu rằng địa điểm nằm khoảng 1 km về phía nam núi Ba Thê.
