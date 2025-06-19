# Assets API Usage Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Usage Examples](#basic-usage-examples)
3. [Advanced Usage Patterns](#advanced-usage-patterns)
4. [Error Handling](#error-handling)
5. [Best Practices](#best-practices)
6. [Component Integration](#component-integration)

## Getting Started

### 1. Import the Service and Models

```typescript
import { AssetsService } from '../services/assets.service';
import { 
  Asset, 
  AssetType, 
  AssetStatus, 
  CreateAssetRequest,
  AssetsQueryParams 
} from '../models/assets.model';
```

### 2. Inject the Service

```typescript
constructor(private assetsService: AssetsService) {}
```

## Basic Usage Examples

### 1. Fetching Assets

```typescript
// Get all assets
this.assetsService.getAssets().subscribe({
  next: (response) => {
    console.log('Assets:', response.items);
    console.log('Total:', response.total);
  },
  error: (error) => {
    console.error('Error fetching assets:', error);
  }
});

// Get assets with pagination
const params: AssetsQueryParams = {
  skip: 0,
  limit: 20
};

this.assetsService.getAssets(params).subscribe({
  next: (response) => {
    this.assets = response.items;
    this.totalAssets = response.total;
  }
});
```

### 2. Filtering Assets

```typescript
// Get only active plants
const plantParams: AssetsQueryParams = {
  asset_type: AssetType.PLANT,
  status: AssetStatus.ACTIVE,
  skip: 0,
  limit: 50
};

this.assetsService.getAssets(plantParams).subscribe({
  next: (response) => {
    this.activePlants = response.items;
  }
});

// Get assets by location
this.assetsService.getAssetsByLocation(1).subscribe({
  next: (response) => {
    this.locationAssets = response.items;
  }
});
```

### 3. Creating Assets

```typescript
const newAsset: CreateAssetRequest = {
  template_id: 1,
  name: "Solar Plant Beta",
  code: "PLANT-BETA-001",
  asset_type: AssetType.PLANT,
  status: AssetStatus.ACTIVE,
  location_id: 1,
  installation_date: new Date().toISOString(),
  config: {
    capacity_mw: 10.0,
    grid_connection: "20kV"
  },
  realtime_data_tag: "plant.beta.001"
};

this.assetsService.createAsset(newAsset).subscribe({
  next: (asset) => {
    console.log('Asset created:', asset);
    // Refresh the assets list
    this.loadAssets();
  },
  error: (error) => {
    console.error('Error creating asset:', error);
  }
});
```

### 4. Updating Assets

```typescript
const updateData = {
  status: AssetStatus.MAINTENANCE,
  config: {
    ...this.selectedAsset.config,
    maintenance_note: "Scheduled maintenance"
  }
};

this.assetsService.updateAsset(this.selectedAsset.id, updateData).subscribe({
  next: (updatedAsset) => {
    console.log('Asset updated:', updatedAsset);
    this.selectedAsset = updatedAsset;
  }
});
```

### 5. Deleting Assets

```typescript
this.assetsService.deleteAsset(assetId).subscribe({
  next: () => {
    console.log('Asset deleted successfully');
    // Remove from local array
    this.assets = this.assets.filter(asset => asset.id !== assetId);
  },
  error: (error) => {
    console.error('Error deleting asset:', error);
  }
});
```

## Advanced Usage Patterns

### 1. Asset Hierarchy Management

```typescript
// Get asset hierarchy
this.assetsService.getAssetHierarchy(assetId).subscribe({
  next: (hierarchy) => {
    this.assetTree = hierarchy;
    this.renderAssetTree(hierarchy);
  }
});

// Get asset ancestors
this.assetsService.getAssetAncestors(assetId).subscribe({
  next: (ancestors) => {
    this.breadcrumbPath = ancestors.ancestors;
  }
});
```

### 2. Asset Items Management

```typescript
// Get items for an asset
this.assetsService.getAssetItems(assetId).subscribe({
  next: (items) => {
    this.assetItems = items;
  }
});

// Create new item
const newItem: CreateItemRequest = {
  template_id: 2,
  name: "Solar Panel 001",
  code: "PANEL-001",
  status: AssetStatus.ACTIVE,
  config: {
    wattage: 400,
    position: 1
  }
};

this.assetsService.createAssetItem(assetId, newItem).subscribe({
  next: (item) => {
    this.assetItems.push(item);
  }
});
```

### 3. Asset Sensors Management

```typescript
// Get sensors for an asset
this.assetsService.getAssetSensors(assetId).subscribe({
  next: (sensors) => {
    this.assetSensors = sensors;
  }
});

// Create new sensor
const newSensor: CreateSensorRequest = {
  name: "Temperature Sensor",
  code: "TEMP-001",
  sensor_type: "temperature",
  unit: "°C",
  data_type: "float",
  config: {
    range_min: -40,
    range_max: 85
  }
};

this.assetsService.createAssetSensor(assetId, newSensor).subscribe({
  next: (sensor) => {
    this.assetSensors.push(sensor);
  }
});
```

### 4. Template Management

```typescript
// Get templates by type
this.assetsService.getTemplatesByType(AssetType.PANEL).subscribe({
  next: (response) => {
    this.panelTemplates = response.items;
  }
});

// Create new template
const newTemplate: CreateTemplateRequest = {
  name: "High Efficiency Panel 500W",
  code: "PANEL-500W-HE",
  asset_type: AssetType.PANEL,
  category: TemplateCategory.HARDWARE,
  manufacturer: "SolarTech Pro",
  model_number: "ST-500W-HE",
  description: "High efficiency 500W panel",
  default_config: {
    wattage: 500,
    voltage: 48,
    efficiency: 0.23
  },
  unit_price: 200.00
};

this.assetsService.createTemplate(newTemplate).subscribe({
  next: (template) => {
    this.templates.push(template);
  }
});
```

### 5. Location Management

```typescript
// Get locations hierarchy
this.assetsService.getLocations().subscribe({
  next: (response) => {
    this.locations = this.buildLocationTree(response.items);
  }
});

// Create new location
const newLocation: CreateLocationRequest = {
  name: "Solar Farm East",
  code: "SFE-001",
  description: "Eastern solar farm complex",
  parent_id: 1
};

this.assetsService.createLocation(newLocation).subscribe({
  next: (location) => {
    this.locations.push(location);
  }
});
```

### 6. Inventory Management

```typescript
// Get inventory with filters
const inventoryParams = {
  template_id: 1,
  location_id: 1
};

this.assetsService.getInventory(inventoryParams).subscribe({
  next: (response) => {
    this.inventory = response.items;
  }
});

// Create inventory entry
const newInventory: CreateInventoryRequest = {
  template_id: 1,
  quantity: 100,
  location_id: 1,
  batch_number: "BATCH-2024-001"
};

this.assetsService.createInventory(newInventory).subscribe({
  next: (inventory) => {
    this.inventory.push(inventory);
  }
});
```

## Error Handling

### 1. Global Error Handling

```typescript
// In your component
this.assetsService.getAssets().subscribe({
  next: (response) => {
    this.assets = response.items;
  },
  error: (error) => {
    this.handleApiError(error);
  }
});

private handleApiError(error: any): void {
  let message = 'An error occurred';
  
  if (error.status === 401) {
    message = 'Please log in again';
    this.router.navigate(['/login']);
  } else if (error.status === 403) {
    message = 'You do not have permission to perform this action';
  } else if (error.status === 404) {
    message = 'The requested resource was not found';
  } else if (error.status === 400) {
    message = error.message || 'Invalid request';
  } else if (error.status >= 500) {
    message = 'Server error. Please try again later';
  }
  
  this.showErrorNotification(message);
}
```

### 2. Form Validation Error Handling

```typescript
this.assetsService.createAsset(assetData).subscribe({
  next: (asset) => {
    this.showSuccessNotification('Asset created successfully');
    this.resetForm();
  },
  error: (error) => {
    if (error.status === 422) {
      // Validation errors
      this.handleValidationErrors(error.error.detail);
    } else {
      this.handleApiError(error);
    }
  }
});

private handleValidationErrors(errors: any[]): void {
  errors.forEach(error => {
    const field = error.loc[error.loc.length - 1];
    const message = error.msg;
    
    // Set form field error
    this.form.get(field)?.setErrors({ 
      serverError: message 
    });
  });
}
```

## Best Practices

### 1. Loading States

```typescript
export class AssetsComponent {
  assets: Asset[] = [];
  loading = false;
  error: string | null = null;

  loadAssets(): void {
    this.loading = true;
    this.error = null;

    this.assetsService.getAssets().subscribe({
      next: (response) => {
        this.assets = response.items;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
```

### 2. Caching

```typescript
export class AssetsComponent {
  private assetsCache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  getAssetsWithCache(params?: AssetsQueryParams): Observable<PaginatedResponse<Asset>> {
    const cacheKey = JSON.stringify(params);
    const cached = this.assetsCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return of(cached.data);
    }

    return this.assetsService.getAssets(params).pipe(
      tap(response => {
        this.assetsCache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
      })
    );
  }
}
```

### 3. Pagination Helper

```typescript
export class PaginatedAssetsComponent {
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;
  assets: Asset[] = [];

  loadPage(page: number): void {
    this.currentPage = page;
    const skip = (page - 1) * this.pageSize;
    
    const params: AssetsQueryParams = {
      skip,
      limit: this.pageSize
    };

    this.assetsService.getAssets(params).subscribe({
      next: (response) => {
        this.assets = response.items;
        this.totalItems = response.total;
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
```

### 4. Search with Debounce

```typescript
export class SearchableAssetsComponent {
  private searchSubject = new Subject<string>();
  assets: Asset[] = [];

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.assetsService.searchAssets(query))
    ).subscribe({
      next: (response) => {
        this.assets = response.items;
      }
    });
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }
}
```

## Component Integration

### 1. Asset List Component

```typescript
@Component({
  selector: 'app-asset-list',
  template: `
    <div class="asset-list">
      <div class="filters">
        <select [(ngModel)]="selectedType" (change)="onTypeChange()">
          <option value="">All Types</option>
          <option *ngFor="let type of assetTypes" [value]="type">
            {{type | titlecase}}
          </option>
        </select>
        
        <select [(ngModel)]="selectedStatus" (change)="onStatusChange()">
          <option value="">All Statuses</option>
          <option *ngFor="let status of assetStatuses" [value]="status">
            {{status | titlecase}}
          </option>
        </select>
      </div>

      <div class="assets-grid" *ngIf="!loading; else loadingTpl">
        <div *ngFor="let asset of assets" class="asset-card" 
             (click)="selectAsset(asset)">
          <h3>{{asset.name}}</h3>
          <p>{{asset.code}}</p>
          <span class="status" [class]="asset.status">
            {{asset.status}}
          </span>
        </div>
      </div>

      <ng-template #loadingTpl>
        <div class="loading">Loading assets...</div>
      </ng-template>

      <div class="pagination" *ngIf="totalPages > 1">
        <button [disabled]="currentPage === 1" 
                (click)="loadPage(currentPage - 1)">
          Previous
        </button>
        <span>{{currentPage}} / {{totalPages}}</span>
        <button [disabled]="currentPage === totalPages" 
                (click)="loadPage(currentPage + 1)">
          Next
        </button>
      </div>
    </div>
  `
})
export class AssetListComponent {
  assets: Asset[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 0;
  selectedType = '';
  selectedStatus = '';

  assetTypes = this.assetsService.getAssetTypes();
  assetStatuses = this.assetsService.getAssetStatuses();

  constructor(private assetsService: AssetsService) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.loading = true;
    
    const params: AssetsQueryParams = {
      skip: (this.currentPage - 1) * 20,
      limit: 20,
      asset_type: this.selectedType || undefined,
      status: this.selectedStatus || undefined
    };

    this.assetsService.getAssets(params).subscribe({
      next: (response) => {
        this.assets = response.items;
        this.totalPages = Math.ceil(response.total / 20);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading assets:', error);
        this.loading = false;
      }
    });
  }

  onTypeChange(): void {
    this.currentPage = 1;
    this.loadAssets();
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.loadAssets();
  }

  loadPage(page: number): void {
    this.currentPage = page;
    this.loadAssets();
  }

  selectAsset(asset: Asset): void {
    // Emit event or navigate to detail page
  }
}
```

### 2. Asset Form Component

```typescript
@Component({
  selector: 'app-asset-form',
  template: `
    <form [formGroup]="assetForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" type="text" formControlName="name">
        <div class="error" *ngIf="assetForm.get('name')?.errors?.serverError">
          {{assetForm.get('name')?.errors?.serverError}}
        </div>
      </div>

      <div class="form-group">
        <label for="code">Code</label>
        <input id="code" type="text" formControlName="code">
      </div>

      <div class="form-group">
        <label for="template">Template</label>
        <select id="template" formControlName="template_id">
          <option value="">Select Template</option>
          <option *ngFor="let template of templates" 
                  [value]="template.id">
            {{template.name}}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="type">Type</label>
        <select id="type" formControlName="asset_type">
          <option value="">Select Type</option>
          <option *ngFor="let type of assetTypes" [value]="type">
            {{type | titlecase}}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" formControlName="status">
          <option value="">Select Status</option>
          <option *ngFor="let status of assetStatuses" [value]="status">
            {{status | titlecase}}
          </option>
        </select>
      </div>

      <button type="submit" [disabled]="assetForm.invalid || loading">
        {{loading ? 'Creating...' : 'Create Asset'}}
      </button>
    </form>
  `
})
export class AssetFormComponent {
  assetForm: FormGroup;
  loading = false;
  templates: AssetTemplate[] = [];
  assetTypes = this.assetsService.getAssetTypes();
  assetStatuses = this.assetsService.getAssetStatuses();

  constructor(
    private fb: FormBuilder,
    private assetsService: AssetsService
  ) {
    this.initForm();
    this.loadTemplates();
  }

  private initForm(): void {
    this.assetForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      template_id: ['', Validators.required],
      asset_type: ['', Validators.required],
      status: [AssetStatus.ACTIVE, Validators.required],
      location_id: [''],
      installation_date: [''],
      config: this.fb.group({}),
      realtime_data_tag: ['']
    });
  }

  private loadTemplates(): void {
    this.assetsService.getTemplates().subscribe({
      next: (response) => {
        this.templates = response.items;
      }
    });
  }

  onSubmit(): void {
    if (this.assetForm.valid) {
      this.loading = true;
      
      this.assetsService.createAsset(this.assetForm.value).subscribe({
        next: (asset) => {
          this.loading = false;
          // Emit success event or navigate
        },
        error: (error) => {
          this.loading = false;
          this.handleFormError(error);
        }
      });
    }
  }

  private handleFormError(error: any): void {
    if (error.status === 422) {
      error.error.detail.forEach((err: any) => {
        const field = err.loc[err.loc.length - 1];
        this.assetForm.get(field)?.setErrors({ 
          serverError: err.msg 
        });
      });
    }
  }
}
```

This comprehensive usage guide provides practical examples and best practices for integrating the Assets API into your Angular application. The examples cover common use cases and demonstrate proper error handling, loading states, and component integration patterns. 