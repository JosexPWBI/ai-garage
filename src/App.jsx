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

  function handleBuild() {
    setShowBuild(true)
  }

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
              <h2>Your Build</h2>
              <p>
                Vehicle: {year || 'Year'} {make || 'Make'} {model || 'Model'}
              </p>
              <p>Budget: ${budget || '0'}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App