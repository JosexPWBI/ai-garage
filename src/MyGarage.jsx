import React, { useState } from 'react'

export default function MyGarage({ onBack }) {
  const [selectedBuild, setSelectedBuild] = useState(null)
 const savedBuilds = []
  
  

  if (selectedBuild) {
    return (
      <main className="my-garage">
        <h1>{selectedBuild.year} {selectedBuild.make} {selectedBuild.model}</h1>
        <section>
          <h2>Build Details</h2>
          <p>Build Goal: {selectedBuild.goal}</p>
          <p>Budget: ${selectedBuild.budget.toLocaleString()}</p>
        </section>
        <section>
          <h2>Recommended Build Plan</h2>
        {selectedBuild.recommendations.map((recommendation, index) => (
  <div className="saved-build-card" key={index}>
      <h3>
      {index + 1}. {recommendation.name}
    </h3>

    <p>
      Estimated Budget: ${recommendation.budget.toLocaleString()}
    </p>
    <p>
  {recommendation.reason}
</p>
  </div>
))}
        </section>
        <button type="button" onClick={() => setSelectedBuild(null)}>Back to My Garage</button>
      </main>
    )
  }
  return (
  <main className="my-garage">
    <div className="my-garage-header">
      <div>
        <p className="form-kicker">MY GARAGE</p>
        <h1>Welcome Back to AI Garage</h1>
        <p className="my-garage-subtitle">
          View your saved builds, revisit your plans, or start something new.
        </p>
      </div>

      <button
        type="button"
        className="garage-back-button"
        onClick={onBack}
      >
        Back to AI Garage
      </button>
    </div>

    <section className="garage-section">
      <div className="garage-section-heading">
        <div>
          <p className="form-kicker">SAVED BUILDS</p>
          <h2>Your Builds</h2>
        </div>

        <span className="saved-build-count">
          {savedBuilds.length} Saved
        </span>
      </div>

     <div className="saved-build-grid">
  {savedBuilds.length > 0 ? (
    savedBuilds.map((build) => (
      <div className="saved-build-card" key={build.id}>
        <p className="saved-build-goal">{build.goal}</p>

        <h3>
          {build.year} {build.make} {build.model}
        </h3>

        <p>
          Budget: ${build.budget.toLocaleString()}
        </p>

        <button
          type="button"
          onClick={() => setSelectedBuild(build)}
        >
          View Build
        </button>
      </div>
    ))
  ) : (
    <div className="garage-empty-state">
      <p className="form-kicker">NO SAVED BUILDS YET</p>
      <h3>Your garage is empty.</h3>
      <p>
        Create your first AI Garage build and save it here.
      </p>

      <button
        type="button"
        onClick={onBack}
      >
        Start Your First Build
      </button>
    </div>
  )}
</div>
    </section>

    <section className="garage-section start-build-section">
      <p className="form-kicker">START SOMETHING NEW</p>
      <h2>Ready for Another Build?</h2>
      <p>
        Head back to AI Garage and create a new vehicle plan.
      </p>

      <button
        type="button"
        onClick={onBack}
      >
        Start New Build
      </button>
    </section>

    <section className="garage-section recent-activity">
      <p className="form-kicker">RECENT ACTIVITY</p>
      <h2>Activity</h2>
      <p>
        Your saved-build activity will appear here once account storage is connected.
      </p>
    </section>
  </main>
)
}