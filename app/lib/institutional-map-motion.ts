import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from 'd3-force'

export type MotionTarget = { id: string; position: { x: number; y: number } }
export type MotionPoint = SimulationNodeDatum & { id: string; x: number; y: number; targetX: number; targetY: number }

// Layout springs are presentation only: neither force nor distance encodes research.
// D3 receives fresh objects; canonical research and React nodes are never mutated.
export function createInstitutionMotion(
  targets: MotionTarget[],
  edges: { source: string; target: string }[],
  previous: Map<string, { x: number; y: number; vx?: number; vy?: number }>,
  direction: number,
  height: number,
) {
  const nodes: MotionPoint[] = targets.map(({ id, position }) => {
    const prior = previous.get(id)
    return { id, x: prior?.x ?? position.x, y: prior?.y ?? position.y + direction * Math.max(180, height * .65),
      vx: prior?.vx ?? 0, vy: prior?.vy ?? -direction * 2,
      targetX: position.x, targetY: position.y }
  })
  const ids = new Set(nodes.map(n => n.id))
  const links = edges.filter(e => ids.has(e.source) && ids.has(e.target)).map(e => ({ ...e }))
  const simulation = forceSimulation(nodes).stop()
    .alphaDecay(.055).velocityDecay(.27)
    .force('x', forceX<MotionPoint>(n => n.targetX).strength(.10))
    .force('y', forceY<MotionPoint>(n => n.targetY).strength(.12))
    .force('separation', forceManyBody<MotionPoint>().strength(-95).distanceMax(230))
    .force('collision', forceCollide<MotionPoint>(34).iterations(2))
    .force('connections', forceLink<MotionPoint, { source: string; target: string }>(links).id(n => n.id).distance(190).strength(.025))
  return { nodes, simulation }
}

// Hidden responsive copies measure 0 × 0. Never send that geometry to the camera.
export function institutionViewport(
  size: { width: number; height: number },
  graph: { width: number; height: number; focusX: number },
) {
  if (![size.width, size.height, graph.width, graph.height, graph.focusX].every(Number.isFinite)
    || size.width <= 20 || size.height <= 32 || graph.width <= 0 || graph.height <= 0) return null
  const zoom = Math.max(.1, Math.min(1.1, (size.width - 20) / graph.width, (size.height - 32) / graph.height))
  return { x: (size.width - graph.width * zoom) / 2 - graph.focusX * zoom,
    y: (size.height - graph.height * zoom) / 2, zoom }
}

// Presence and physics share a clock, so interrupted animations cannot leave opacity at zero.
export function institutionPresence(elapsed: number) {
  const t = Math.max(0, Math.min(1, elapsed / 700))
  return 1 - (1 - t) ** 3
}
