import { useState } from 'react';
const HISTORY_ITEMS = [
  'Diabetes', 'High blood pressure', 'Heart disease', 'Asthma', 'Cancer',
  'Stroke', 'Kidney disease', 'Liver disease', 'Thyroid disorder',
  'Arthritis', 'Depression / anxiety', 'Seizures'
];
function emptyRow() {
  return { id: Date.now() + Math.random(), value: '' };
}
export default function PatientIntakeFormTemplate() {
  const [personal, setPersonal] = useState({
    fullName: '', dob: '', gender: '', phone: '', email: '', address: ''
  });
  const [history, setHistory] = useState({});
  const [medications, setMedications] = useState([emptyRow()]);
  const [allergies, setAllergies] = useState([emptyRow()]);
  const [emergency, setEmergency] = useState({ name: '', relationship: '', phone: '' });
  function updatePersonal(field, value) {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  }
  function toggleHistory(item) {
    setHistory((prev) => ({ ...prev, [item]: !prev[item] }));
  }
  function updateListRow(list, setList, id, value) {
    setList(list.map((r) => (r.id === id ? { ...r, value } : r)));
  }
  function handlePrint() {
    window.print();
  }
  return (
    <div className="tool-page">
      <h1>Patient Intake Form Template</h1>
      <p className="tool-description">
        A fillable, printable patient intake form template covering personal information, medical
        history checklist, current medications, allergies, and emergency contact. Runs entirely in
        your browser.
      </p>
      <div className="tool-error">
        <strong>Not medical advice:</strong> This is a blank structural form template only. It does
        not interpret, evaluate, or provide guidance on anything you enter - it simply organizes
        your information for you to bring to or share with a healthcare provider.
      </div>
      <div className="tool-controls">
        <button type="button" onClick={handlePrint}>
          Print form
        </button>
      </div>
      <h2>Personal information</h2>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="pi-name">Full name</label>
          <input id="pi-name" type="text" value={personal.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pi-dob">Date of birth</label>
          <input id="pi-dob" type="date" value={personal.dob} onChange={(e) => updatePersonal('dob', e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pi-gender">Gender</label>
          <input id="pi-gender" type="text" value={personal.gender} onChange={(e) => updatePersonal('gender', e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pi-phone">Phone</label>
          <input id="pi-phone" type="tel" value={personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pi-email">Email</label>
          <input id="pi-email" type="email" value={personal.email} onChange={(e) => updatePersonal('email', e.target.value)} />
        </div>
        <div className="tool-panel">
          <label htmlFor="pi-address">Address</label>
          <input id="pi-address" type="text" value={personal.address} onChange={(e) => updatePersonal('address', e.target.value)} />
        </div>
      </div>
      <h2>Medical history checklist</h2>
      <div className="tool-grid">
        {HISTORY_ITEMS.map((item) => (
          <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={!!history[item]} onChange={() => toggleHistory(item)} />
            {item}
          </label>
        ))}
      </div>
      <h2>Current medications</h2>
      <div className="tool-panel">
        {medications.map((row) => (
          <input
            key={row.id}
            type="text"
            value={row.value}
            onChange={(e) => updateListRow(medications, setMedications, row.id, e.target.value)}
            placeholder="e.g. Lisinopril 10mg, once daily"
            style={{ marginBottom: '6px' }}
          />
        ))}
        <button type="button" onClick={() => setMedications((prev) => [...prev, emptyRow()])}>
          Add medication line
        </button>
      </div>
      <h2>Allergies</h2>
      <div className="tool-panel">
        {allergies.map((row) => (
          <input
            key={row.id}
            type="text"
            value={row.value}
            onChange={(e) => updateListRow(allergies, setAllergies, row.id, e.target.value)}
            placeholder="e.g. Penicillin - rash"
            style={{ marginBottom: '6px' }}
          />
        ))}
        <button type="button" onClick={() => setAllergies((prev) => [...prev, emptyRow()])}>
          Add allergy line
        </button>
      </div>
      <h2>Emergency contact</h2>
      <div className="tool-grid">
        <div className="tool-panel">
          <label htmlFor="ec-name">Name</label>
          <input id="ec-name" type="text" value={emergency.name} onChange={(e) => setEmergency((p) => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ec-rel">Relationship</label>
          <input id="ec-rel" type="text" value={emergency.relationship} onChange={(e) => setEmergency((p) => ({ ...p, relationship: e.target.value }))} />
        </div>
        <div className="tool-panel">
          <label htmlFor="ec-phone">Phone</label>
          <input id="ec-phone" type="tel" value={emergency.phone} onChange={(e) => setEmergency((p) => ({ ...p, phone: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}
