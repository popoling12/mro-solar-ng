// Assets API Models and Interfaces

// ============================================================================
// ENUMS
// ============================================================================

export enum AssetType {
  PLANT = "plant",
  SUB_PLANT = "sub_plant",
  INVERTER = "inverter",
  STRING = "string",
  PANEL = "panel",
  SENSOR = "sensor"
}

export enum AssetStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
  DECOMMISSIONED = "decommissioned"
}

export enum TemplateCategory {
  HARDWARE = "hardware",
  CONSUMABLE = "consumable",
  LICENSE = "license"
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface Location {
  id: number;
  uuid: string;
  name: string;
  code: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export interface AssetTemplate {
  id: number;
  uuid: string;
  name: string;
  code: string;
  asset_type: AssetType;
  category: TemplateCategory;
  manufacturer?: string;
  model_number?: string;
  description?: string;
  default_config: Record<string, any>;
  unit_price?: number;
  license_duration_days?: number;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: number;
  uuid: string;
  template_id: number;
  name: string;
  code: string;
  asset_type: AssetType;
  status: AssetStatus;
  parent_id?: number;
  location_id?: number;
  installation_date?: string;
  config: Record<string, any>;
  realtime_data_tag?: string;
  created_at: string;
  updated_at: string;
  created_by_id: number;
  
  // Related objects (may be included in response)
  template?: AssetTemplate;
  location?: Location;
  parent?: Asset;
  children?: Asset[];
  deployed_items?: AssetItem[];
  sensors?: AssetSensor[];
}

export interface AssetItem {
  id: number;
  uuid: string;
  asset_id: number;
  template_id: number;
  name: string;
  code: string;
  status: AssetStatus;
  installation_date?: string;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Related objects
  template?: AssetTemplate;
  asset?: Asset;
}

export interface AssetSensor {
  id: number;
  uuid: string;
  asset_id: number;
  name: string;
  code: string;
  sensor_type: string;
  unit: string;
  data_type: string;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Related objects
  asset?: Asset;
}

export interface Inventory {
  id: number;
  uuid: string;
  template_id: number;
  quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  location_id?: number;
  batch_number?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
  
  // Related objects
  template?: AssetTemplate;
  location?: Location;
}

// ============================================================================
// REQUEST/RESPONSE INTERFACES
// ============================================================================

export interface CreateLocationRequest {
  name: string;
  code: string;
  description?: string;
  parent_id?: number;
}

export interface UpdateLocationRequest {
  name?: string;
  code?: string;
  description?: string;
  parent_id?: number;
}

export interface CreateTemplateRequest {
  name: string;
  code: string;
  asset_type: AssetType;
  category: TemplateCategory;
  manufacturer?: string;
  model_number?: string;
  description?: string;
  default_config: Record<string, any>;
  unit_price?: number;
  license_duration_days?: number;
}

export interface UpdateTemplateRequest {
  name?: string;
  code?: string;
  asset_type?: AssetType;
  category?: TemplateCategory;
  manufacturer?: string;
  model_number?: string;
  description?: string;
  default_config?: Record<string, any>;
  unit_price?: number;
  license_duration_days?: number;
}

export interface CreateAssetRequest {
  template_id: number;
  name: string;
  code: string;
  asset_type: AssetType;
  status: AssetStatus;
  parent_id?: number;
  location_id?: number;
  installation_date?: string;
  config: Record<string, any>;
  realtime_data_tag?: string;
}

export interface UpdateAssetRequest {
  template_id?: number;
  name?: string;
  code?: string;
  asset_type?: AssetType;
  status?: AssetStatus;
  parent_id?: number;
  location_id?: number;
  installation_date?: string;
  config?: Record<string, any>;
  realtime_data_tag?: string;
}

export interface CreateItemRequest {
  template_id: number;
  name: string;
  code: string;
  status: AssetStatus;
  installation_date?: string;
  config: Record<string, any>;
}

export interface UpdateItemRequest {
  template_id?: number;
  name?: string;
  code?: string;
  status?: AssetStatus;
  installation_date?: string;
  config?: Record<string, any>;
}

export interface CreateSensorRequest {
  name: string;
  code: string;
  sensor_type: string;
  unit: string;
  data_type: string;
  config: Record<string, any>;
}

export interface UpdateSensorRequest {
  name?: string;
  code?: string;
  sensor_type?: string;
  unit?: string;
  data_type?: string;
  config?: Record<string, any>;
}

export interface CreateInventoryRequest {
  template_id: number;
  quantity: number;
  location_id?: number;
  batch_number?: string;
  expiry_date?: string;
}

export interface UpdateInventoryRequest {
  template_id?: number;
  quantity?: number;
  location_id?: number;
  batch_number?: string;
  expiry_date?: string;
}

// ============================================================================
// QUERY PARAMETER INTERFACES
// ============================================================================

export interface AssetsQueryParams {
  asset_type?: AssetType;
  status?: AssetStatus;
  parent_id?: number;
  location_id?: number;
  search?: string;
  skip?: number;
  limit?: number;
}

export interface TemplatesQueryParams {
  asset_type?: AssetType;
  category?: TemplateCategory;
  search?: string;
  skip?: number;
  limit?: number;
}

export interface LocationsQueryParams {
  parent_id?: number;
  search?: string;
  skip?: number;
  limit?: number;
}

export interface InventoryQueryParams {
  template_id?: number;
  location_id?: number;
  search?: string;
  skip?: number;
  limit?: number;
}

// ============================================================================
// RESPONSE INTERFACES
// ============================================================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface AssetHierarchyResponse {
  asset: Asset;
  children: Asset[];
}

export interface AssetAncestorsResponse {
  asset: Asset;
  ancestors: Asset[];
}

// ============================================================================
// ERROR INTERFACES
// ============================================================================

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
} 