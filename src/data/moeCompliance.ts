import type { MaintenanceCycle } from '../types';

const genId = () => Math.random().toString(36).substr(2, 9);

function getNextDate(freq: string, from: Date): Date {
  const d = new Date(from);
  switch (freq) {
    case 'weekly': d.setDate(d.getDate() + 7); break;
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'quarterly': d.setMonth(d.getMonth() + 3); break;
    case 'biannual': d.setMonth(d.getMonth() + 6); break;
    case 'annual': d.setFullYear(d.getFullYear() + 1); break;
    case '5yearly': d.setFullYear(d.getFullYear() + 5); break;
    case '10yearly': d.setFullYear(d.getFullYear() + 10); break;
  }
  return d;
}

export const defaultCycles: MaintenanceCycle[] = [
  {
    id: genId(),
    name: 'Weekly Safety & Hygiene Checks',
    frequency: 'weekly',
    moeReference: 'MOE Property Guidelines - Regular Inspections',
    currentCycleStart: new Date().toISOString(),
    currentCycleEnd: getNextDate('weekly', new Date()).toISOString(),
    cycleNumber: 1,
    sections: [
      {
        id: genId(), title: 'Fire Safety', category: 'Safety',
        tasks: [
          { id: genId(), title: 'Check all fire exits are clear and accessible', description: 'Ensure no obstructions in fire exit paths', completed: false },
          { id: genId(), title: 'Test emergency lighting', description: 'Verify all emergency lights are functional', completed: false },
          { id: genId(), title: 'Inspect fire extinguisher accessibility', description: 'All extinguishers visible and accessible', completed: false },
          { id: genId(), title: 'Check fire alarm panel for faults', description: 'Review fire alarm panel for any fault indicators', completed: false },
        ]
      },
      {
        id: genId(), title: 'General Hygiene', category: 'Hygiene',
        tasks: [
          { id: genId(), title: 'Check toilet facilities are clean and stocked', description: 'Soap, paper towels, toilet paper adequate', completed: false },
          { id: genId(), title: 'Verify hand sanitiser stations', description: 'All stations filled and operational', completed: false },
          { id: genId(), title: 'Inspect rubbish and recycling bins', description: 'Bins emptied regularly, no overflow', completed: false },
        ]
      },
      {
        id: genId(), title: 'Grounds Safety', category: 'Grounds',
        tasks: [
          { id: genId(), title: 'Inspect playground equipment for damage', description: 'Check for sharp edges, loose bolts, wear', completed: false },
          { id: genId(), title: 'Check pathways for trip hazards', description: 'Uneven surfaces, debris, wet areas', completed: false },
          { id: genId(), title: 'Verify gate and fence integrity', description: 'All gates close properly, no fence gaps', completed: false },
        ]
      }
    ]
  },
  {
    id: genId(),
    name: 'Monthly Building Systems',
    frequency: 'monthly',
    moeReference: 'MOE Preventive Maintenance Schedule',
    currentCycleStart: new Date().toISOString(),
    currentCycleEnd: getNextDate('monthly', new Date()).toISOString(),
    cycleNumber: 1,
    sections: [
      {
        id: genId(), title: 'HVAC Systems', category: 'Mechanical',
        tasks: [
          { id: genId(), title: 'Check and replace HVAC filters', description: 'Inspect all air handling unit filters', completed: false },
          { id: genId(), title: 'Test thermostat operation', description: 'Verify all zone thermostats respond correctly', completed: false },
          { id: genId(), title: 'Inspect ductwork for leaks', description: 'Visual inspection of accessible ductwork', completed: false },
          { id: genId(), title: 'Check ventilation rates in classrooms', description: 'MOE minimum fresh air requirements', completed: false },
        ]
      },
      {
        id: genId(), title: 'Plumbing', category: 'Plumbing',
        tasks: [
          { id: genId(), title: 'Check for leaking taps and pipes', description: 'Inspect all accessible plumbing', completed: false },
          { id: genId(), title: 'Test hot water temperature (max 55°C)', description: 'MOE safety requirement for student areas', completed: false },
          { id: genId(), title: 'Clean and inspect gutters', description: 'Remove debris, check for damage', completed: false },
          { id: genId(), title: 'Inspect stormwater drains', description: 'Clear any blockages', completed: false },
        ]
      },
      {
        id: genId(), title: 'Electrical', category: 'Electrical',
        tasks: [
          { id: genId(), title: 'Test RCD/safety switches', description: 'All residual current devices functional', completed: false },
          { id: genId(), title: 'Check switchboard for signs of overheating', description: 'Visual inspection of main switchboard', completed: false },
          { id: genId(), title: 'Inspect external lighting', description: 'All security and pathway lights working', completed: false },
        ]
      }
    ]
  },
  {
    id: genId(),
    name: 'Quarterly Compliance Checks',
    frequency: 'quarterly',
    moeReference: 'MOE School Property Guide - Compliance',
    currentCycleStart: new Date().toISOString(),
    currentCycleEnd: getNextDate('quarterly', new Date()).toISOString(),
    cycleNumber: 1,
    sections: [
      {
        id: genId(), title: 'Building Warrant of Fitness (BWOF)', category: 'Compliance',
        tasks: [
          { id: genId(), title: 'Review BWOF compliance schedule', description: 'Ensure all specified systems are maintained', completed: false },
          { id: genId(), title: 'Fire alarm system full test', description: 'IQP certified test of fire alarm system', completed: false },
          { id: genId(), title: 'Sprinkler system inspection', description: 'Flow test and visual inspection', completed: false },
          { id: genId(), title: 'Emergency evacuation drill', description: 'Conduct and document evacuation drill', completed: false },
          { id: genId(), title: 'Backflow preventer testing', description: 'Annual test due - quarterly check', completed: false },
        ]
      },
      {
        id: genId(), title: 'Hazardous Materials', category: 'Safety',
        tasks: [
          { id: genId(), title: 'Inspect asbestos register (if applicable)', description: 'Check condition of known asbestos materials', completed: false },
          { id: genId(), title: 'Review chemical storage compliance', description: 'Science labs, cleaning supplies properly stored', completed: false },
          { id: genId(), title: 'Check safety data sheets are current', description: 'All SDS accessible and up to date', completed: false },
        ]
      },
      {
        id: genId(), title: 'Accessibility & Seismic', category: 'Structure',
        tasks: [
          { id: genId(), title: 'Inspect accessible ramps and handrails', description: 'All accessibility features in good condition', completed: false },
          { id: genId(), title: 'Check seismic restraints on equipment', description: 'Shelving, water heaters, heavy equipment secured', completed: false },
          { id: genId(), title: 'Inspect building for structural cracks', description: 'Document any new or widening cracks', completed: false },
        ]
      }
    ]
  },
  {
    id: genId(),
    name: 'Biannual Deep Maintenance',
    frequency: 'biannual',
    moeReference: 'MOE 5YA Property Plan',
    currentCycleStart: new Date().toISOString(),
    currentCycleEnd: getNextDate('biannual', new Date()).toISOString(),
    cycleNumber: 1,
    sections: [
      {
        id: genId(), title: 'Roof & Exterior', category: 'Building Envelope',
        tasks: [
          { id: genId(), title: 'Professional roof inspection', description: 'Check for leaks, damage, moss, debris', completed: false },
          { id: genId(), title: 'Inspect exterior cladding', description: 'Check for weathertightness issues', completed: false },
          { id: genId(), title: 'Check window and door seals', description: 'Replace deteriorated seals', completed: false },
          { id: genId(), title: 'Inspect and clean spouting', description: 'Clear all guttering and downpipes', completed: false },
        ]
      },
      {
        id: genId(), title: 'Interior Maintenance', category: 'Interior',
        tasks: [
          { id: genId(), title: 'Inspect flooring throughout', description: 'Check carpet, vinyl, tiles for damage', completed: false },
          { id: genId(), title: 'Check interior paintwork', description: 'Touch up or repaint as needed', completed: false },
          { id: genId(), title: 'Inspect ceiling tiles', description: 'Check for staining, damage, sagging', completed: false },
          { id: genId(), title: 'Test all door hardware', description: 'Locks, closers, hinges operational', completed: false },
        ]
      }
    ]
  },
  {
    id: genId(),
    name: 'Annual MOE Compliance Review',
    frequency: 'annual',
    moeReference: 'MOE Annual Property Review',
    currentCycleStart: new Date().toISOString(),
    currentCycleEnd: getNextDate('annual', new Date()).toISOString(),
    cycleNumber: 1,
    sections: [
      {
        id: genId(), title: '10-Year Property Plan (10YPP) Review', category: 'Planning',
        tasks: [
          { id: genId(), title: 'Review current 10YPP status', description: 'Assess progress against 10-year property plan', completed: false },
          { id: genId(), title: 'Update condition assessments', description: 'Re-evaluate building component conditions', completed: false },
          { id: genId(), title: 'Review roll projections impact', description: 'Assess if student roll changes affect property needs', completed: false },
          { id: genId(), title: 'Submit annual property report to MOE', description: 'Complete required MOE property reporting', completed: false },
        ]
      },
      {
        id: genId(), title: '5-Year Agreement (5YA) Funding', category: 'Funding',
        tasks: [
          { id: genId(), title: 'Review 5YA funding allocation', description: 'Check remaining funds and planned expenditure', completed: false },
          { id: genId(), title: 'Prioritise capital works projects', description: 'Rank upcoming projects by urgency and impact', completed: false },
          { id: genId(), title: 'Update maintenance forecasting', description: 'Revise cost estimates for planned maintenance', completed: false },
          { id: genId(), title: 'Review contractor performance', description: 'Assess quality and value of maintenance contractors', completed: false },
        ]
      },
      {
        id: genId(), title: 'Health & Safety Annual Review', category: 'H&S',
        tasks: [
          { id: genId(), title: 'Complete annual H&S site inspection', description: 'Comprehensive health and safety walkthrough', completed: false },
          { id: genId(), title: 'Review and update emergency procedures', description: 'Earthquake, fire, lockdown procedures current', completed: false },
          { id: genId(), title: 'Verify all compliance certificates current', description: 'BWOF, electrical WOF, gas certificates', completed: false },
          { id: genId(), title: 'Review accident/incident register', description: 'Identify patterns and preventive actions', completed: false },
          { id: genId(), title: 'Update building risk register', description: 'Reassess all property-related risks', completed: false },
        ]
      },
      {
        id: genId(), title: 'Energy & Sustainability', category: 'Sustainability',
        tasks: [
          { id: genId(), title: 'Review energy consumption data', description: 'Compare against previous years and benchmarks', completed: false },
          { id: genId(), title: 'Inspect insulation condition', description: 'MOE minimum insulation standards met', completed: false },
          { id: genId(), title: 'Check solar panel systems (if installed)', description: 'Performance review and maintenance', completed: false },
          { id: genId(), title: 'Review water usage and conservation', description: 'Identify opportunities to reduce consumption', completed: false },
        ]
      }
    ]
  }
];

