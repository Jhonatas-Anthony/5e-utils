import type { Item, Spell } from "./types";

// Exportar JSON
export function exportSpellToJSON(spell: Spell) {
  const blob = new Blob([JSON.stringify(spell, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${spell.title || "magia"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Importar JSON
export function importSpellFromJSON(file: File): Promise<Spell> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = JSON.parse(e.target?.result as string);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function exportItemToJSON(item: Item) {
  const blob = new Blob([JSON.stringify(item, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${item.title || "item"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importItemFromJSON(file: File): Promise<Item> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = JSON.parse(e.target?.result as string);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}