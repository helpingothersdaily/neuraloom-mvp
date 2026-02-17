// src/components/Tree.tsx

export interface TreeNode {
  label: string;
  link?: string;
  children?: TreeNode[];
}

export default function Tree({ node }: { node: TreeNode }) {
  return (
    <div className="tree">
      <TreeNodeView node={node} isRoot />
    </div>
  );
}

function TreeNodeView({ node, isRoot = false }: { node: TreeNode; isRoot?: boolean }) {
  return (
    <div className="tree-node">
      <div className={`tree-label ${isRoot ? "root" : ""}`}>
        {node.link ? <a href={node.link}>{node.label}</a> : node.label}
      </div>

      {node.children && node.children.length > 0 && (
        <div className="tree-children">
          {node.children.map((child, i) => (
            <TreeNodeView key={i} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