export const itCategories = [
  'Hardware - Desktop/Laptop',
  'Hardware - Printer/Scanner',
  'Hardware - Interactive Display',
  'Hardware - Network Equipment',
  'Software - Installation',
  'Software - Update/Patch',
  'Software - License',
  'Network - Connectivity',
  'Network - WiFi',
  'Network - VPN',
  'Email & Communication',
  'Student Management System',
  'Learning Management System',
  'Security - Account Access',
  'Security - Threat/Virus',
  'Audio/Visual Equipment',
  'Phone System',
  'Other',
];

export const maintenanceCategories = [
  'Plumbing',
  'Electrical',
  'HVAC / Heating',
  'Roofing & Gutters',
  'Windows & Doors',
  'Flooring',
  'Painting & Decoration',
  'Grounds & Landscaping',
  'Playground Equipment',
  'Fencing & Gates',
  'Fire Safety Systems',
  'Security Systems',
  'Structural',
  'Accessibility',
  'Cleaning',
  'Pest Control',
  'Waste Management',
  'Other',
];

export const locations = [
  'Block A - Administration',
  'Block B - Junior School',
  'Block C - Senior School',
  'Block D - Science Labs',
  'Block E - Technology',
  'Block F - Arts & Music',
  'Library',
  'School Hall',
  'Gymnasium',
  'Swimming Pool',
  'Staffroom',
  'Playground - Junior',
  'Playground - Senior',
  'Sports Fields',
  'Car Park',
  'Kitchen/Canteen',
  'Server Room',
  'Maintenance Shed',
  'Other',
];
