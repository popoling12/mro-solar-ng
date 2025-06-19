import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormatEmitEvent, NzTreeModule, NzTreeNode } from 'ng-zorro-antd/tree';
import { LowerCasePipe } from '@angular/common';

export interface TagTreeNode {
  title: string;
  key: string;
  author: string;
  expanded?: boolean;
  isLeaf?: boolean;
  children?: TagTreeNode[];
}

@Component({
  selector: 'app-tag-tree',
  imports: [NzDropDownModule, NzIconModule, NzTreeModule, LowerCasePipe],
  templateUrl: './tag-tree.component.html',
  styleUrl: './tag-tree.component.scss'
})
export class TagTreeComponent {
  @Input() tagTreeData: TagTreeNode[] = [];
  @Output() tagTreeDataChange = new EventEmitter<TagTreeNode[]>();

  activatedNode?: NzTreeNode;

  constructor(private nzContextMenuService: NzContextMenuService) {}

  // Default data if no input is provided
  get nodes(): TagTreeNode[] {
    return this.tagTreeData.length > 0 ? this.tagTreeData : this.defaultNodes;
  }

  private readonly defaultNodes: TagTreeNode[] = [
    {
      title: 'parent 0',
      key: '100',
      author: 'NG ZORRO',
      expanded: true,
      children: [
        { title: 'leaf 0-0', key: '1000', author: 'NG ZORRO', isLeaf: true },
        { title: 'leaf 0-1', key: '1001', author: 'NG ZORRO', isLeaf: true }
      ]
    },
    {
      title: 'parent 1',
      key: '101',
      author: 'NG ZORRO',
      children: [
        { title: 'leaf 1-0', key: '1010', author: 'NG ZORRO', isLeaf: true },
        { title: 'leaf 1-1', key: '1011', author: 'NG ZORRO', isLeaf: true }
      ]
    }
  ];

  // Method to update the tree data and emit changes
  updateTreeData(newData: TagTreeNode[]): void {
    this.tagTreeData = newData;
    this.tagTreeDataChange.emit(newData);
  }

  // Method to add a new node
  addNode(parentKey?: string, newNode?: TagTreeNode): void {
    const newData = [...this.tagTreeData];
    
    if (parentKey) {
      // Add to specific parent
      this.addNodeToParent(newData, parentKey, newNode || this.createDefaultNode());
    } else {
      // Add to root level
      newData.push(newNode || this.createDefaultNode());
    }
    
    this.updateTreeData(newData);
  }

  // Method to remove a node
  removeNode(key: string): void {
    const newData = this.removeNodeFromTree(this.tagTreeData, key);
    this.updateTreeData(newData);
  }

  private createDefaultNode(): TagTreeNode {
    return {
      title: 'New Node',
      key: Date.now().toString(),
      author: 'User',
      isLeaf: true
    };
  }

  private addNodeToParent(nodes: TagTreeNode[], parentKey: string, newNode: TagTreeNode): boolean {
    for (let node of nodes) {
      if (node.key === parentKey) {
        if (!node.children) {
          node.children = [];
        }
        node.children.push(newNode);
        return true;
      }
      if (node.children && this.addNodeToParent(node.children, parentKey, newNode)) {
        return true;
      }
    }
    return false;
  }

  private removeNodeFromTree(nodes: TagTreeNode[], key: string): TagTreeNode[] {
    return nodes.filter(node => {
      if (node.key === key) {
        return false;
      }
      if (node.children) {
        node.children = this.removeNodeFromTree(node.children, key);
      }
      return true;
    });
  }

  // Template event handlers
  activeNode(data: NzFormatEmitEvent): void {
    this.activatedNode = data.node!;
    console.log('Activated node:', data.node?.title);
  }

  openFolder(data: NzFormatEmitEvent | NzTreeNode): void {
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      data.node!.isExpanded = !data.node!.isExpanded;
    }
  }

  contextMenu(event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create(event, menu);
  }

  selectDropdown(): void {
    console.log('Dropdown action selected');
  }
}
