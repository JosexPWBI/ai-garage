import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function MyGarage({ onBack }) {
  const [selectedBuild, setSelectedBuild] = useState(null)
  const [savedBuilds, setSavedBuilds] = useState([])
  const [loadingBuilds, setLoadingBuilds] = useState(true)
  const [garageError, setGarageError] = useState('')

  useEffect(() => {
    async function loadBuilds() {
      setLoadingBuilds(true)
      setGarageError('')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error('Could not get logged-in user:', userError)
      }

      if (user) {
        const {
          data: builds,
          error: buildsError,
        } = await supabase
          .from('Builds')
          .select(
            'id, user_id, year, make, model, goal, budget, recommendations, is_public, created_at'
          )
          .eq('user_id', user.id)
          .order('created_at', {
            ascending: false,
          })

        if (buildsError) {
          console.error(
            'Could not load builds from Supabase:',
            buildsError
          )

          setGarageError(
            `Could not load your garage: ${buildsError.message}`
          )
        } else {
          const formattedBuilds = (builds || []).map((build) => ({
            id: build.id,
            user_id: build.user_id,
            year: build.year,
            make: build.make,
            model: build.model,
            goal: build.goal,
            budget: Number(build.budget || 0),
            recommendations: build.recommendations || [],
            isPublic: build.is_public || false,
            createdAt: build.created_at,
          }))

          setSavedBuilds(formattedBuilds)

          try {
            localStorage.setItem(
              'pwbiSavedBuilds',
              JSON.stringify(formattedBuilds)
            )
          } catch (error) {
            console.error(
              'Could not update local garage backup:',
              error
            )
          }

          setLoadingBuilds(false)
          return
        }
      }

      try {
        const storedBuilds =
          localStorage.getItem('pwbiSavedBuilds')

        const localBuilds = storedBuilds
          ? JSON.parse(storedBuilds)
          : []

        setSavedBuilds(localBuilds)
      } catch (error) {
        console.error(
          'Could not load local saved builds:',
          error
        )

        setSavedBuilds([])
      }

      setLoadingBuilds(false)
    }

    loadBuilds()
  }, [])

  if (selectedBuild) {
    return (
      <main className="my-garage">
        <h1>
          {selectedBuild.year} {selectedBuild.make}{' '}
          {selectedBuild.model}
        </h1>

        <section>
          <h2>Build Details</h2>

          <p>
            Build Goal: {selectedBuild.goal}
          </p>

          <p>
            Budget: $
            {Number(
              selectedBuild.budget || 0
            ).toLocaleString()}
          </p>

          <p>
            Status:{' '}
            {selectedBuild.isPublic
              ? 'Public Build'
              : 'Private Build'}
          </p>
        </section>

        <section>
          <h2>Recommended Build Plan</h2>

          {selectedBuild.recommendations.length > 0 ? (
            selectedBuild.recommendations.map(
              (recommendation, index) => (
                <div
                  className="saved-build-card"
                  key={index}
                >
                  <h3>
                    {index + 1}.{' '}
                    {recommendation.name ||
                      `Recommendation ${index + 1}`}
                  </h3>

                  <p>
                    Estimated Budget: $
                    {Number(
                      recommendation.budget || 0
                    ).toLocaleString()}
                  </p>

                  {recommendation.reason && (
                    <p>{recommendation.reason}</p>
                  )}
                </div>
              )
            )
          ) : (
            <div className="garage-empty-state">
              <p>
                No recommendations were saved with this
                build.
              </p>
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={() => setSelectedBuild(null)}
        >
          Back to My Garage
        </button>
      </main>
    )
  }

  return (
    <main className="my-garage">
      <div className="my-garage-header">
        <div>
          <p className="form-kicker">
            MY GARAGE
          </p>

          <h1>Welcome Back to AI Garage</h1>

          <p className="my-garage-subtitle">
            View your saved builds, revisit your plans,
            or start something new.
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
            <p className="form-kicker">
              SAVED BUILDS
            </p>

            <h2>Your Builds</h2>
          </div>

          <span className="saved-build-count">
            {savedBuilds.length} Saved
          </span>
        </div>

        {garageError && (
          <p className="form-error">
            {garageError}
          </p>
        )}

        {loadingBuilds ? (
          <div className="loading-panel">
            <div className="loading-dot"></div>

            <p>
              Loading your garage...
            </p>
          </div>
        ) : (
          <div className="saved-build-grid">
            {savedBuilds.length > 0 ? (
              savedBuilds.map((build) => (
                <div
                  className="saved-build-card"
                  key={build.id}
                >
                  <p className="saved-build-goal">
                    {build.goal}
                  </p>

                  <h3>
                    {build.year} {build.make}{' '}
                    {build.model}
                  </h3>

                  <p>
                    Budget: $
                    {Number(
                      build.budget || 0
                    ).toLocaleString()}
                  </p>

                  <p>
                    {build.isPublic
                      ? 'Public Build'
                      : 'Private Build'}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedBuild(build)
                    }
                  >
                    View Build
                  </button>
                </div>
              ))
            ) : (
              <div className="garage-empty-state">
                <p className="form-kicker">
                  NO SAVED BUILDS YET
                </p>

                <h3>Your garage is empty.</h3>

                <p>
                  Create your first AI Garage build and
                  save it here.
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
        )}
      </section>

      <section className="garage-section start-build-section">
        <p className="form-kicker">
          START SOMETHING NEW
        </p>

        <h2>Ready for Another Build?</h2>

        <p>
          Head back to AI Garage and create a new vehicle
          plan.
        </p>

        <button
          type="button"
          onClick={onBack}
        >
          Start New Build
        </button>
      </section>

      <section className="garage-section recent-activity">
        <p className="form-kicker">
          RECENT ACTIVITY
        </p>

        <h2>Activity</h2>

        {savedBuilds.length > 0 ? (
          savedBuilds.slice(0, 5).map((build) => (
            <div
              className="member-activity-item"
              key={build.id}
            >
              <span className="activity-dot"></span>

              <p>
                Saved {build.year} {build.make}{' '}
                {build.model} to My Garage.
              </p>
            </div>
          ))
        ) : (
          <p>
            Your saved-build activity will appear here.
          </p>
        )}
      </section>
    </main>
  )
}