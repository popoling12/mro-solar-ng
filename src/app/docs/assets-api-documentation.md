# Assets API Documentation

## 1. **Authentication & Authorization**
- ต้องใช้ Bearer Token ใน Authorization header
- Token ได้จากการ login ผ่าน `/api/v1/auth/login`
- ตัวอย่าง: `Authorization: Bearer <access_token>`

## 2. **Base URL & Endpoints Structure**
```
Base URL: http://localhost:8000/api/v1/assets
```

## 3. **API Endpoints ตามหมวดหมู่**

### **3.1 Location Management**
```
GET    /api/v1/assets/locations/          # ดึงรายการ locations
POST   /api/v1/assets/locations/          # สร้าง location ใหม่
GET    /api/v1/assets/locations/{id}      # ดึง location ตาม ID
PUT    /api/v1/assets/locations/{id}      # แก้ไข location
DELETE /api/v1/assets/locations/{id}      # ลบ location
```

### **3.2 Asset Template Management**
```
GET    /api/v1/assets/templates/          # ดึงรายการ templates
POST   /api/v1/assets/templates/          # สร้าง template ใหม่
GET    /api/v1/assets/templates/{id}      # ดึง template ตาม ID
PUT    /api/v1/assets/templates/{id}      # แก้ไข template
DELETE /api/v1/assets/templates/{id}      # ลบ template
```

### **3.3 Store Inventory Management**
```
GET    /api/v1/assets/inventory/          # ดึงรายการ inventory
POST   /api/v1/assets/inventory/          # สร้าง inventory ใหม่
GET    /api/v1/assets/inventory/{id}      # ดึง inventory ตาม ID
PUT    /api/v1/assets/inventory/{id}      # แก้ไข inventory
DELETE /api/v1/assets/inventory/{id}      # ลบ inventory
```

### **3.4 Asset Management**
```
GET    /api/v1/assets/                    # ดึงรายการ assets
POST   /api/v1/assets/                    # สร้าง asset ใหม่
GET    /api/v1/assets/{id}                # ดึง asset ตาม ID
GET    /api/v1/assets/uuid/{uuid}         # ดึง asset ตาม UUID
PUT    /api/v1/assets/{id}                # แก้ไข asset
DELETE /api/v1/assets/{id}                # ลบ asset
GET    /api/v1/assets/{id}/hierarchy      # ดึง hierarchy ของ asset
GET    /api/v1/assets/{id}/ancestors      # ดึง ancestors ของ asset
```

### **3.5 Asset Items Management**
```
GET    /api/v1/assets/{asset_id}/items/   # ดึง items ของ asset
POST   /api/v1/assets/{asset_id}/items/   # สร้าง item ใหม่
GET    /api/v1/assets/items/{item_id}     # ดึง item ตาม ID
PUT    /api/v1/assets/items/{item_id}     # แก้ไข item
DELETE /api/v1/assets/items/{item_id}     # ลบ item
```

### **3.6 Asset Sensors Management**
```
GET    /api/v1/assets/{asset_id}/sensors/ # ดึง sensors ของ asset
POST   /api/v1/assets/{asset_id}/sensors/ # สร้าง sensor ใหม่
GET    /api/v1/assets/sensors/{sensor_id} # ดึง sensor ตาม ID
GET    /api/v1/assets/sensors/uuid/{uuid} # ดึง sensor ตาม UUID
PUT    /api/v1/assets/sensors/{sensor_id} # แก้ไข sensor
DELETE /api/v1/assets/sensors/{sensor_id} # ลบ sensor
```

## 4. **Data Models & Schemas**

