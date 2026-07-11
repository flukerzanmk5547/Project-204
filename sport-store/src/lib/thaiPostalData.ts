export interface SubDistrict {
  name: string;
  postalCode: string;
}

export interface Amphoe {
  name: string;
  subDistricts: SubDistrict[];
}

export interface Province {
  name: string;
  amphoes: Amphoe[];
}

interface RawEntry {
  district: string;
  amphoe: string;
  province: string;
  zipcode: number;
}

let cachedProvinces: Province[] | null = null;
let fetchPromise: Promise<Province[]> | null = null;

function buildHierarchy(raw: RawEntry[]): Province[] {
  const map = new Map<string, Map<string, SubDistrict[]>>();

  for (const entry of raw) {
    if (!map.has(entry.province)) {
      map.set(entry.province, new Map());
    }
    const amphoeMap = map.get(entry.province)!;
    if (!amphoeMap.has(entry.amphoe)) {
      amphoeMap.set(entry.amphoe, []);
    }
    const subs = amphoeMap.get(entry.amphoe)!;
    if (!subs.some((s) => s.name === entry.district)) {
      subs.push({
        name: entry.district,
        postalCode: String(entry.zipcode),
      });
    }
  }

  const provinces: Province[] = [];
  for (const [provName, amphoeMap] of map) {
    const amphoes: Amphoe[] = [];
    for (const [ampName, subs] of amphoeMap) {
      amphoes.push({ name: ampName, subDistricts: subs });
    }
    provinces.push({ name: provName, amphoes });
  }

  return provinces;
}

const CDN_URL =
  "https://cdn.jsdelivr.net/gh/earthchie/jquery.Thailand.js@master/jquery.Thailand.js/database/raw_database/raw_database.json";

export async function loadThaiAddressData(): Promise<Province[]> {
  if (cachedProvinces) return cachedProvinces;

  if (!fetchPromise) {
    fetchPromise = fetch(CDN_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Thai address data");
        return res.json();
      })
      .then((raw: RawEntry[]) => {
        cachedProvinces = buildHierarchy(raw);
        return cachedProvinces;
      })
      .catch(() => {
        fetchPromise = null;
        return [] as Province[];
      });
  }

  return fetchPromise;
}

export function getAllProvinces(data: Province[]): string[] {
  return data.map((p) => p.name);
}

export function getAmphoes(data: Province[], provinceName: string): string[] {
  const prov = data.find((p) => p.name === provinceName);
  return prov ? prov.amphoes.map((a) => a.name) : [];
}

export function getSubDistricts(
  data: Province[],
  provinceName: string,
  amphoeName: string
): SubDistrict[] {
  const prov = data.find((p) => p.name === provinceName);
  if (!prov) return [];
  const amp = prov.amphoes.find((a) => a.name === amphoeName);
  return amp ? amp.subDistricts : [];
}

export function getPostalCode(
  data: Province[],
  provinceName: string,
  amphoeName: string,
  subDistrictName: string
): string {
  const subs = getSubDistricts(data, provinceName, amphoeName);
  const sub = subs.find((s) => s.name === subDistrictName);
  return sub?.postalCode ?? "";
}

export interface PostalLookupResult {
  province: string;
  amphoe: string;
  district: string;
}

export function lookupByPostalCode(
  data: Province[],
  postalCode: string
): PostalLookupResult[] {
  const results: PostalLookupResult[] = [];
  for (const prov of data) {
    for (const amp of prov.amphoes) {
      for (const sub of amp.subDistricts) {
        if (sub.postalCode === postalCode) {
          results.push({
            province: prov.name,
            amphoe: amp.name,
            district: sub.name,
          });
        }
      }
    }
  }
  return results;
}
