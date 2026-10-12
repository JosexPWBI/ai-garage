import { useEffect, useRef, useState } from 'react'
import '@google/model-viewer'
import './VehicleViewer.css'

// U.S. 2007 Accord sedan availability: Honda 2007 full-line brochure, p.14.
// Code/name mapping: AutomotiveTouchup and Sherwin-Williams 2007 import color book.
// Hex values are hand-selected illustrative approximations, not measured OEM color data.
const accordPaints = [
  { code: 'NH700M', name: 'Alabaster Silver Metallic', preview: '#b8babc' },
  { code: 'YR562P', name: 'Carbon Bronze Pearl', preview: '#575149' },
  { code: 'B542M', name: 'Cool Blue Metallic', preview: '#78929f' },
  { code: 'YR538M', name: 'Desert Mist Metallic', preview: '#b5a58b' },
  { code: 'NH658P', name: 'Graphite Pearl', preview: '#555b60' },
  { code: 'R528P', name: 'Moroccan Red Pearl', preview: '#732d38' },
  { code: 'B536P', name: 'Royal Blue Pearl', preview: '#253a60' },
  { code: 'B517P', name: 'Sapphire Blue Pearl', preview: '#37546b' },
  { code: 'NH578', name: 'Taffeta White', preview: '#ecebe3' },
  { code: 'B92P', name: 'Nighthawk Black Pearl', preview: '#171c22' },
]

const vehicles = [
  { id: 'miata', name: 'Mazda Miata MX-5 NA', src: '/models/mazda-miata-mx-5-na.glb', author: 'Lexyc16', source: 'https://sketchfab.com/3d-models/mazda-miata-mx-5-na-d51fcd44b74f4daf8012c41e0400c041' },
  { id: 'accord', name: 'Honda Accord 2007', src: '/models/honda-accord-2007.glb', author: 'cassanelliryan', source: 'https://sketchfab.com/3d-models/honda-accord-2007-fb53b8bc2a74417a8a38967930da12d3' },
  { id: 'rx-7', name: 'Mazda RX-7 FD', src: '/models/mazda-rx-7-fd.glb', author: 'Lexyc16', source: 'https://sketchfab.com/3d-models/mazda-rx-7-fd-d35ff630df614771b82e7b2f59035b1e' },
]

export default function VehicleViewer({ onBack }) {
  const [selected, setSelected] = useState('miata')
  return <ModelPreview key={selected} vehicle={vehicles.find(v => v.id === selected)} onSelect={setSelected} onBack={onBack} />
}

