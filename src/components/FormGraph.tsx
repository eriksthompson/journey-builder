import React, { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, Background, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { FormNode } from '../types';
import { applyDagreLayout } from '../utils/dagreLayout'; // your dagre layout function

interface FormGraphProps {
  forms: FormNode[];
}

const FormGraph: React.FC<FormGraphProps> = ({ forms }) => {
  // Convert your forms to ReactFlow nodes and edges
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = forms.map((form) => ({
      id: form.id,
      data: { label: form.data.name },
      position: { x: 0, y: 0 }, // positions will be set by dagre
    }));

    const edges: Edge[] = forms.flatMap((form) =>
      (form.dependsOn || []).map((depId) => ({
        id: `e-${depId}-${form.id}`,
        source: depId,
        target: form.id,
        type: 'smoothstep',
      }))
    );

    // Apply dagre layout to position nodes horizontally
    const positionedNodes = applyDagreLayout(nodes, edges);

    return { nodes: positionedNodes, edges };
  }, [forms]);

  return (
    <div style={{ width: '200%', height: '400px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultViewport={{ x: 0, y: 0, zoom: 2 }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FormGraph;
