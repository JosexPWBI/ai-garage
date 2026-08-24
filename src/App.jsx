import { useState } from 'react'
import './App.css'
import vehicleData from './VehicleData'

function App() {
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [goal, setGoal] = useState('Daily Driver')
  const [budget, setBudget] = useState('')
  const [photo, setPhoto] = useState(null)
  const [showBuild, setShowBuild] = useState(false)
const [error, setError] = useState('')
const [aiAdvice, setAiAdvice] = useState('')
const currentVehicleKey = `${make} ${model}`.trim().toLowerCase()
const [loading, setLoading] = useState(false)
const currentVehicleProfile = vehicleData[currentVehicleKey]
 function handlePhotoChange(e) {
  const file = e.target.files[0]

  setError('')

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    setError('Please upload a valid image file.')
    e.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    setError('Please upload an image smaller than 5 MB.')
    e.target.value = ''
    return
  }

  if (photo) {
    URL.revokeObjectURL(photo)
  }

  setPhoto(URL.createObjectURL(file))
}

   function getRecommendations() {
  const buildBudget = Number(budget) || 0
  const vehicleKey = `${make} ${model}`.trim().toLowerCase()
const vehicleProfile = vehicleData[vehicleKey]
const vehicleYear = Number(year)

const yearMatches =
  !vehicleProfile?.years ||
  (vehicleYear >= vehicleProfile.years.start &&
    vehicleYear <= vehicleProfile.years.end)
console.log('vehicleKey:', vehicleKey, 'vehicleProfile:', vehicleProfile)
if (vehicleProfile && yearMatches && vehicleProfile.priorities[goal]) {
  const priorityPercents = [35, 30, 20, 15]

  return vehicleProfile.priorities[goal].map((upgrade, index) => ({
    name: upgrade,
    percent: priorityPercents[index],
    reason: `Recommended specifically for the ${vehicleProfile.make} ${vehicleProfile.model}, a ${vehicleProfile.category} platform.`,
  }))
  }
  if (!vehicleProfile) {
  console.log(`No vehicle-specific profile found for: ${vehicleKey}`)
}
  if (goal === 'Track') {
    return [
      { name: 'Track-focused suspension setup', percent: 30 },
      { name: 'Performance brake upgrade', percent: 25 },
      { name: 'High-grip performance tires', percent: 25 },
      { name: 'Cooling and reliability upgrades', percent: 12 },
      { name: 'Lightweight performance parts', percent: 8 },
    ]
  }
if (goal === 'Street Performance') {
  return [
    {
      name: 'Sport suspension upgrade',
      percent: 25,
      reason: 'Improves handling response while keeping the car comfortable enough for regular street driving.',
    },
    {
      name: 'Performance wheels and tires',
      percent: 30,
      reason: 'Adds grip, sharper steering feel, and a more aggressive street-performance look.',
    },
    {
      name: 'Brake upgrade',
      percent: 15,
      reason: 'Provides stronger and more consistent braking to match the added performance.',
    },
    {
      name: 'Intake, exhaust, and tune',
      percent: 20,
      reason: 'Improves throttle response, sound, and power without turning the car into a dedicated track build.',
    },
    {
      name: 'Exterior styling upgrades',
      percent: 10,
      reason: 'Adds subtle visual upgrades that complement the performance-focused setup.',
    },
  ]
}

if (goal === 'Show Car') {
  return [
    {
      name: 'Premium wheels and fitment',
      percent: 30,
      reason: 'Improves stance, visual impact, and overall show-car presence.',
    },
    {
      name: 'Lowering suspension or air ride',
      percent: 25,
      reason: 'Creates a more aggressive stance and gives the car a lower, cleaner profile.',
    },
    {
      name: 'Exterior aero and body styling',
      percent: 20,
      reason: 'Adds visual character through splitters, spoilers, side skirts, or other body enhancements.',
    },
    {
      name: 'Lighting and visual upgrades',
      percent: 10,
      reason: 'Upgraded lighting can modernize the look and add more visual impact at shows or meets.',
    },
    {
      name: 'Interior appearance upgrades',
      percent: 15,
      reason: 'Improves the cabin with cosmetic touches that make the overall build feel more complete.',
    },
  ]
}
if (goal === 'Daily Driver') {
  return [
    {
      name: 'Maintenance and reliability refresh',
      percent: 30,
      reason: 'Keeps the vehicle dependable by prioritizing fluids, filters, worn components, and preventative maintenance.',
    },
    {
      name: 'Quality all-season or touring tires',
      percent: 25,
      reason: 'Improves everyday grip, ride quality, wet-weather safety, and predictable handling.',
    },
    {
      name: 'Brake pads, rotors, and fluid',
      percent: 20,
      reason: 'Improves stopping performance and reliability without sacrificing daily drivability.',
    },
    {
      name: 'Comfort and suspension refresh',
      percent: 15,
      reason: 'Replaces worn suspension components and improves ride quality for everyday driving.',
    },
      {
      name: 'Practical appearance upgrades',
      percent: 10,
      reason: 'Leaves room for tasteful cosmetic improvements after reliability and safety are handled.',
    },
  ]
}
}

