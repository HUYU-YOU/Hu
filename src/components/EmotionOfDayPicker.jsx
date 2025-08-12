import { useState } from 'react';

const OPTIONS = ['joie', 'curiosité', 'colère', 'nature', 'énergie', 'détresse'];

export default function EmotionOfDayPicker() {
  const [value, setValue] = useState(OPTIONS[0]);
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      Émotion du jour
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        {OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
