import './BuildProgress.css'

export default function BuildProgress({ recommendations, budget, goal }) {
  const buildBudget = Number(budget) || 0

  // Calculate budget allocation
  const totalRecommendedBudget = recommendations.reduce((sum, rec) => {
    const recBudget = buildBudget * ((rec.percent || 0) / 100)
    return sum + recBudget
  }, 0)
  const budgetAllocationPercent = buildBudget > 0 ? Math.round((totalRecommendedBudget / buildBudget) * 100) : 0

  // Calculate goal coverage based on recommendation count and priority
  // Each recommendation represents a portion of goal completion
  const maxRecommendations = 4 // Standard recommendation count
  const goalCoveragePercent = Math.min(100, Math.round((recommendations.length / maxRecommendations) * 100))

  return (
    <div className="build-progress">
      <div className="progress-item">
        <div className="progress-label">
          <span className="progress-title">Budget Allocation</span>
          <span className="progress-percent">{budgetAllocationPercent}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill budget-fill"
            style={{ width: `${Math.min(budgetAllocationPercent, 100)}%` }}
          />
        </div>
        <div className="progress-detail">
          ${totalRecommendedBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })} of ${buildBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })} budget allocated
        </div>
      </div>

      <div className="progress-item">
        <div className="progress-label">
          <span className="progress-title">Goal Coverage</span>
          <span className="progress-percent">{goalCoveragePercent}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill goal-fill"
            style={{ width: `${goalCoveragePercent}%` }}
          />
        </div>
        <div className="progress-detail">
          {recommendations.length} of {maxRecommendations} priority upgrades for {goal}
        </div>
      </div>
    </div>
  )
}