async function handleBuild() {
  setError('')
  setShowBuild(false)
  setAiAdvice('')

  if (!year.trim() || !make.trim() || !model.trim()) {
    setError('Please enter the year, make, and model of your vehicle.')
    return
  }

  if (!goal) {
    setError('Please choose a build goal.')
    return
  }

  if (!budget || Number(budget) <= 0) {
    setError('Please enter a valid build budget.')
    return
  }

  setLoading(true)

  try {
const response = await fetch('https://ai-garage-api.onrender.com/api/garage-advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year,
        make,
        model,
        goal,
        budget: Number(budget),
      }),
    })

    if (!response.ok) {
      throw new Error('AI Garage request failed.')
    }

    const data = await response.json()

    setAiAdvice(data.advice)
    setLoading(false)
    setShowBuild(true)
  } catch (err) {
    console.error(err)
    setLoading(false)
    setError('Could not connect to the AI Garage advisor.')
  }
}
const recommendations = getRecommendations()
  const buildBudget = Number(budget) || 0

  return (
    <main className="garage">
      <section className="hero">
  <p className="eyebrow">PWBI INNOVATION LAB</p>

  <h1>AI Garage</h1>

  <p className="hero-tagline">
    Build smarter. Build your way.
  </p>

  <p className="subtitle">
    Upload your ride, choose your goal, set your budget, and let AI Garage create a practical build plan tailored to your vehicle.
  </p>

  <p className="powered-by">
    Powered by Project: We Built It
  </p>

        <div className="garage-card">
  <div className="form-heading">
    <p className="form-kicker">BUILD CONFIGURATOR</p>
    <h2>Start Your Build</h2>
    <p className="form-intro">
      Tell AI Garage what you drive, what you want from it, and what you want to spend.
    </p>
  </div>

  <div className="photo-upload">
    <label>
      Vehicle Photo
      <span className="field-help">Optional — upload a photo of your ride.</span>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
      />
    </label>
  </div>

  {photo && (
    <img
      src={photo}
      alt="Uploaded vehicle"
      className="vehicle-preview"
    />
  )}

  <div className="vehicle-grid">
    <label>
      Year
      <input
        type="text"
        placeholder="2020"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
    </label>

    <label>
      Make
      <input
        type="text"
        placeholder="Ford"
        value={make}
        onChange={(e) => setMake(e.target.value)}
      />
    </label>

    <label>
      Model
      <input
        type="text"
        placeholder="Mustang"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />
    </label>
  </div>

  <div className="build-options-grid">
    <label>
      Build Goal
      <select
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      >
        <option>Daily Driver</option>
        <option>Street Performance</option>
        <option>Track</option>
        <option>Show Car</option>
      </select>
    </label>

    <label>
      Build Budget
      <div className="budget-field">
        <span className="budget-symbol">$</span>
        <input
          type="number"
          placeholder="5000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>
    </label>
  </div>

  <button
    className="build-button"
    type="button"
    onClick={handleBuild}
    disabled={loading}
  >
    {loading ? 'Building Your Plan...' : 'Build My Garage'}
  </button>

  {loading && (
    <div className="loading-panel">
      <div className="loading-dot"></div>
      <p>AI Garage is building your personalized plan...</p>
    </div>
  )}

  {error && (
    <p className="form-error">
      {error}
    </p>
  )}

 {showBuild && (
  <div className="build-result">
    <div className="result-heading">
      <p className="form-kicker">YOUR BUILD PLAN</p>
      <h2>Your AI Garage Plan</h2>
    </div>

    {aiAdvice && (
      <div className="ai-advice">
        <h3>PWBI AI Garage Advisor</h3>

        <div className="ai-advice-text">
          {(() => {
            const lines = aiAdvice
              .split('\n')
              .map((line) => line.replace(/[#*|]/g, '').trim())
              .filter((line) => line && !/^-+$/.test(line))

            const summaryIndex = lines.findIndex((line) =>
              /^Advisor Summary$/i.test(line)
            )

            const upgradesIndex = lines.findIndex((line) =>
              /^Recommended Upgrades$/i.test(line)
            )

            const warningIndex = lines.findIndex((line) =>
              /^(Modification to Wait On|Modification to Delay|Wait Until Later|Warning)$/i.test(line)
            )

            const summaryStart = summaryIndex >= 0 ? summaryIndex + 1 : 0

            const summaryEnd =
              upgradesIndex >= 0
                ? upgradesIndex
                : warningIndex >= 0
                ? warningIndex
                : lines.length

            const summaryLines = lines.slice(
              summaryStart,
              summaryEnd
            )

            const upgradesEnd =
              warningIndex >= 0 ? warningIndex : lines.length

            const upgradeLines =
              upgradesIndex >= 0
                ? lines.slice(upgradesIndex + 1, upgradesEnd)
                : []

            const upgradeCards = []

            upgradeLines.forEach((line) => {
              if (/^\d+\./.test(line)) {
                upgradeCards.push({
                  title: line,
                  details: [],
                })
              } else if (upgradeCards.length > 0) {
                upgradeCards[
                  upgradeCards.length - 1
                ].details.push(line)
              }
            })

            const warningLines =
              warningIndex >= 0
                ? lines.slice(warningIndex + 1)
                : []

            return (
              <>
                {summaryLines.length > 0 && (
                  <div className="advisor-summary-card">
                    <span className="advice-label">
                      Advisor Summary
                    </span>

                    {summaryLines.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                )}

                {upgradeCards.length > 0 && (
                  <div className="upgrade-section">
                    <div className="upgrade-section-heading">
                      Recommended Upgrades
                    </div>

                    <div className="upgrade-card-list">
                      {upgradeCards.map((upgrade, index) => (
                        <div
                          className="upgrade-card"
                          key={index}
                        >
                          <div className="upgrade-card-number">
                            {index + 1}
                          </div>

                          <div className="upgrade-card-content">
                            <h4>
                              {upgrade.title.replace(
                                /^\d+\.\s*/,
                                ''
                              )}
                            </h4>

                            {upgrade.details.map(
                              (detail, detailIndex) => (
                                <p key={detailIndex}>
                                  {detail.replace(/^-\s*/, '')}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {warningLines.length > 0 && (
                  <div className="advice-warning">
                    <span className="advice-label">
                      Modification to Wait On
                    </span>

                    {warningLines.map((line, index) => (
                      <p key={index}>
                        {line.replace(/^-\s*/, '')}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )
          })()}
        </div>
      </div>
    )}
  </div>
)}

</div>
</section>
</main>
  )
}
export default App