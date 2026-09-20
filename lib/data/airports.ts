export interface Airport {
  code: string; // IATA code
  city: string;
  name: string;
  state: string;
  country: string;
  popular?: boolean;
  nearbyAirportCodes?: string[];
}

export const AIRPORTS: Airport[] = [
  {
    code: 'BLR',
    city: 'Bengaluru',
    name: 'Kempegowda International Airport',
    state: 'Karnataka',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['MYQ', 'IXE'],
  },
  {
    code: 'BOM',
    city: 'Mumbai',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    state: 'Maharashtra',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['PNQ', 'GOX'],
  },
  {
    code: 'DEL',
    city: 'New Delhi',
    name: 'Indira Gandhi International Airport',
    state: 'Delhi',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['IXC', 'JAI'],
  },
  {
    code: 'HYD',
    city: 'Hyderabad',
    name: 'Rajiv Gandhi International Airport',
    state: 'Telangana',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['BOM', 'BLR'],
  },
  {
    code: 'MAA',
    city: 'Chennai',
    name: 'Chennai International Airport',
    state: 'Tamil Nadu',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['BLR', 'TRV'],
  },
  {
    code: 'CCU',
    city: 'Kolkata',
    name: 'Netaji Subhash Chandra Bose International Airport',
    state: 'West Bengal',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['IXB', 'BBI'],
  },
  {
    code: 'GOI',
    city: 'Goa',
    name: 'Dabolim Airport',
    state: 'Goa',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['GOX', 'BOM'],
  },
  {
    code: 'GOX',
    city: 'Goa',
    name: 'Manohar International Airport (Mopa)',
    state: 'Goa',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['GOI', 'BOM'],
  },
  {
    code: 'PNQ',
    city: 'Pune',
    name: 'Pune Airport',
    state: 'Maharashtra',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['BOM'],
  },
  {
    code: 'AMD',
    city: 'Ahmedabad',
    name: 'Sardar Vallabhbhai Patel International Airport',
    state: 'Gujarat',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['BOM', 'DEL'],
  },
  {
    code: 'COK',
    city: 'Kochi',
    name: 'Cochin International Airport',
    state: 'Kerala',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['TRV', 'BLR'],
  },
  {
    code: 'JAI',
    city: 'Jaipur',
    name: 'Jaipur International Airport',
    state: 'Rajasthan',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['DEL'],
  },
  {
    code: 'LKO',
    city: 'Lucknow',
    name: 'Chaudhary Charan Singh International Airport',
    state: 'Uttar Pradesh',
    country: 'India',
    popular: true,
    nearbyAirportCodes: ['DEL', 'VNS'],
  },
  {
    code: 'GAU',
    city: 'Guwahati',
    name: 'Lokpriya Gopinath Bordoloi International Airport',
    state: 'Assam',
    country: 'India',
    popular: false,
    nearbyAirportCodes: ['CCU'],
  },
  {
    code: 'TRV',
    city: 'Thiruvananthapuram',
    name: 'Trivandrum International Airport',
    state: 'Kerala',
    country: 'India',
    popular: false,
    nearbyAirportCodes: ['COK'],
  },
  {
    code: 'IXB',
    city: 'Bagdogra',
    name: 'Bagdogra Airport',
    state: 'West Bengal',
    country: 'India',
    popular: false,
    nearbyAirportCodes: ['CCU'],
  },
  {
    code: 'IXC',
    city: 'Chandigarh',
    name: 'Shaheed Bhagat Singh International Airport',
    state: 'Punjab',
    country: 'India',
    popular: false,
    nearbyAirportCodes: ['DEL'],
  },
  {
    code: 'PAT',
    city: 'Patna',
    name: 'Jay Prakash Narayan Airport',
    state: 'Bihar',
    country: 'India',
    popular: false,
    nearbyAirportCodes: ['CCU', 'VNS'],
  },
  {
    code: 'BBI',
    city: 'Bhubaneswar',
    name: 'Biju Patnaik International Airport',
    state: 'Odisha',
    country: 'India',
    popular: false,
    nearbyAirportCodes: ['CCU', 'VTZ'],
  },
  {
    code: 'SXR',
    city: 'Srinagar',
    name: 'Sheikh ul-Alam International Airport',
    state: 'Jammu and Kashmir',
    country: 'India',
    popular: false,
    nearbyAirportCodes: ['DEL', 'IXC'],
  },
  {
    code: 'VNS',
    city: 'Varanasi',
    name: 'Lal Bahadur Shastri International Airport',
    state: 'Uttar Pradesh',
    country: 'India',
    popular: false,
    nearbyAirportCodes: ['LKO', 'DEL'],
  },
  {
    code: 'UDR',
    city: 'Udaipur',
    name: 'Maharana Pratap Airport',
    state: 'Rajasthan',
    country: 'India',
    popular: false,
    nearbyAirportCodes: ['AMD', 'JAI'],
  },
];

export function getAirportByCode(code: string): Airport | undefined {
  if (!code) return undefined;
  return AIRPORTS.find((a) => a.code.toUpperCase() === code.trim().toUpperCase());
}

export function searchAirports(query: string): Airport[] {
  if (!query || query.trim().length === 0) {
    return AIRPORTS.filter((a) => a.popular);
  }
  const q = query.trim().toLowerCase();
  return AIRPORTS.filter((a) =>
    a.code.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.state.toLowerCase().includes(q)
  );
}

export function getNearbyAirports(code: string): Airport[] {
  const airport = getAirportByCode(code);
  if (!airport || !airport.nearbyAirportCodes) return [];
  return airport.nearbyAirportCodes
    .map((c) => getAirportByCode(c))
    .filter((a): a is Airport => Boolean(a));
}
