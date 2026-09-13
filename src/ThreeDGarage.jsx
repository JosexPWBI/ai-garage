import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { supabase } from './supabaseClient'
function RealCar() {
  const { scene } = useGLTF('/models/test-car.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <primitive
      object={scene}
      position={[0, -0.2, -1.2]}
      scale={2.35}
      rotation={[0, Math.PI / 2, 0]}
    />
  )
}


useGLTF.preload('/models/test-car.glb')
function PlaceholderCar() {
  const wheelPositions = [
    [-1.45, -0.42, 1.05],
    [1.45, -0.42, 1.05],
    [-1.45, -0.42, -1.05],
    [1.45, -0.42, -1.05],
  ]

  return (
    <group
      position={[0, 0.55, -1.4]}
      scale={1.25}
    >
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[3.8, 0.8, 1.8]} />

        <meshStandardMaterial
          color="#2b3742"
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Roof */}
      <mesh
        position={[0, 0.68, 0]}
        castShadow
      >
        <boxGeometry args={[2.2, 0.65, 1.5]} />

        <meshStandardMaterial
          color="#344957"
          metalness={0.4}
          roughness={0.32}
        />
      </mesh>

      {/* Wheels */}
      {wheelPositions.map((position, index) => (
        <mesh
          key={index}
          position={position}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.42, 0.42, 0.38, 32]}
          />

          <meshStandardMaterial
            color="#050505"
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

function TireRack({
  position,
  rotation = [0, 0, 0],
}) {
  return (
    <group
      position={position}
      rotation={rotation}
    >
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[3.2, 0.12, 0.3]} />

        <meshStandardMaterial
          color="#49545f"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[3.2, 0.12, 0.3]} />

        <meshStandardMaterial
          color="#49545f"
        />
      </mesh>

      <mesh position={[-1.45, 0.85, 0]}>
        <boxGeometry args={[0.12, 1.6, 0.3]} />

        <meshStandardMaterial
          color="#49545f"
        />
      </mesh>

      <mesh position={[1.45, 0.85, 0]}>
        <boxGeometry args={[0.12, 1.6, 0.3]} />

        <meshStandardMaterial
          color="#49545f"
        />
      </mesh>

      {[-1.05, -0.35, 0.35, 1.05].map((x, index) => (
        <mesh
          key={index}
          position={[x, 0.92, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry
            args={[0.34, 0.13, 12, 24]}
          />

          <meshStandardMaterial
            color="#070707"
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

function WheelDisplay() {
  return (
    <group position={[-5.7, 2.2, -8.55]}>
      {[-1.15, 0, 1.15].map((x, index) => (
        <mesh
          key={index}
          position={[x, 0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry
            args={[0.42, 0.12, 16, 32]}
          />

          <meshStandardMaterial
            color="#8b949e"
            metalness={0.8}
            roughness={0.22}
          />
        </mesh>
      ))}
    </group>
  )
}

function BodyPanelRack() {
  const panels = [
    { y: 2.6, color: '#00A7C8' },
    { y: 1.9, color: '#B8F28B' },
    { y: 1.2, color: '#e74c3c' },
    { y: 0.5, color: '#6c5ce7' },
  ]

  return (
    <group position={[7.8, 0, -8.55]}>
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[2.7, 3.8, 0.18]} />

        <meshStandardMaterial
          color="#121920"
          roughness={0.9}
        />
      </mesh>

      {panels.map((panel, index) => (
        <mesh
          key={index}
          position={[0, panel.y, 0.16]}
        >
          <boxGeometry args={[2.05, 0.42, 0.16]} />

          <meshStandardMaterial
            color={panel.color}
            metalness={0.35}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  )
}

function Toolbox() {
  return (
    <group position={[-8.2, 0, -7.7]}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.1, 1.6, 0.75]} />

        <meshStandardMaterial
          color="#b51f2e"
          metalness={0.45}
          roughness={0.4}
        />
      </mesh>

      {[0.35, 0.7, 1.05].map((y, index) => (
        <mesh
          key={index}
          position={[0, y, 0.39]}
        >
          <boxGeometry
            args={[1.8, 0.08, 0.03]}
          />

          <meshStandardMaterial
            color="#20272e"
          />
        </mesh>
      ))}
    </group>
  )
}

function WorkBench() {
  return (
    <group position={[0, 0, -8.45]}>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[3.7, 0.14, 0.95]} />

        <meshStandardMaterial
          color="#59636d"
          metalness={0.55}
          roughness={0.32}
        />
      </mesh>

      <mesh position={[-1.45, 0.4, 0]}>
        <boxGeometry args={[0.18, 0.9, 0.18]} />

        <meshStandardMaterial
          color="#303840"
        />
      </mesh>

      <mesh position={[1.45, 0.4, 0]}>
        <boxGeometry args={[0.18, 0.9, 0.18]} />

        <meshStandardMaterial
          color="#303840"
        />
      </mesh>
    </group>
  )
}

function NeonGarageSign() {
  return (
    <group position={[0, 4.25, -8.72]}>
      <mesh>
        <boxGeometry args={[6.4, 1.5, 0.14]} />

        <meshStandardMaterial
          color="#080d12"
          roughness={0.75}
        />
      </mesh>

      <mesh position={[0, 0.64, 0.1]}>
        <boxGeometry args={[6.2, 0.07, 0.06]} />

        <meshStandardMaterial
          color="#00A7C8"
          emissive="#00A7C8"
          emissiveIntensity={5}
        />
      </mesh>

      <mesh position={[0, -0.64, 0.1]}>
        <boxGeometry args={[6.2, 0.07, 0.06]} />

        <meshStandardMaterial
          color="#00A7C8"
          emissive="#00A7C8"
          emissiveIntensity={5}
        />
      </mesh>

      <mesh position={[0, 0.17, 0.11]}>
        <boxGeometry args={[4.3, 0.11, 0.07]} />

        <meshStandardMaterial
          color="#00A7C8"
          emissive="#00A7C8"
          emissiveIntensity={4}
        />
      </mesh>

      <mesh position={[0, -0.22, 0.11]}>
        <boxGeometry args={[2.7, 0.09, 0.07]} />

        <meshStandardMaterial
          color="#B8F28B"
          emissive="#B8F28B"
          emissiveIntensity={4}
        />
      </mesh>
    </group>
  )
}

function WallAccent({
  position,
  color,
  width = 2.2,
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[width, 0.08, 0.07]} />

      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
      />
    </mesh>
  )
}

function GarageEnvironment() {
  return (
    <>
      {/* Glossy dark shop floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.35, -1]}
        receiveShadow
      >
        <planeGeometry args={[24, 20]} />

        <meshStandardMaterial
          color="#090d11"
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3.5, -9]}>
        <boxGeometry args={[22, 7, 0.3]} />

        <meshStandardMaterial
          color="#3a2322"
          roughness={0.95}
        />
      </mesh>

      {/* Brick lines */}
      {[0.7, 1.4, 2.1, 2.8, 3.5, 4.2, 4.9, 5.6, 6.3].map(
        (y) => (
          <mesh
            key={y}
            position={[0, y, -8.82]}
          >
            <boxGeometry
              args={[21.8, 0.025, 0.025]}
            />

            <meshStandardMaterial
              color="#17191c"
            />
          </mesh>
        )
      )}

      {/* Left wall */}
      <mesh position={[-11, 3.5, -1]}>
        <boxGeometry args={[0.3, 7, 18]} />

        <meshStandardMaterial
          color="#10161c"
          roughness={0.9}
        />
      </mesh>

      {/* Right wall */}
      <mesh position={[11, 3.5, -1]}>
        <boxGeometry args={[0.3, 7, 18]} />

        <meshStandardMaterial
          color="#10161c"
          roughness={0.9}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 7, -1]}>
        <boxGeometry args={[22, 0.25, 18]} />

        <meshStandardMaterial
          color="#06090d"
        />
      </mesh>

      {/* Overhead shop lights */}
      {[-4, 0, 4].map((x, index) => (
        <mesh
          key={index}
          position={[x, 6.45, -0.5]}
        >
          <boxGeometry args={[2.8, 0.08, 0.22]} />

          <meshStandardMaterial
            color="#ffffff"
            emissive="#dffcff"
            emissiveIntensity={5}
          />
        </mesh>
      ))}

      {/* Rear shop lights */}
      {[-3, 3].map((x, index) => (
        <mesh
          key={`rear-${index}`}
          position={[x, 6.35, -6.5]}
        >
          <boxGeometry args={[2.2, 0.07, 0.18]} />

          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={4}
          />
        </mesh>
      ))}

      <NeonGarageSign />

      <WallAccent
        position={[-7.2, 4.1, -8.73]}
        color="#00A7C8"
      />

      <WallAccent
        position={[7.2, 4.1, -8.73]}
        color="#B8F28B"
      />

      <WallAccent
        position={[-7.2, 3.55, -8.73]}
        color="#6c5ce7"
        width={1.5}
      />

      <TireRack
        position={[-8.1, 0, -8.3]}
      />

      <TireRack
        position={[6.3, 0, -8.3]}
        rotation={[0, Math.PI, 0]}
      />

      <WheelDisplay />

      <BodyPanelRack />

      <Toolbox />

      <WorkBench />
    </>
  )
}

export default function ThreeDGarage({
  onBack,
  year,
  make,
  model,
  goal,
  budget,
}) {
  const [builderName, setBuilderName] =
    useState('Builder')

  const [builderUsername, setBuilderUsername] =
    useState('')

  useEffect(() => {
    async function loadBuilderProfile() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error(
          'Could not load signed-in user:',
          userError
        )
        return
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select('display_name, username')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error(
          'Could not load builder profile:',
          profileError
        )
        return
      }

      if (!profile) {
        console.warn(
          'No profile row found for signed-in user:',
          user.id
        )

        setBuilderName(
          user.user_metadata?.display_name ||
            user.email?.split('@')[0] ||
            'Builder'
        )

        setBuilderUsername(
          user.user_metadata?.username || ''
        )

        return
      }

      setBuilderName(
        profile.display_name || 'Builder'
      )

      setBuilderUsername(
        profile.username || ''
      )
    }

    loadBuilderProfile()
  }, [])

  return (
    <main className="three-d-garage">
      <header className="three-d-garage-header">
        <div>
          <p className="form-kicker">
            PWBI COMMUNITY GARAGE
          </p>

          <h1>Crew Garage</h1>

          <p>
            Phase 4 — 3D Garage Shell
          </p>
        </div>

        <button
          type="button"
          className="garage-back-button"
          onClick={onBack}
        >
          Back to AI Garage
        </button>
      </header>

      <section className="three-d-garage-layout">
        <aside className="three-d-panel">
          <p className="form-kicker">
            BUILDER
          </p>

          <h2>{builderName}</h2>

          <p>
            {builderUsername || 'No username set'}
          </p>

          <div className="three-d-divider"></div>

          <p className="form-kicker">
            VEHICLE
          </p>

          <h3>
            {year && make && model
              ? `${year} ${make} ${model}`
              : 'No Vehicle Selected'}
          </h3>

          <p>
            Goal: {goal || 'Not selected'}
          </p>

          <p>
            Budget:{' '}
            {budget
              ? `$${Number(
                  budget
                ).toLocaleString()}`
              : 'Not set'}
          </p>

          <p>
            Status: Active Build
          </p>
        </aside>

        <section className="three-d-scene">
          <Canvas
            shadows
            camera={{
              position: [8.5, 3.8, 9.5],
              fov: 43,
            }}
          >
            <color
              attach="background"
              args={['#03070b']}
            />

            <fog
              attach="fog"
              args={['#03070b', 13, 30]}
            />

            <ambientLight intensity={0.95} />

            <hemisphereLight
              skyColor="#9ee8ff"
              groundColor="#15191e"
              intensity={1.2}
            />

            <directionalLight
              position={[4, 8, 5]}
              intensity={4.2}
              castShadow
            />

            <pointLight
              position={[-5, 3, 2]}
              intensity={38}
              color="#00A7C8"
              distance={18}
            />

            <pointLight
              position={[5, 3, -2]}
              intensity={27}
              color="#B8F28B"
              distance={16}
            />

            <pointLight
              position={[0, 4, 6]}
              intensity={24}
              color="#376dff"
              distance={16}
            />

            <pointLight
              position={[0, 3, 8]}
              intensity={32}
              color="#087fbd"
              distance={20}
            />

            <GarageEnvironment />

            <RealCar />

            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              minDistance={5}
              maxDistance={20}
              target={[0, 0.6, -1]}
              maxPolarAngle={Math.PI / 2.05}
            />
          </Canvas>
        </section>

        <aside className="three-d-panel">
          <p className="form-kicker">
            COMMUNITY
          </p>

          <h2>Reactions</h2>

          <p>Likes: 0</p>
          <p>Favorites: 0</p>
          <p>Comments: 0</p>

          <div className="three-d-divider"></div>

          <p className="form-kicker">
            CAMERA
          </p>

          <p>Drag to rotate</p>
          <p>Scroll to zoom</p>
          <p>Right-drag to pan</p>
        </aside>
      </section>

      <footer className="three-d-action-bar">
        <button
          type="button"
          onClick={onBack}
        >
          Back
        </button>

        <button
          type="button"
          disabled
        >
          Save 3D View
        </button>

        <button
          type="button"
          disabled
        >
          Enter Build Mode
        </button>
      </footer>
    </main>
  )
}