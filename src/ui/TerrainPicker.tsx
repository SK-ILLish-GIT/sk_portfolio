import { TERRAINS } from '../config/terrains';

interface TerrainPickerProps {
  terrainId: string;
  onSelect: (id: string) => void;
}

/** Dropdown to choose the island ground theme (grass + sand textures). */
export default function TerrainPicker({ terrainId, onSelect }: TerrainPickerProps) {
  return (
    <label className="terrain-picker">
      <span>Islands</span>
      <select value={terrainId} onChange={(e) => onSelect(e.target.value)} aria-label="Island terrain">
        {TERRAINS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  );
}
