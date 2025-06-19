# Assets API Documentation

## Overview

This documentation provides comprehensive information for front-end developers to integrate with the Assets API in the Solar Monitoring System. The API manages solar plant assets, including locations, templates, inventory, and hierarchical asset structures.

## 📁 Documentation Structure

```
src/app/docs/
├── README.md                           # This file - Overview and navigation
├── assets-api-documentation.md         # Complete API reference
├── assets-usage-guide.md               # Practical usage examples
└── assets.model.ts                     # TypeScript interfaces and types
```

## 🚀 Quick Start

### 1. Import Required Modules

```typescript
import { AssetsService } from '../services/assets.service';
import { Asset, AssetType, AssetStatus } from '../models/assets.model';
```

### 2. Basic Usage

```typescript
constructor(private assetsService: AssetsService) {}

// Get all assets
this.assetsService.getAssets().subscribe({
  next: (response) => {
    console.log('Assets:', response.items);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});
```

## 📚 Documentation Sections

### 1. [API Reference](./assets-api-documentation.md)
Complete API documentation including:
- **Authentication & Authorization**
- **Base URL & Endpoints Structure**
- **API Endpoints by Category**
- **Data Models & Schemas**
- **Query Parameters for Filtering**
- **Enum Values**
- **Error Responses**
- **Usage Examples**
- **Best Practices**
- **Testing Endpoints**

### 2. [Usage Guide](./assets-usage-guide.md)
Practical implementation examples:
- **Getting Started**
- **Basic Usage Examples**
- **Advanced Usage Patterns**
- **Error Handling**
- **Best Practices**
- **Component Integration**

### 3. [TypeScript Models](./assets.model.ts)
Complete type definitions:
- **Enums** (AssetType, AssetStatus, TemplateCategory)
- **Interfaces** (Asset, Location, Template, etc.)
- **Request/Response Types**
- **Query Parameter Types**
- **Error Types**

## 🔧 Service Implementation

The `AssetsService` provides a complete wrapper around the API with:
- **Type-safe methods** for all endpoints
- **Automatic authentication** header injection
- **Error handling** and transformation
- **Query parameter building**
- **Utility methods** for common operations

## 📋 API Categories

### 1. **Location Management**
- Create, read, update, delete locations
- Hierarchical location structure
- Location-based asset filtering

### 2. **Asset Template Management**
- Template CRUD operations
- Template categorization (hardware, consumable, license)
- Default configuration management

### 3. **Asset Management**
- Full asset lifecycle management
- Hierarchical asset structure
- Asset status tracking
- Real-time data tag management

### 4. **Asset Items Management**
- Deployed items within assets
- Item configuration and status
- Template-based item creation

### 5. **Asset Sensors Management**
- Sensor configuration and management
- Sensor type and unit definitions
- Real-time data collection setup

### 6. **Inventory Management**
- Stock level tracking
- Location-based inventory
- Batch and expiry management

## 🎯 Common Use Cases

### Asset Hierarchy Visualization
```typescript
// Get complete asset tree
this.assetsService.getAssetHierarchy(assetId).subscribe({
  next: (hierarchy) => {
    this.renderAssetTree(hierarchy);
  }
});
```

### Filtered Asset Lists
```typescript
// Get active solar plants
const params = {
  asset_type: AssetType.PLANT,
  status: AssetStatus.ACTIVE
};
this.assetsService.getAssets(params).subscribe(/* ... */);
```

### Template-Based Asset Creation
```typescript
// Create asset from template
const newAsset = {
  template_id: 1,
  name: "Solar Plant Alpha",
  code: "PLANT-ALPHA-001",
  asset_type: AssetType.PLANT,
  status: AssetStatus.ACTIVE
};
this.assetsService.createAsset(newAsset).subscribe(/* ... */);
```

## 🔐 Authentication

All API calls require Bearer token authentication:
```typescript
// Automatically handled by AssetsService
Authorization: Bearer <access_token>
```

## 📊 Data Models

### Core Entities
- **Asset**: Main solar plant components
- **Location**: Physical locations and sites
- **Template**: Reusable asset definitions
- **Item**: Deployed instances of templates
- **Sensor**: Monitoring devices
- **Inventory**: Stock management

### Relationships
- Assets can have parent-child relationships
- Assets belong to locations
- Assets are based on templates
- Assets can have multiple items and sensors
- Inventory tracks template quantities by location

## 🛠 Development Tools

### Testing
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **Test Credentials**: `admin@solar-platform.com` / `SuperAdmin123!`

### Environment Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:8000'
};
```

## 📝 Best Practices

### 1. **Error Handling**
- Always handle API errors gracefully
- Show user-friendly error messages
- Implement retry logic for transient failures

### 2. **Loading States**
- Show loading indicators during API calls
- Disable forms during submission
- Provide feedback for long-running operations

### 3. **Caching**
- Cache static data (templates, locations)
- Implement pagination for large datasets
- Use appropriate cache invalidation strategies

### 4. **Performance**
- Use filtering to reduce data transfer
- Implement lazy loading for hierarchical data
- Optimize queries with appropriate parameters

## 🔄 Migration Guide

### From Previous Version
1. Update imports to use new service
2. Replace direct HTTP calls with service methods
3. Update type definitions
4. Test all CRUD operations

### Breaking Changes
- All endpoints now require authentication
- Response format changed to include pagination
- Some field names have been updated for consistency

## 📞 Support

For questions or issues:
1. Check the API documentation first
2. Review the usage examples
3. Test with Swagger UI
4. Contact the backend team for API-specific issues

## 📈 Future Enhancements

Planned features:
- **Bulk Operations**: Create/update multiple assets
- **Advanced Filtering**: Complex query builders
- **Real-time Updates**: WebSocket integration
- **Export/Import**: Data migration tools
- **Audit Trail**: Change tracking and history

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**API Version**: v1 