function ModelPreview({ onBack, vehicle, onSelect }) {
  const viewer = useRef(null)
  const [status, setStatus] = useState('loading')
  const [rotate, setRotate] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [paint, setPaint] = useState('original')
  const [paintCode, setPaintCode] = useState('')
  const [lookupMessage, setLookupMessage] = useState('')
  const originalPaint = useRef(null)

  useEffect(() => {
    const element = viewer.current
    const loaded = () => {
      const material = element.model?.materials.find(item => item.name === 'car_paint')
      originalPaint.current = material ? [...material.pbrMetallicRoughness.baseColorFactor] : null
      setPaint('original')
      setStatus('ready')
    }
    const failed = () => setStatus('error')
    element.addEventListener('load', loaded)
    element.addEventListener('error', failed)
    if (element.loaded) loaded()
    return () => {
      element.removeEventListener('load', loaded)
      element.removeEventListener('error', failed)
    }
  }, [attempt])

  function changePaint(value) {
    const material = viewer.current.model?.materials.find(item => item.name === 'car_paint')
    if (!material || !originalPaint.current) return
    const chosen = accordPaints.find(item => item.code === value)
    if (value !== 'original' && !chosen) return
    material.pbrMetallicRoughness.setBaseColorFactor(value === 'original' ? originalPaint.current : chosen.preview)
    setPaint(value)
  }

  function lookupPaint(event) {
    event.preventDefault()
    const normalized = paintCode.toUpperCase().replace(/[\s-]/g, '')
    const chosen = accordPaints.find(item => item.code === normalized)
    if (!chosen) {
      setLookupMessage(normalized ? 'Code not found in the verified 2007 U.S. Accord sedan palette. Check the code and vehicle year. Current preview unchanged.' : 'Enter a paint code from your vehicle label.')
      return
    }
    changePaint(chosen.code)
    setLookupMessage(`${chosen.code} — ${chosen.name} found. Illustrative preview applied.`)
  }

  function resetView() {
    viewer.current.cameraOrbit = '35deg 75deg auto'
    viewer.current.cameraTarget = 'auto auto auto'
    viewer.current.fieldOfView = '30deg'
    viewer.current.resetTurntableRotation()
    viewer.current.jumpCameraToGoal()
    setRotate(false)
  }

  return (
    <main className="vehicle-room">
      <header className="vehicle-room-heading">
        <div><p className="form-kicker">PWBI · 3D GARAGE</p><h1>{vehicle.name}</h1>
          <p>Explore your vehicle model library.</p></div>
        <button type="button" onClick={onBack}>Back to AI Garage</button>
      </header>
      <label className="vehicle-picker">Choose vehicle
        <select value={vehicle.id} onChange={event => onSelect(event.target.value)}>
          {vehicles.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <section className="vehicle-stage" aria-label="Interactive vehicle preview">
        <model-viewer key={attempt} ref={viewer}
          src={vehicle.src}
          alt={`3D ${vehicle.name}. Drag or use arrow keys to orbit; scroll or pinch to zoom.`}
          camera-controls touch-action="pan-y" loading="eager"
          camera-orbit="35deg 75deg auto" field-of-view="30deg"
          auto-rotate={rotate ? '' : undefined}
          shadow-intensity="0.6" exposure="1" interaction-prompt="none"
        />
        {status === 'loading' && <p className="vehicle-status" role="status">Loading {vehicle.name}…</p>}
        {status === 'error' && <div className="vehicle-status" role="alert">
          <p>The model could not load. Check that your browser supports WebGL.</p>
          <button type="button" onClick={() => { setStatus('loading'); setAttempt(attempt + 1) }}>Try again</button>
        </div>}
      </section>
      {vehicle.id === 'accord' && <div>
        <form onSubmit={lookupPaint} className="vehicle-picker">
          <label htmlFor="paint-code">Look up your paint code</label>
          <input id="paint-code" value={paintCode} onChange={event => { setPaintCode(event.target.value); setLookupMessage('') }} placeholder="Example: NH-700M" maxLength={32} autoComplete="off" spellCheck={false} />
          <button type="submit" disabled={status !== 'ready'}>Find and preview color</button>
          <small>Searches the verified 2007 U.S. Accord sedan colors. Spaces, hyphens and lowercase letters are accepted.</small>
          <p role="status">{lookupMessage}</p>
        </form>
        <label className="vehicle-picker">Factory paint code · 2007 Accord sedan (U.S.)
          <select value={paint} disabled={status !== 'ready'} onChange={event => { changePaint(event.target.value); setLookupMessage('') }}>
            <option value="original">Original model color · code unknown</option>
            {accordPaints.map(item => <option key={item.code} value={item.code}>{item.code} — {item.name}</option>)}
          </select>
          <small>Illustrative color preview, not an exact paint match. Metallic and pearl effects are approximate. Selection is not saved.</small>
        </label>
        <p className="vehicle-disclaimer">Availability varies by trim. Confirm your car’s code on its door-jamb label; the model’s original color does not identify your paint code.</p>
        <details className="vehicle-credits"><summary>Factory color references</summary>
          <p><a href="https://automobiles.honda.com/images/2007/2007-full-line-brochure.pdf" target="_blank" rel="noreferrer">Honda 2007 brochure (page 14)</a> lists sedan colors and trim availability.
          {' '}<a href="https://www.automotivetouchup.com/touch-up-paint/honda/2007/accord/" target="_blank" rel="noreferrer">Paint-code reference</a> supplies code/name mappings. B517P is also called Sapphire Blue Metallic in paint catalogs. Preview shades are illustrative, not measured factory samples.</p>
        </details>
      </div>}
      {vehicle.id === 'miata' && <p className="vehicle-disclaimer">Factory paint codes need the Miata’s exact model year and market; this model is labeled only as the NA generation.</p>}
      <div className="vehicle-controls">
        <button type="button" disabled={status !== 'ready'} onClick={resetView}>Reset view</button>
        <button type="button" disabled={status !== 'ready'} aria-pressed={rotate} onClick={() => setRotate(!rotate)}>
          {rotate ? 'Stop rotation' : 'Rotate vehicle'}
        </button>
        <span>Drag to orbit · Scroll or pinch to zoom · Arrow keys to rotate</span>
      </div>
      <p className="vehicle-disclaimer">Reference model of the selected vehicle. Part swaps and verified part fitment are not available yet.</p>
      <footer className="vehicle-credits">
        Model: <a href={vehicle.source} target="_blank" rel="noreferrer">{vehicle.name}</a>
        {' by '}<a href={`https://sketchfab.com/${vehicle.author}`} target="_blank" rel="noreferrer">{vehicle.author}</a>
        {' · '}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
        {paint === 'original' ? ' · Original model, unmodified.' : ' · Body paint color changed in this preview; source model unmodified.'}
      </footer>
    </main>
  )
}
