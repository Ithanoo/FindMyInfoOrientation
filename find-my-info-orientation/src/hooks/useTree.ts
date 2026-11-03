import { useState, useCallback } from 'react';
import careersData from '../data/careers.json';
import type { CareerNode } from '../types';

// Interface pour l'état de l'arbre
interface TreeState {
  expandedNodes: Set<string>;
  selectedNode: CareerNode | null;
  searchQuery: string;
  highlightedPath: string[];
}

// Interface pour les actions de l'arbre
interface TreeActions {
  toggleNode: (nodeId: string) => void;
  selectNode: (node: CareerNode) => void;
  setSearchQuery: (query: string) => void;
  setHighlightedPath: (path: string[]) => void;
  findNodeById: (id: string) => CareerNode | null;
  getPathToNode: (id: string) => string[];
  getChildren: (nodeId: string) => CareerNode[];
  getParent: (nodeId: string) => CareerNode | null;
}

// Resultat du hook
export interface UseTreeResult extends TreeState, TreeActions {}

// Hook personnalisé pour gérer l'arbre
export function useTree(): UseTreeResult {
  const [treeState, setTreeState] = useState<TreeState>({
    expandedNodes: new Set(),
    selectedNode: null,
    searchQuery: '',
    highlightedPath: []
  });

  // Trouver un nœud par son ID
  const findNodeById = useCallback((id: string): CareerNode | null => {
    const data = careersData as unknown as CareerNode[];
    const findNode = (nodes: CareerNode[]): CareerNode | null => {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findNode(data);
  }, []);

  // Obtenir le chemin vers un nœud
  const getPathToNode = useCallback((id: string): string[] => {
    const data = careersData as unknown as CareerNode[];
    const path: string[] = [];
    
    const findPath = (nodes: CareerNode[], targetId: string): boolean => {
      for (const node of nodes) {
        if (node.id === targetId) {
          path.push(node.id);
          return true;
        }
        if (node.children) {
          if (findPath(node.children, targetId)) {
            path.push(node.id);
            return true;
          }
        }
      }
      return false;
    };

    findPath(data, id);
    return path.reverse();
  }, []);

  // Obtenir les enfants d'un nœud
  const getChildren = useCallback((nodeId: string): CareerNode[] => {
    const data = careersData as unknown as CareerNode[];
    const node = findNodeById(nodeId);
    if (node && node.children) {
      return node.children;
    }
    
    // Si le nœud n'a pas d'enfants directs, chercher dans la structure
    const findChildren = (nodes: CareerNode[], parentId: string): CareerNode[] => {
      const children: CareerNode[] = [];
      for (const node of nodes) {
        if (node.parentId === parentId) {
          children.push(node);
        }
        if (node.children) {
          children.push(...findChildren(node.children, parentId));
        }
      }
      return children;
    };

    return findChildren(data, nodeId);
  }, [findNodeById]);

  // Obtenir le parent d'un nœud
  const getParent = useCallback((nodeId: string): CareerNode | null => {
    const data = careersData as unknown as CareerNode[];
    const findParent = (nodes: CareerNode[]): CareerNode | null => {
      for (const node of nodes) {
        if (node.children) {
          for (const child of node.children) {
            if (child.id === nodeId) {
              return node;
            }
          }
          const found = findParent(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findParent(data);
  }, []);

  // Basculer l'état d'expansion d'un nœud
  const toggleNode = useCallback((nodeId: string) => {
    setTreeState(prev => {
      const newExpanded = new Set(prev.expandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return { ...prev, expandedNodes: newExpanded };
    });
  }, []);

  // Sélectionner un nœud
  const selectNode = useCallback((node: CareerNode) => {
    setTreeState(prev => ({ ...prev, selectedNode: node }));
  }, []);

  // Définir la requête de recherche
  const setSearchQuery = useCallback((query: string) => {
    setTreeState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  // Définir le chemin mis en évidence
  const setHighlightedPath = useCallback((path: string[]) => {
    setTreeState(prev => ({ ...prev, highlightedPath: path }));
  }, []);

  return {
    // État
    expandedNodes: treeState.expandedNodes,
    selectedNode: treeState.selectedNode,
    searchQuery: treeState.searchQuery,
    highlightedPath: treeState.highlightedPath,

    // Actions
    toggleNode,
    selectNode,
    setSearchQuery,
    setHighlightedPath,
    findNodeById,
    getPathToNode,
    getChildren,
    getParent
  };
}

export default useTree;
