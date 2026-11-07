export const originForce = ({
  cells,
  config: { strength = 0.1, xFactor = 1, yFactor = 1, clusterStrength = 0.04 },
  handleEnd,
}) => {
  function force(alpha) {
    // Calculate cluster centroids for photo tag / date clusters
    const clusterCentroids = {}
    const clusterCounts = {}

    for (let i = 0, n = cells.length; i < n; ++i) {
      const cell = cells[i]
      if (cell.clusterId !== undefined) {
        const cid = cell.clusterId
        if (!clusterCentroids[cid]) {
          clusterCentroids[cid] = { x: 0, y: 0 }
          clusterCounts[cid] = 0
        }
        clusterCentroids[cid].x += cell.x
        clusterCentroids[cid].y += cell.y
        clusterCounts[cid]++
      }
    }

    for (const cid in clusterCentroids) {
      const count = clusterCounts[cid]
      if (count > 0) {
        clusterCentroids[cid].x /= count
        clusterCentroids[cid].y /= count
      }
    }

    for (let i = 0, n = cells.length, cell; i < n; ++i) {
      cell = cells[i]
      cell.vx += (cell.ix - cell.x) * strength * alpha * xFactor
      cell.vy += (cell.iy - cell.y) * strength * alpha * yFactor

      // Pull toward shared cluster centroid
      if (cell.clusterId !== undefined && clusterCentroids[cell.clusterId]) {
        const centroid = clusterCentroids[cell.clusterId]
        cell.vx += (centroid.x - cell.x) * clusterStrength * alpha * xFactor
        cell.vy += (centroid.y - cell.y) * clusterStrength * alpha * yFactor
      }

      handleEnd?.(cell)
    }
  }

  return force
}
