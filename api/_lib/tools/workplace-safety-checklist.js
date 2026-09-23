import { createComputeHandler } from '../computeHandler.js';

const WORKPLACE_CHECKLISTS = {
  factory: {
    label: 'Factory Floor',
    items: [
      'Machine guards in place on all equipment',
      'Emergency stops tested and accessible',
      'PPE worn per task (glasses, gloves, hearing protection)',
      'Walkways and exits clear of obstructions',
      'Spill response materials available near hazardous areas',
      'Lockout/tagout procedures posted and followed'
    ]
  },
  warehouse: {
    label: 'Warehouse',
    items: [
      'Racking inspected for damage and overloading',
      'Forklift operators certified and pre-shift checks logged',
      'Pedestrian and forklift traffic lanes clearly marked',
      'Loading dock edges guarded, dock plates secured',
      'Fire extinguishers accessible and inspected',
      'Emergency exits unobstructed and clearly marked'
    ]
  },
  office: {
    label: 'Office',
    items: [
      'Walkways and stairwells free of trip hazards',
      'Fire extinguishers and smoke detectors inspected',
      'Emergency exits clearly marked and unlocked during hours',
      'Electrical cords not run across walkways',
      'Ergonomic setup reviewed for workstations',
      'First aid kit stocked and accessible'
    ]
  }
};

function compute({ workplace }) {
  const key = WORKPLACE_CHECKLISTS[workplace] ? workplace : 'factory';
  const current = WORKPLACE_CHECKLISTS[key];
  return { key, label: current.label, items: current.items, workplaces: Object.entries(WORKPLACE_CHECKLISTS).map(([k, w]) => ({ key: k, label: w.label })) };
}

export default createComputeHandler(compute);
