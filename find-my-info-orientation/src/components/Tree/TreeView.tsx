import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import type { CareerNode } from '../../types';
import careersData from '../../data/careers.json';
import { useAppContext } from '../../context/AppContext';

export default function TreeView() {
  const navigate = useNavigate();
  const { } = useAppContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<any>(null);
  const gRef = useRef<SVGGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger les dimensions du conteneur
  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  // Initialiser D3 et créer la structure de base
  useEffect(() => {
    if (!svgRef.current || !dimensions.width || !dimensions.height) return;

    // Nettoyer le SVG existant
    d3.select(svgRef.current).selectAll("*").remove();

    // Créer le groupe principal
    const svg = d3.select(svgRef.current);
    const g = svg.append("g")
      .attr("transform", `translate(${dimensions.width / 2}, 50)`);
    
    gRef.current = g.node();

    // Initialiser le zoom
    zoomRef.current = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event: any) => {
        if (gRef.current) {
          d3.select(gRef.current).attr("transform", event.transform);
        }
      });

    svg.call(zoomRef.current as any);

    // Marquer comme initialisé
    setIsInitialized(true);

    // Réinitialiser le zoom
    svg.transition()
      .duration(300)
      .call(zoomRef.current.transform as any, d3.zoomIdentity);

    // Cleanup
    return () => {
      if (zoomRef.current) {
        svg.on(".zoom", null);
      }
    };
  }, [dimensions]);

  // Mettre à jour l'arbre quand les données changent
  useEffect(() => {
    if (!isInitialized || !gRef.current || !dimensions.width || !dimensions.height) return;

    const rawData = careersData as unknown as { name: string; description?: string; emoji?: string; children: CareerNode[] };
    if (!rawData || !rawData.children || rawData.children.length === 0) return;

    // Nettoyer les éléments existants dans g
    d3.select(gRef.current).selectAll("*").remove();

    // Créer la hiérarchie - le nœud racine doit avoir un id
    const rootData: CareerNode = {
      id: 'root',
      name: rawData.name,
      description: rawData.description || '',
      emoji: rawData.emoji || '🌳',
      children: rawData.children
    };
    const root = d3.hierarchy<CareerNode>(rootData as any);
    const treeLayout = d3.tree<CareerNode>().size([dimensions.height - 150, dimensions.width - 150]);
    const rootNode = treeLayout(root);

    // Définir les générateurs de liens
    const linkGenerator = d3.linkVertical<{ source: { x: number; y: number }; target: { x: number; y: number } }, any>()
      .x((d: any) => d.x)
      .y((d: any) => d.y);

    const g = d3.select(gRef.current);

    // Dessiner les liens
    g.selectAll(".link")
      .data(rootNode.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", linkGenerator as any)
      .attr("fill", "none")
      .attr("stroke", (d: any) => {
        const depth = d.source.depth;
        if (depth === 0) return '#6bb6ff';
        if (depth === 1) return '#ffd700';
        if (d.depth === 2) return '#4ade80';
        return '#a855f7';
      })
      .attr("stroke-width", (d: any) => {
        const depth = d.source.depth;
        if (depth === 0) return 3;
        if (depth === 1) return 2;
        return 1;
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-dasharray", (d: any) => {
        return expandedNodes.has(d.source.data.id) ? "0" : "5,5";
      });

    // Dessiner les nœuds
    const nodeGroups = g.selectAll(".node")
      .data(rootNode.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

    // Ajouter les cercles pour les nœuds
    nodeGroups.append("circle")
      .attr("r", (d: any) => {
        if (d.depth === 0) return 20;
        if (d.depth === 1) return 15;
        if (d.depth === 2) return 12;
        return 10;
      })
      .attr("fill", (d: any) => {
        if (d.depth === 0) return '#6bb6ff';
        if (d.depth === 1) return '#ffd700';
        if (d.depth === 2) return '#4ade80';
        return '#a855f7';
      })
      .attr("stroke", (d: any) => {
        if (d.depth === 0) return '#ffffff';
        if (d.depth === 1) return '#ffd700';
        if (d.depth === 2) return '#4ade80';
        return '#a855f7';
      })
      .attr("stroke-width", (d: any) => {
        if (d.depth === 0) return 3;
        if (d.depth === 1) return 2;
        return 1;
      })
      .attr("cursor", "pointer")
      .attr("class", "node-circle");

    // Ajouter les icônes pour les nœuds
    nodeGroups.append("text")
      .attr("dy", (d: any) => {
        if (d.depth === 0) return -25;
        if (d.depth === 1) return -20;
        return -15;
      })
      .attr("text-anchor", "middle")
      .text((d: any) => d.data.icon || d.data.emoji || '⭐')
      .attr("font-size", (d: any) => {
        if (d.depth === 0) return '24px';
        if (d.depth === 1) return '20px';
        return '16px';
      })
      .attr("fill", (d: any) => {
        if (d.depth === 0) return '#ffffff';
        if (d.depth === 1) return '#ffd700';
        if (d.depth === 2) return '#4ade80';
        return '#a855f7';
      })
      .attr("cursor", "pointer");

    // Ajouter les étiquettes de texte
    nodeGroups.append("text")
      .attr("dy", (d: any) => {
        if (d.depth === 0) return 25;
        if (d.depth === 1) return 20;
        return 15;
      })
      .attr("text-anchor", "middle")
      .text((d: any) => d.data.name)
      .attr("font-size", (d: any) => {
        if (d.depth === 0) return '16px';
        if (d.depth === 1) return '14px';
        if (d.depth === 2) return '12px';
        return '10px';
      })
      .attr("fill", (d: any) => {
        if (d.depth === 0) return '#ffffff';
        return '#e5e7eb';
      })
      .attr("cursor", "pointer")
      .attr("class", "node-label");

    // Ajouter des infobulles
    nodeGroups.append("title")
      .text((d: any) => {
        let text = `${d.data.name}`;
        if (d.data.domain) text += ` (${d.data.domain})`;
        if (d.data.description) text += `: ${d.data.description.substring(0, 100)}...`;
        return text;
      });

    // Ajouter les interactions
    nodeGroups
      .on("click", (event: MouseEvent, _d: any) => {
        event.stopPropagation();
        handleNodeClick(_d.data);
      })
      .on("mouseenter", function(this: any, _event: MouseEvent, d: any) {
        handleNodeMouseEnter(this, d);
      })
      .on("mouseleave", function(this: any, _event: MouseEvent, d: any) {
        handleNodeMouseLeave(this, d);
      });

    // Centrer l'arbre
    const bbox = g.node()?.getBBox();
    if (bbox) {
      g.attr("transform", `translate(${(dimensions.width - bbox.width) / 2}, 50)`);
    }

  }, [dimensions, expandedNodes, isInitialized]);

  // Gérer le clic sur un nœud
  const handleNodeClick = useCallback((node: CareerNode) => {
    const hasChildren = node.children && node.children.length > 0;
    
    if (hasChildren) {
      setExpandedNodes(prev => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(node.id)) {
          newExpanded.delete(node.id);
        } else {
          newExpanded.add(node.id);
        }
        return newExpanded;
      });
    }

    setSelectedNode(node);

    if (!hasChildren) {
      navigate(`/career/${node.id}`);
    }
  }, [navigate]);

  // Gérer le survol de la souris
  const handleNodeMouseEnter = useCallback((nodeElement: Element, d: any) => {
    try {
      d3.select(nodeElement).select("circle")
        .attr("r", (dd: any) => {
          if (dd.depth === 0) return 25;
          if (dd.depth === 1) return 20;
          if (dd.depth === 2) return 17;
          return 15;
        })
        .attr("stroke-width", 3)
        .attr("stroke", "#ffffff");

      const currentNodeId = d.data.id;
      d3.selectAll(".link")
        .filter((link: any) => link.source.data.id === currentNodeId || link.target.data.id === currentNodeId)
        .attr("stroke-opacity", 1)
        .attr("stroke-width", (link: any) => {
          if (link.source.depth === 0) return 4;
          if (link.source.depth === 1) return 3;
          return 2;
        });
    } catch (e) {
      console.error("Error in handleNodeMouseEnter:", e);
    }
  }, []);

  // Gérer la sortie de la souris
  const handleNodeMouseLeave = useCallback((nodeElement: Element, _d: any) => {
    try {
      d3.select(nodeElement).select("circle")
        .attr("r", (dd: any) => {
          if (dd.depth === 0) return 20;
          if (dd.depth === 1) return 15;
          if (dd.depth === 2) return 12;
          return 10;
        })
        .attr("stroke-width", (dd: any) => {
          if (dd.depth === 0) return 3;
          if (dd.depth === 1) return 2;
          return 1;
        })
        .attr("stroke", (dd: any) => {
          if (dd.depth === 0) return '#ffffff';
          if (dd.depth === 1) return '#ffd700';
          if (dd.depth === 2) return '#4ade80';
          return '#a855f7';
        });

      d3.selectAll(".link")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", (link: any) => {
          if (link.source.depth === 0) return 3;
          if (link.source.depth === 1) return 2;
          return 1;
        });
    } catch (e) {
      console.error("Error in handleNodeMouseLeave:", e);
    }
  }, []);

  // Réinitialiser le zoom
  const resetZoom = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomRef.current.transform as any, d3.zoomIdentity);
    }
  }, []);

  // Zoom avant
  const zoomIn = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      const currentTransform = d3.zoomTransform(svg.node() as SVGElement);
      svg.transition()
        .duration(200)
        .call(
          zoomRef.current.transform as any,
          d3.zoomIdentity.scale(currentTransform.k * 1.2)
            .translate(currentTransform.x, currentTransform.y)
        );
    }
  }, []);

  // Zoom arrière
  const zoomOut = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      const currentTransform = d3.zoomTransform(svg.node() as SVGElement);
      svg.transition()
        .duration(200)
        .call(
          zoomRef.current.transform as any,
          d3.zoomIdentity.scale(currentTransform.k * 0.8)
            .translate(currentTransform.x, currentTransform.y)
        );
    }
  }, []);

  // Rendu
  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-primary-900"
    >
      {/* Contrôles de zoom */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        <button
          onClick={zoomIn}
          className="p-2 bg-primary-800/50 rounded-lg border border-primary-700/30 text-white hover:bg-primary-800/80 transition-colors"
          title="Zoom avant"
        >
          <span>+</span>
        </button>
        <button
          onClick={zoomOut}
          className="p-2 bg-primary-800/50 rounded-lg border border-primary-700/30 text-white hover:bg-primary-800/80 transition-colors"
          title="Zoom arrière"
        >
          <span>-</span>
        </button>
        <button
          onClick={resetZoom}
          className="p-2 bg-primary-800/50 rounded-lg border border-primary-700/30 text-white hover:bg-primary-800/80 transition-colors"
          title="Réinitialiser le zoom"
        >
          <span>↻</span>
        </button>
      </div>

      {/* SVG pour l'arbre */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Légende */}
      <div className="absolute bottom-4 left-4 z-10 bg-primary-800/80 backdrop-blur-lg rounded-xl p-4 border border-primary-700/30">
        <h4 className="text-white font-semibold mb-2">Légende</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#6bb6ff]"></div>
            <span className="text-text-secondary text-sm">Domaines principaux</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ffd700]"></div>
            <span className="text-text-secondary text-sm">Sous-domaines</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#4ade80]"></div>
            <span className="text-text-secondary text-sm">Spécialisations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#a855f7]"></div>
            <span className="text-text-secondary text-sm">Autres</span>
          </div>
        </div>
      </div>

      {/* Info sur le nœud sélectionné */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 bg-primary-800/80 backdrop-blur-lg rounded-xl p-4 border border-primary-700/30 max-w-xs">
          <div className="flex items-start space-x-2 mb-2">
            <span className="text-2xl">{selectedNode.icon || selectedNode.emoji || '⭐'}</span>
            <div>
              <h4 className="text-white font-semibold">{selectedNode.name}</h4>
              {selectedNode.domain && (
                <p className="text-text-secondary text-sm">{selectedNode.domain}</p>
              )}
            </div>
          </div>
          {selectedNode.shortDescription && (
            <p className="text-text-secondary text-sm">
              {selectedNode.shortDescription.substring(0, 100)}{selectedNode.shortDescription.length > 100 ? '...' : ''}
            </p>
          )}
          {selectedNode.children && selectedNode.children.length > 0 && (
            <p className="text-text-tertiary text-xs mt-2">
              {selectedNode.children.length} sous-domaines
            </p>
          )}
          <button
            onClick={() => {
              if (!selectedNode.children || selectedNode.children.length === 0) {
                navigate(`/career/${selectedNode.id}`);
              }
            }}
            className="mt-3 w-full px-4 py-2 bg-accent-ice/10 text-accent-ice rounded-lg hover:bg-accent-ice/20 transition-colors text-sm"
          >
            Voir les détails
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-10 bg-primary-800/80 backdrop-blur-lg rounded-xl p-4 border border-primary-700/30">
        <h4 className="text-white font-semibold mb-2">Conseils</h4>
        <ul className="space-y-1 text-text-secondary text-sm">
          <li>• Cliquez sur un nœud pour l'expander</li>
          <li>• Survolez pour voir les détails</li>
          <li>• Utilisez la molette ou les boutons pour zoomer</li>
        </ul>
      </div>

      {/* Chargement */}
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-900/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🌀</div>
            <p className="text-white">Chargement de l'arbre...</p>
          </div>
        </div>
      )}
    </div>
  );
}
