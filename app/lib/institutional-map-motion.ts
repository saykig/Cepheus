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
    .alphaDecay(.065).velocityDecay(.36)
    .force('x', forceX<MotionPoint>(n => n.targetX).strength(.24))
    .force('y', forceY<MotionPoint>(n => n.targetY).strength(.3))
    .force('separation', forceManyBody<MotionPoint>().strength(-95).distanceMax(230))
    .force('collision', forceCollide<MotionPoint>(34).iterations(2))
    .force('connections', forceLink<MotionPoint, { source: string; target: string }>(links).id(n => n.id).distance(190).strength(.025))
  return { nodes, simulation }
}
