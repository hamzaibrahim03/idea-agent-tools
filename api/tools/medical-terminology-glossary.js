import { createComputeHandler } from '../_lib/computeHandler.js';

const GLOSSARY = [
  { term: 'BP', definition: 'Blood pressure - the force of blood against artery walls.' },
  { term: 'HR', definition: 'Heart rate - number of heartbeats per minute.' },
  { term: 'NPO', definition: 'Nothing by mouth (from Latin "nil per os") - no eating or drinking.' },
  { term: 'PRN', definition: 'As needed (from Latin "pro re nata") - typically referring to medication dosing.' },
  { term: 'BID', definition: 'Twice a day (from Latin "bis in die").' },
  { term: 'TID', definition: 'Three times a day (from Latin "ter in die").' },
  { term: 'QID', definition: 'Four times a day (from Latin "quater in die").' },
  { term: 'QD', definition: 'Once a day (from Latin "quaque die").' },
  { term: 'Rx', definition: 'Prescription.' },
  { term: 'Dx', definition: 'Diagnosis.' },
  { term: 'Tx', definition: 'Treatment.' },
  { term: 'Hx', definition: 'History (as in medical history).' },
  { term: 'Sx', definition: 'Symptoms.' },
  { term: 'Fx', definition: 'Fracture.' },
  { term: 'ER / ED', definition: 'Emergency room / emergency department.' },
  { term: 'ICU', definition: 'Intensive care unit.' },
  { term: 'OR', definition: 'Operating room.' },
  { term: 'IV', definition: 'Intravenous - administered directly into a vein.' },
  { term: 'IM', definition: 'Intramuscular - administered into a muscle.' },
  { term: 'PO', definition: 'By mouth (from Latin "per os").' },
  { term: 'WBC', definition: 'White blood cell (count) - part of the immune system.' },
  { term: 'RBC', definition: 'Red blood cell (count) - carries oxygen in the blood.' },
  { term: 'BMI', definition: 'Body mass index - a weight-to-height ratio used as a general screening measure.' },
  { term: 'BMR', definition: 'Basal metabolic rate - calories burned at rest.' },
  { term: 'CBC', definition: 'Complete blood count - a common blood test panel.' },
  { term: 'EKG / ECG', definition: 'Electrocardiogram - records the electrical activity of the heart.' },
  { term: 'MRI', definition: 'Magnetic resonance imaging - a detailed imaging scan.' },
  { term: 'CT', definition: 'Computed tomography - a cross-sectional imaging scan (CT scan).' },
  { term: 'GP', definition: 'General practitioner - a primary care doctor.' },
  { term: 'OB/GYN', definition: 'Obstetrics and gynecology - care related to pregnancy and the female reproductive system.' },
  { term: 'Post-op', definition: 'After a surgical operation.' },
  { term: 'Pre-op', definition: 'Before a surgical operation.' },
  { term: 'Chronic', definition: 'Persisting for a long time or recurring frequently.' },
  { term: 'Acute', definition: 'Having a sudden onset and typically short duration.' },
  { term: 'Benign', definition: 'Not harmful in effect; not cancerous (in the context of a growth or tumor).' },
  { term: 'Malignant', definition: 'Cancerous; tending to spread and worsen.' },
  { term: 'Contraindication', definition: 'A specific reason a treatment or medication should not be used.' },
  { term: 'Comorbidity', definition: 'The presence of one or more additional conditions alongside a primary condition.' },
  { term: 'Outpatient', definition: 'Medical care that does not require an overnight hospital stay.' },
  { term: 'Inpatient', definition: 'Medical care that requires admission and an overnight hospital stay.' },
  { term: 'Copay', definition: 'A fixed fee paid by a patient for a covered service, set by an insurance plan.' },
  { term: 'Deductible', definition: 'The amount a patient must pay out of pocket before insurance coverage begins.' },
  { term: 'EOB', definition: 'Explanation of benefits - an insurer\'s statement of what was billed, covered, and owed.' },
];

function compute({ query }) {
  const q = (query || '').trim().toLowerCase();
  const filtered = GLOSSARY.filter((entry) => !q || entry.term.toLowerCase().includes(q) || entry.definition.toLowerCase().includes(q))
    .sort((a, b) => a.term.localeCompare(b.term));
  return { filtered };
}

export default createComputeHandler(compute);
