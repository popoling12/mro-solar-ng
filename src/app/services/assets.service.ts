import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Import all assets models
import {
  // Enums
  AssetType,
  AssetStatus,
  TemplateCategory,
  
  // Interfaces
  Location,
  AssetTemplate,
  Asset,
  AssetItem,
  AssetSensor,
  Inventory,
  
  // Request interfaces
  CreateLocationRequest,
  UpdateLocationRequest,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateItemRequest,
  UpdateItemRequest,
  CreateSensorRequest,
  UpdateSensorRequest,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  
  // Query parameter interfaces
  AssetsQueryParams,
  TemplatesQueryParams,
  LocationsQueryParams,
  InventoryQueryParams,
  
  // Response interfaces
  PaginatedResponse,
  AssetHierarchyResponse,
  AssetAncestorsResponse,
  
  // Error interfaces
  ApiError,
  ValidationError
} from '../models/assets.model';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  private readonly baseUrl = `${environment.apiUrl}/api/v1/assets`;

  constructor(private http: HttpClient) {}

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error?.detail) {
      errorMessage = error.error.detail;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('Assets API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  private buildQueryParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return httpParams;
  }

  // ============================================================================
  // LOCATION MANAGEMENT
  // ============================================================================

  getLocations(params?: LocationsQueryParams): Observable<PaginatedResponse<Location>> {
    const queryParams = params ? this.buildQueryParams(params) : new HttpParams();
    
    return this.http.get<PaginatedResponse<Location>>(`${this.baseUrl}/locations/`, {
      headers: this.getAuthHeaders(),
      params: queryParams
    }).pipe(catchError(this.handleError));
  }

  getLocation(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.baseUrl}/locations/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createLocation(data: CreateLocationRequest): Observable<Location> {
    return this.http.post<Location>(`${this.baseUrl}/locations/`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateLocation(id: number, data: UpdateLocationRequest): Observable<Location> {
    return this.http.put<Location>(`${this.baseUrl}/locations/${id}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/locations/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ============================================================================
  // ASSET TEMPLATE MANAGEMENT
  // ============================================================================

  getTemplates(params?: TemplatesQueryParams): Observable<PaginatedResponse<AssetTemplate>> {
    const queryParams = params ? this.buildQueryParams(params) : new HttpParams();
    
    return this.http.get<PaginatedResponse<AssetTemplate>>(`${this.baseUrl}/templates/`, {
      headers: this.getAuthHeaders(),
      params: queryParams
    }).pipe(catchError(this.handleError));
  }

  getTemplate(id: number): Observable<AssetTemplate> {
    return this.http.get<AssetTemplate>(`${this.baseUrl}/templates/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createTemplate(data: CreateTemplateRequest): Observable<AssetTemplate> {
    return this.http.post<AssetTemplate>(`${this.baseUrl}/templates/`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateTemplate(id: number, data: UpdateTemplateRequest): Observable<AssetTemplate> {
    return this.http.put<AssetTemplate>(`${this.baseUrl}/templates/${id}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/templates/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ============================================================================
  // ASSET MANAGEMENT
  // ============================================================================

  getAssets(params?: AssetsQueryParams): Observable<PaginatedResponse<Asset>> {
    const queryParams = params ? this.buildQueryParams(params) : new HttpParams();
    
    return this.http.get<PaginatedResponse<Asset>>(`${this.baseUrl}/`, {
      headers: this.getAuthHeaders(),
      params: queryParams
    }).pipe(catchError(this.handleError));
  }

  getAsset(id: number): Observable<Asset> {
    return this.http.get<Asset>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAssetByUuid(uuid: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.baseUrl}/uuid/${uuid}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createAsset(data: CreateAssetRequest): Observable<Asset> {
    return this.http.post<Asset>(`${this.baseUrl}/`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateAsset(id: number, data: UpdateAssetRequest): Observable<Asset> {
    return this.http.put<Asset>(`${this.baseUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteAsset(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAssetHierarchy(id: number): Observable<AssetHierarchyResponse> {
    return this.http.get<AssetHierarchyResponse>(`${this.baseUrl}/${id}/hierarchy`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAssetAncestors(id: number): Observable<AssetAncestorsResponse> {
    return this.http.get<AssetAncestorsResponse>(`${this.baseUrl}/${id}/ancestors`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ============================================================================
  // ASSET ITEMS MANAGEMENT
  // ============================================================================

  getAssetItems(assetId: number): Observable<AssetItem[]> {
    return this.http.get<AssetItem[]>(`${this.baseUrl}/${assetId}/items/`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAssetItem(itemId: number): Observable<AssetItem> {
    return this.http.get<AssetItem>(`${this.baseUrl}/items/${itemId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createAssetItem(assetId: number, data: CreateItemRequest): Observable<AssetItem> {
    return this.http.post<AssetItem>(`${this.baseUrl}/${assetId}/items/`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateAssetItem(itemId: number, data: UpdateItemRequest): Observable<AssetItem> {
    return this.http.put<AssetItem>(`${this.baseUrl}/items/${itemId}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteAssetItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${itemId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ============================================================================
  // ASSET SENSORS MANAGEMENT
  // ============================================================================

  getAssetSensors(assetId: number): Observable<AssetSensor[]> {
    return this.http.get<AssetSensor[]>(`${this.baseUrl}/${assetId}/sensors/`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAssetSensor(sensorId: number): Observable<AssetSensor> {
    return this.http.get<AssetSensor>(`${this.baseUrl}/sensors/${sensorId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAssetSensorByUuid(uuid: string): Observable<AssetSensor> {
    return this.http.get<AssetSensor>(`${this.baseUrl}/sensors/uuid/${uuid}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createAssetSensor(assetId: number, data: CreateSensorRequest): Observable<AssetSensor> {
    return this.http.post<AssetSensor>(`${this.baseUrl}/${assetId}/sensors/`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateAssetSensor(sensorId: number, data: UpdateSensorRequest): Observable<AssetSensor> {
    return this.http.put<AssetSensor>(`${this.baseUrl}/sensors/${sensorId}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteAssetSensor(sensorId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sensors/${sensorId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ============================================================================
  // INVENTORY MANAGEMENT
  // ============================================================================

  getInventory(params?: InventoryQueryParams): Observable<PaginatedResponse<Inventory>> {
    const queryParams = params ? this.buildQueryParams(params) : new HttpParams();
    
    return this.http.get<PaginatedResponse<Inventory>>(`${this.baseUrl}/inventory/`, {
      headers: this.getAuthHeaders(),
      params: queryParams
    }).pipe(catchError(this.handleError));
  }

  getInventoryItem(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.baseUrl}/inventory/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createInventory(data: CreateInventoryRequest): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.baseUrl}/inventory/`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateInventory(id: number, data: UpdateInventoryRequest): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.baseUrl}/inventory/${id}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/inventory/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  // Get all asset types as array
  getAssetTypes(): AssetType[] {
    return Object.values(AssetType);
  }

  // Get all asset statuses as array
  getAssetStatuses(): AssetStatus[] {
    return Object.values(AssetStatus);
  }

  // Get all template categories as array
  getTemplateCategories(): TemplateCategory[] {
    return Object.values(TemplateCategory);
  }

  // Search assets by name or code
  searchAssets(query: string, params?: AssetsQueryParams): Observable<PaginatedResponse<Asset>> {
    const searchParams = { ...params, search: query };
    return this.getAssets(searchParams);
  }

  // Get assets by type
  getAssetsByType(assetType: AssetType, params?: Omit<AssetsQueryParams, 'asset_type'>): Observable<PaginatedResponse<Asset>> {
    const typeParams = { ...params, asset_type: assetType };
    return this.getAssets(typeParams);
  }

  // Get assets by status
  getAssetsByStatus(status: AssetStatus, params?: Omit<AssetsQueryParams, 'status'>): Observable<PaginatedResponse<Asset>> {
    const statusParams = { ...params, status };
    return this.getAssets(statusParams);
  }

  // Get assets by location
  getAssetsByLocation(locationId: number, params?: Omit<AssetsQueryParams, 'location_id'>): Observable<PaginatedResponse<Asset>> {
    const locationParams = { ...params, location_id: locationId };
    return this.getAssets(locationParams);
  }

  // Get templates by type
  getTemplatesByType(assetType: AssetType, params?: Omit<TemplatesQueryParams, 'asset_type'>): Observable<PaginatedResponse<AssetTemplate>> {
    const typeParams = { ...params, asset_type: assetType };
    return this.getTemplates(typeParams);
  }

  // Get templates by category
  getTemplatesByCategory(category: TemplateCategory, params?: Omit<TemplatesQueryParams, 'category'>): Observable<PaginatedResponse<AssetTemplate>> {
    const categoryParams = { ...params, category };
    return this.getTemplates(categoryParams);
  }
} 