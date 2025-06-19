import { Component } from '@angular/core';
import { TagTreeComponent, TagTreeNode } from './components/tag-tree/tag-tree.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-trend',
  imports: [TagTreeComponent  ,JsonPipe],
  templateUrl: './trend.component.html',
  styleUrl: './trend.component.scss'
})
export class TrendComponent {
  // Tag tree data managed by parent component
  tagTreeData: TagTreeNode[] = [
    {
      title: 'Solar Plant 1',
      key: 'plant1',
      author: 'System Admin',
      expanded: true,
      children: [
        { 
          title: 'Inverter 1', 
          key: 'inv1', 
          author: 'System Admin', 
          isLeaf: true 
        },
        { 
          title: 'Inverter 2', 
          key: 'inv2', 
          author: 'System Admin', 
          isLeaf: true 
        }
      ]
    },
    {
      title: 'Solar Plant 2',
      key: 'plant2',
      author: 'System Admin',
      children: [
        { 
          title: 'Inverter 1', 
          key: 'inv3', 
          author: 'System Admin', 
          isLeaf: true 
        }
      ]
    }
  ];

  // Handle changes from child component
  onTagTreeDataChange(newData: TagTreeNode[]): void {
    this.tagTreeData = newData;
    console.log('Tag tree data updated:', newData);
  }

  // Method to add a new plant
  addNewPlant(): void {
    const newPlant: TagTreeNode = {
      title: `Solar Plant ${this.tagTreeData.length + 1}`,
      key: `plant${Date.now()}`,
      author: 'System Admin',
      children: []
    };
    this.tagTreeData = [...this.tagTreeData, newPlant];
  }

  // Method to reset to default data
  resetToDefault(): void {
    this.tagTreeData = [
      {
        title: 'Solar Plant 1',
        key: 'plant1',
        author: 'System Admin',
        expanded: true,
        children: [
          { title: 'Inverter 1', key: 'inv1', author: 'System Admin', isLeaf: true },
          { title: 'Inverter 2', key: 'inv2', author: 'System Admin', isLeaf: true }
        ]
      }
    ];
  }

  // Method to add an inverter to a specific plant
  addInverterToPlant(plantKey: string): void {
    const newData = [...this.tagTreeData];
    const plant = newData.find(p => p.key === plantKey);
    
    if (plant) {
      if (!plant.children) {
        plant.children = [];
      }
      
      const inverterCount = plant.children.length + 1;
      plant.children.push({
        title: `Inverter ${inverterCount}`,
        key: `inv${Date.now()}`,
        author: 'System Admin',
        isLeaf: true
      });
      
      this.tagTreeData = newData;
    }
  }

  // Method to export current tree data
  exportTreeData(): void {
    const dataStr = JSON.stringify(this.tagTreeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tag-tree-data.json';
    link.click();
    URL.revokeObjectURL(url);
  }
}
