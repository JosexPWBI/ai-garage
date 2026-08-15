import { useState } from 'react'
import './App.css'

function App() {
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [budget, setBudget] = useState('')
  const [photo, setPhoto] = useState(null)
  const [showBuild, setShowBuild] = useState(false)

  function handlePhotoChange(e) {
    const file = e.target.files[0]

    if (file) {
      setPhoto(URL.createObjectURL(file))
    }
  }

  function getRecommendations() {
    const buildBudget = Number(budget) || 0

    if (buildBudget >= 10000) {
      return [
        { name: 'Performance suspension and adjustable coilovers', percent: 25 },
        { name: 'Lightweight wheels with performance tires', percent: 25 },
        { name: 'Big brake upgrade', percent: 18 },
        { name: 'Intake, exhaust, and ECU tune', percent: 20 },
        { name: 'Exterior aero and appearance package', percent: 12 },
      ]
    }

    if (buildBudget >= 5000) {
      return [
        { name: 'Sport suspension or lowering springs', percent: 24 },
        { name: 'Performance wheels and tires', percent: 36 },
        { name: 'Upgraded brake pads and rotors', percent: 14 },
        { name: 'Cat-back exhaust', percent: 18 },
        { name: 'Exterior styling upgrades', percent: 8 },
      ]
    }

    if (buildBudget >= 2000) {
      return [
        { name: 'Quality performance tires', percent: 40 },
        { name: 'Brake pad upgrade', percent: 18 },
        { name: 'Lowering springs', percent: 25 },
        { name: 'Intake or axle-back exhaust', percent: 17 },
      ]
    }

    return [
      { name: 'Maintenance and reliability refresh', percent: 40 },
      { name: 'Performance tires', percent: 30 },
      { name: 'Brake pads and fluid', percent: 20 },
      { name: 'Low-cost cosmetic upgrades', percent: 10 },
    ]
  }

  function handleBuild() {
    setShowBuild(true)
  }

  const recommendations = getRecommendations()
  const buildBudget = Number(budget) || 0

  return (
    <main className="garage">
      <section className="hero">
        <p className="eyebrow">PWBI INNOVATION LAB</p>
        <h1>AI Garage</h1>

        <p className="subtitle">
          Upload your ride. Set your budget. Build your vision.
        </p>

        <div className="garage-card">
          <h2>Start Your Build</h2>

          <label>
            Vehicle Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </label>

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

          <label>
            Build Budget
            <input
              type="number"
              placeholder="5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </label>

          <button type="button" onClick={handleBuild}>
            Build My Garage
          </button>

          {showBuild && (
            <div className="build-result">
              <h2>Your AI Garage Plan</h2>

              <p>
                <strong>Vehicle:</strong>{' '}
                {year || 'Year'} {make || 'Make'} {model || 'Model'}
              </p>

              <p>
                <strong>Budget:</strong> ${buildBudget.toLocaleString()}
              </p>

              <h3>Recommended Upgrades</h3>

              <ul>
                {recommendations.map((item) => {
                  const estimatedPrice = Math.round(
                    buildBudget * (item.percent / 100)
                  )

                  return (
                    <li key={item.name}>
                      <span>{item.name}</span>
                      <strong>${estimatedPrice.toLocaleString()}</strong>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App