export const seedPatients = [
  { name: "Maria Lopez", dateOfBirth: "1958-03-14", phone: "+15550100101" },
  { name: "James Carter", dateOfBirth: "1971-07-02", phone: "+15550100102" },
  { name: "Aisha Rahman", dateOfBirth: "1990-11-21", phone: "+15550100103" },
];

export const seedClinicians = [
  { name: "Dr. Sarah Chen", specialty: "Family Medicine" },
  { name: "Dr. Amit Patel", specialty: "Cardiology" },
  { name: "Dr. Laura Kim", specialty: "Dermatology" },
  { name: "Dr. Maya Okafor", specialty: "Family Medicine" },
];

export const seedBookings = [
  { patient: 0, clinician: 0, slot: 0, reason: "Annual physical" },
  { patient: 1, clinician: 1, slot: 2, reason: "Blood pressure review" },
  { patient: 2, clinician: 0, slot: 1, reason: "Persistent cough" },
];