### **4.1 Location Schema**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Solar Plant Complex",
  "code": "SPC-001",
  "description": "Main solar plant complex",
  "parent_id": null,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### **4.2 Asset Template Schema**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Solar Panel 400W",
  "code": "PANEL-400W",
  "asset_type": "panel",
  "category": "hardware",
  "manufacturer": "SolarTech",
  "model_number": "ST-400W-M",
  "description": "400W monocrystalline solar panel",
  "default_config": {
    "wattage": 400,
    "voltage": 24,
    "efficiency": 0.21
  },
  "unit_price": 150.00,
  "license_duration_days": null,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### **4.3 Asset Schema**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440002",
  "template_id": 1,
  "name": "Solar Plant Alpha",
  "code": "PLANT-ALPHA-001",
  "asset_type": "plant",
  "status": "active",
  "parent_id": null,
  "location_id": 1,
  "installation_date": "2024-01-01T00:00:00Z",
  "config": {
    "capacity_mw": 5.0,
    "grid_connection": "10kV"
  },
  "realtime_data_tag": "plant.alpha.001",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "created_by_id": 1,
  "template": { /* AssetTemplate object */ },
  "location": { /* Location object */ },
  "parent": null,
  "children": [],
  "deployed_items": [],
  "sensors": []
}
```

## 5. **Query Parameters สำหรับ Filtering**

### **5.1 Assets Filtering**
```
GET /api/v1/assets/?asset_type=plant&status=active&parent_id=1&location_id=1&skip=0&limit=100
```

### **5.2 Templates Filtering**
```
GET /api/v1/assets/templates/?asset_type=panel&category=hardware&skip=0&limit=100
```

### **5.3 Locations Filtering**
```
GET /api/v1/assets/locations/?parent_id=1&skip=0&limit=100
```

## 6. **Enum Values**

### **6.1 Asset Types**
```javascript
const AssetType = {
  PLANT: "plant",
  SUB_PLANT: "sub_plant", 
  INVERTER: "inverter",
  STRING: "string",
  PANEL: "panel",
  SENSOR: "sensor"
}
```

### **6.2 Asset Status**
```javascript
const AssetStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  MAINTENANCE: "maintenance",
  DECOMMISSIONED: "decommissioned"
}
```

### **6.3 Template Categories**
```javascript
const TemplateCategory = {
  HARDWARE: "hardware",
  CONSUMABLE: "consumable",
  LICENSE: "license"
}
```

## 7. **Error Responses**

### **7.1 Common Error Codes**
```json
{
  "detail": "Asset not found"
}
// 404 Not Found

{
  "detail": "An asset with this code already exists."
}
// 400 Bad Request

{
  "detail": "Cannot delete asset with children. Please delete or reassign children first."
}
// 400 Bad Request
```

## 8. **ตัวอย่างการใช้งาน**

### **8.1 สร้าง Asset ใหม่**
```javascript
const newAsset = {
  template_id: 1,
  name: "New Solar Panel",
  code: "PANEL-001",
  asset_type: "panel",
  status: "active",
  parent_id: 1,
  location_id: 1,
  installation_date: "2024-01-01T00:00:00Z",
  config: {
    "wattage": 400,
    "position": 1
  },
  realtime_data_tag: "panel.001"
};

const response = await fetch('/api/v1/assets/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(newAsset)
});
```

### **8.2 ดึง Asset Hierarchy**
```javascript
const response = await fetch('/api/v1/assets/1/hierarchy', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const hierarchy = await response.json();
// Returns: { asset: {...}, children: [...] }
```

## 9. **Best Practices**

### **9.1 Pagination**
- ใช้ `skip` และ `limit` parameters สำหรับ pagination
- Default limit = 100 items
- ควร implement infinite scroll หรือ pagination UI

### **9.2 Error Handling**
- ตรวจสอบ HTTP status codes
- Handle 401 (Unauthorized) และ 403 (Forbidden)
- Show user-friendly error messages

### **9.3 Data Validation**
- Validate required fields ก่อนส่ง request
- Check enum values ถูกต้อง
- Validate UUID format

### **9.4 Performance**
- ใช้ filtering parameters เพื่อลดข้อมูลที่ส่ง
- Implement caching สำหรับ static data (templates, locations)
- ใช้ lazy loading สำหรับ nested relationships

## 10. **Testing Endpoints**

### **10.1 Test Data**
- ใช้ sample data จาก `scripts/init_sample_data.py`
- Test user credentials: `admin@solar-platform.com` / `SuperAdmin123!`

### **10.2 API Testing Tools**
- Postman Collection
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 