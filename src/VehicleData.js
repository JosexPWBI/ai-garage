
const vehicleData = {
  'ford mustang': {
    make: 'Ford',
    model: 'Mustang',
    category: 'Muscle / Performance',
    strengths: [
      'Strong aftermarket support',
      'Good power potential',
      'Wide selection of suspension and brake upgrades',
    ],
    priorities: {
      'Daily Driver': [
        'Quality tires',
        'Brake refresh',
        'Ride-focused suspension',
        'Reliability maintenance',
      ],
      'Street Performance': [
        'Performance tires',
        'Suspension upgrade',
        'Brake upgrade',
        'Intake, exhaust, and tune',
      ],
      Track: [
        'High-grip tires',
        'Performance brakes',
        'Cooling upgrades',
        'Track-focused suspension',
      ],
      'Show Car': [
        'Wheels and fitment',
        'Lowered suspension',
        'Exterior aero',
        'Interior appearance upgrades',
      ],
    },
  },

  'honda civic': {
    make: 'Honda',
    model: 'Civic',
    category: 'Sport Compact',
    strengths: [
      'Reliable platform',
      'Lightweight',
      'Large aftermarket',
      'Good handling potential',
    ],
    priorities: {
      'Daily Driver': [
        'Maintenance refresh',
        'Quality tires',
        'Brake upgrade',
        'Comfort-focused suspension',
      ],
      'Street Performance': [
        'Performance tires',
        'Sport suspension',
        'Brake upgrade',
        'Intake and exhaust',
      ],
      Track: [
        'Track tires',
        'Brake cooling and pads',
        'Coilovers',
        'Weight reduction',
      ],
      'Show Car': [
        'Wheels and fitment',
        'Lowering suspension',
        'Exterior styling',
        'Lighting upgrades',
      ],
    },
  },

  'mazda miata': {
    make: 'Mazda',
    model: 'Miata',
    category: 'Lightweight Sports Car',
    strengths: [
      'Excellent handling balance',
      'Lightweight chassis',
      'Affordable performance upgrades',
    ],
    priorities: {
      'Daily Driver': [
        'Tires',
        'Maintenance',
        'Brake refresh',
        'Comfort suspension',
      ],
      'Street Performance': [
        'Performance tires',
        'Coilovers',
        'Brake upgrade',
        'Lightweight wheels',
      ],
      Track: [
        'Track tires',
        'Coilovers',
        'Performance brakes',
        'Cooling and safety upgrades',
      ],
      'Show Car': [
        'Wheels and fitment',
        'Lowered stance',
        'Exterior styling',
        'Interior upgrades',
      ],
    },
  },

  'subaru wrx': {
    make: 'Subaru',
    model: 'WRX',
    years: {
  start: 2008,
  end: 2014,
},
    category: 'Turbo AWD Performance',
    strengths: [
      'All-wheel-drive traction',
      'Turbo power potential',
      'Strong enthusiast aftermarket',
    ],
    priorities: {
      'Daily Driver': [
        'Reliability maintenance',
        'Quality tires',
        'Brake refresh',
        'Suspension inspection',
      ],
      'Street Performance': [
        'Performance tires',
        'Brake upgrade',
        'Suspension upgrade',
        'Conservative ECU tune',
      ],
      Track: [
        'Cooling upgrades',
        'High-performance brakes',
        'Track tires',
        'Suspension setup',
      ],
      'Show Car': [
        'Wheels and fitment',
        'Coilovers',
        'Exterior aero',
        'Lighting upgrades',
      ],
    },
  },

  'toyota 86': {
    make: 'Toyota',
    model: '86',
    category: 'Rear-Wheel-Drive Sports Car',
    strengths: [
      'Balanced chassis',
      'Strong handling',
      'Large aftermarket',
      'Good platform for driver-focused builds',
    ],
    priorities: {
      'Daily Driver': [
        'Quality tires',
        'Brake refresh',
        'Maintenance',
        'Comfort suspension',
      ],
      'Street Performance': [
        'Performance tires',
        'Suspension upgrade',
        'Brake upgrade',
        'Exhaust and tune',
      ],
      Track: [
        'Track tires',
        'Brake upgrade',
        'Cooling upgrades',
        'Track suspension',
      ],
      'Show Car': [
        'Wheels and fitment',
        'Lowered suspension',
        'Aero package',
        'Exterior styling',
      ],
    },
  },
}

export default vehicleData