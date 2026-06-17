export type FleetVehicleStatus = "active" | "in_maintenance" | "retired";
export type FleetGpsStatus = "moving" | "idle" | "parked" | "offline";
export type FleetDocumentStatus = "valid" | "expiring" | "expired";

export interface FleetDocument {
  id: string;
  type: "Registration" | "Insurance" | "Inspection";
  status: FleetDocumentStatus;
  expiresAt: string;
  version: string;
}

export interface FleetVehicle {
  id: string;
  unitNumber: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  status: FleetVehicleStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  odometer: number;
  currentLocation: string;
  lat: number;
  lng: number;
  gpsStatus: FleetGpsStatus;
  speedMph: number;
  direction: string;
  nextServiceDate: string;
  nextServiceMileage: number;
  fuelEfficiencyMpg: number;
  maintenanceCostYtd: number;
  documents: FleetDocument[];
}

export interface FleetDriver {
  id: string;
  name: string;
  status: "active" | "on_leave" | "suspended" | "terminated";
  licenseNumber: string;
  licenseClass: string;
  licenseExpiresAt: string;
  assignedVehicleId?: string;
  currentJob?: string;
}

export interface FleetMaintenanceLog {
  id: string;
  vehicleId: string;
  vehicleUnit: string;
  type: "Oil Change" | "Repair" | "Inspection" | "Tire Service";
  date: string;
  cost: number;
  vendor: string;
  odometer: number;
  description: string;
  receiptStatus: "attached" | "missing";
}

export interface FleetFuelLog {
  id: string;
  vehicleId: string;
  vehicleUnit: string;
  date: string;
  gallons: number;
  cost: number;
  odometer: number;
  vendor: string;
}

export interface FleetRoutePoint {
  id: string;
  label: string;
  timestamp: string;
  lat: number;
  lng: number;
  type: "origin" | "stop" | "incident" | "destination";
  speedMph: number;
  note: string;
}

export interface FleetRouteHistory {
  id: string;
  vehicleId: string;
  vehicleUnit: string;
  driverName: string;
  date: string;
  startTime: string;
  endTime: string;
  distanceMiles: number;
  durationMinutes: number;
  averageSpeedMph: number;
  stops: number;
  behaviorEvents: {
    speeding: number;
    harshBraking: number;
    idling: number;
  };
  points: FleetRoutePoint[];
}

export interface FleetGeofence {
  id: string;
  name: string;
  linkedTo: string;
  alertType: "entry" | "exit" | "both";
  radiusMeters: number;
  status: "active" | "paused";
  lat: number;
  lng: number;
  shape: "circle" | "polygon";
  lastEventAt: string;
}

export interface FleetGeofenceEvent {
  id: string;
  geofenceId: string;
  geofenceName: string;
  vehicleId: string;
  vehicleUnit: string;
  driverName: string;
  eventType: "entry" | "exit";
  happenedAt: string;
  linkedRecord: string;
}

export interface FleetData {
  vehicles: FleetVehicle[];
  drivers: FleetDriver[];
  maintenanceLogs: FleetMaintenanceLog[];
  fuelLogs: FleetFuelLog[];
  geofences: FleetGeofence[];
  routeHistories: FleetRouteHistory[];
  geofenceEvents: FleetGeofenceEvent[];
}

export function getFleetData(): FleetData {
  const vehicles: FleetVehicle[] = [
    {
      id: "veh_1",
      unitNumber: "TRK-104",
      make: "Ford",
      model: "Transit 250",
      year: 2023,
      vin: "1FTBR1C80PKA10422",
      licensePlate: "NY-FS104",
      status: "active",
      assignedDriverId: "drv_1",
      assignedDriverName: "Ethan Brooks",
      odometer: 42180,
      currentLocation: "Midtown East",
      lat: 40.7549,
      lng: -73.984,
      gpsStatus: "moving",
      speedMph: 32,
      direction: "NE",
      nextServiceDate: "2026-06-12",
      nextServiceMileage: 45000,
      fuelEfficiencyMpg: 18.4,
      maintenanceCostYtd: 2840,
      documents: [
        {
          id: "doc_veh_1_reg",
          type: "Registration",
          status: "valid",
          expiresAt: "2027-02-01",
          version: "v3",
        },
        {
          id: "doc_veh_1_ins",
          type: "Insurance",
          status: "valid",
          expiresAt: "2027-01-15",
          version: "v2",
        },
      ],
    },
    {
      id: "veh_2",
      unitNumber: "TRK-118",
      make: "Mercedes-Benz",
      model: "Sprinter",
      year: 2022,
      vin: "W1Y4ECHY2NT118991",
      licensePlate: "NY-FS118",
      status: "active",
      assignedDriverId: "drv_2",
      assignedDriverName: "Nora Kim",
      odometer: 58710,
      currentLocation: "Upper West Side",
      lat: 40.787,
      lng: -73.9754,
      gpsStatus: "idle",
      speedMph: 0,
      direction: "N",
      nextServiceDate: "2026-05-28",
      nextServiceMileage: 60000,
      fuelEfficiencyMpg: 17.1,
      maintenanceCostYtd: 3660,
      documents: [
        {
          id: "doc_veh_2_reg",
          type: "Registration",
          status: "expiring",
          expiresAt: "2026-06-04",
          version: "v2",
        },
        {
          id: "doc_veh_2_insp",
          type: "Inspection",
          status: "valid",
          expiresAt: "2026-10-15",
          version: "v1",
        },
      ],
    },
    {
      id: "veh_3",
      unitNumber: "VAN-212",
      make: "Ram",
      model: "ProMaster",
      year: 2021,
      vin: "3C6MRVJG5ME212401",
      licensePlate: "NY-FS212",
      status: "in_maintenance",
      assignedDriverId: "drv_3",
      assignedDriverName: "Caleb Reed",
      odometer: 74620,
      currentLocation: "Queens service yard",
      lat: 40.744,
      lng: -73.932,
      gpsStatus: "parked",
      speedMph: 0,
      direction: "W",
      nextServiceDate: "2026-05-24",
      nextServiceMileage: 75000,
      fuelEfficiencyMpg: 15.8,
      maintenanceCostYtd: 5120,
      documents: [
        {
          id: "doc_veh_3_ins",
          type: "Insurance",
          status: "expiring",
          expiresAt: "2026-05-30",
          version: "v4",
        },
      ],
    },
    {
      id: "veh_4",
      unitNumber: "TRK-305",
      make: "Chevrolet",
      model: "Express",
      year: 2020,
      vin: "1GCWGAFG1L1305622",
      licensePlate: "NY-FS305",
      status: "active",
      odometer: 83110,
      currentLocation: "Brooklyn",
      lat: 40.6782,
      lng: -73.9442,
      gpsStatus: "offline",
      speedMph: 0,
      direction: "S",
      nextServiceDate: "2026-07-08",
      nextServiceMileage: 86000,
      fuelEfficiencyMpg: 14.9,
      maintenanceCostYtd: 2180,
      documents: [
        {
          id: "doc_veh_4_reg",
          type: "Registration",
          status: "valid",
          expiresAt: "2027-04-20",
          version: "v1",
        },
      ],
    },
  ];

  const drivers: FleetDriver[] = [
    {
      id: "drv_1",
      name: "Ethan Brooks",
      status: "active",
      licenseNumber: "DL-5839210",
      licenseClass: "C",
      licenseExpiresAt: "2027-08-14",
      assignedVehicleId: "veh_1",
      currentJob: "JOB-1102",
    },
    {
      id: "drv_2",
      name: "Nora Kim",
      status: "active",
      licenseNumber: "DL-4492102",
      licenseClass: "C",
      licenseExpiresAt: "2026-06-18",
      assignedVehicleId: "veh_2",
      currentJob: "JOB-1104",
    },
    {
      id: "drv_3",
      name: "Caleb Reed",
      status: "on_leave",
      licenseNumber: "DL-7812030",
      licenseClass: "C",
      licenseExpiresAt: "2026-05-29",
      assignedVehicleId: "veh_3",
    },
  ];

  const maintenanceLogs: FleetMaintenanceLog[] = [
    {
      id: "maint_1",
      vehicleId: "veh_1",
      vehicleUnit: "TRK-104",
      type: "Oil Change",
      date: "2026-05-12",
      cost: 186,
      vendor: "Manhattan Fleet Care",
      odometer: 41860,
      description: "Synthetic oil change and multipoint inspection.",
      receiptStatus: "attached",
    },
    {
      id: "maint_2",
      vehicleId: "veh_3",
      vehicleUnit: "VAN-212",
      type: "Repair",
      date: "2026-05-19",
      cost: 1240,
      vendor: "Queens Commercial Auto",
      odometer: 74620,
      description: "Brake service and rear rotor replacement.",
      receiptStatus: "attached",
    },
    {
      id: "maint_3",
      vehicleId: "veh_2",
      vehicleUnit: "TRK-118",
      type: "Inspection",
      date: "2026-05-02",
      cost: 95,
      vendor: "Westside Inspection",
      odometer: 57990,
      description: "Annual safety inspection.",
      receiptStatus: "missing",
    },
  ];

  const fuelLogs: FleetFuelLog[] = [
    {
      id: "fuel_1",
      vehicleId: "veh_1",
      vehicleUnit: "TRK-104",
      date: "2026-05-20",
      gallons: 18.2,
      cost: 72,
      odometer: 42110,
      vendor: "Shell Midtown",
    },
    {
      id: "fuel_2",
      vehicleId: "veh_2",
      vehicleUnit: "TRK-118",
      date: "2026-05-19",
      gallons: 21.7,
      cost: 88,
      odometer: 58620,
      vendor: "BP Upper West",
    },
    {
      id: "fuel_3",
      vehicleId: "veh_4",
      vehicleUnit: "TRK-305",
      date: "2026-05-17",
      gallons: 24.1,
      cost: 94,
      odometer: 83040,
      vendor: "Sunoco Brooklyn",
    },
  ];

  const geofences: FleetGeofence[] = [
    {
      id: "geo_1",
      name: "Chen Dental Group",
      linkedTo: "JOB-1104",
      alertType: "both",
      radiusMeters: 150,
      status: "active",
      lat: 40.7527,
      lng: -73.9772,
      shape: "circle",
      lastEventAt: "2026-05-22T10:26:00",
    },
    {
      id: "geo_2",
      name: "Northstar HQ",
      linkedTo: "Fleet yard",
      alertType: "entry",
      radiusMeters: 250,
      status: "active",
      lat: 40.752,
      lng: -73.9817,
      shape: "polygon",
      lastEventAt: "2026-05-22T08:15:00",
    },
    {
      id: "geo_3",
      name: "Brooklyn Priority Zone",
      linkedTo: "Customer cluster",
      alertType: "exit",
      radiusMeters: 400,
      status: "paused",
      lat: 40.6782,
      lng: -73.9442,
      shape: "circle",
      lastEventAt: "2026-05-21T16:44:00",
    },
  ];

  const routeHistories: FleetRouteHistory[] = [
    {
      id: "route_1",
      vehicleId: "veh_1",
      vehicleUnit: "TRK-104",
      driverName: "Ethan Brooks",
      date: "2026-05-22",
      startTime: "08:05",
      endTime: "10:42",
      distanceMiles: 24.8,
      durationMinutes: 157,
      averageSpeedMph: 18.6,
      stops: 4,
      behaviorEvents: {
        speeding: 0,
        harshBraking: 1,
        idling: 2,
      },
      points: [
        {
          id: "route_1_p1",
          label: "Yard",
          timestamp: "08:05",
          lat: 40.752,
          lng: -73.9817,
          type: "origin",
          speedMph: 0,
          note: "Departed Northstar HQ.",
        },
        {
          id: "route_1_p2",
          label: "Stop 1",
          timestamp: "08:48",
          lat: 40.7618,
          lng: -73.9776,
          type: "stop",
          speedMph: 23,
          note: "Parts pickup completed.",
        },
        {
          id: "route_1_p3",
          label: "Event",
          timestamp: "09:22",
          lat: 40.7484,
          lng: -73.9857,
          type: "incident",
          speedMph: 12,
          note: "Harsh braking detected near W 33rd St.",
        },
        {
          id: "route_1_p4",
          label: "Stop 2",
          timestamp: "10:08",
          lat: 40.7549,
          lng: -73.984,
          type: "destination",
          speedMph: 0,
          note: "Arrived at JOB-1102.",
        },
      ],
    },
    {
      id: "route_2",
      vehicleId: "veh_2",
      vehicleUnit: "TRK-118",
      driverName: "Nora Kim",
      date: "2026-05-22",
      startTime: "07:40",
      endTime: "09:55",
      distanceMiles: 18.3,
      durationMinutes: 135,
      averageSpeedMph: 16.1,
      stops: 3,
      behaviorEvents: {
        speeding: 1,
        harshBraking: 0,
        idling: 1,
      },
      points: [
        {
          id: "route_2_p1",
          label: "Yard",
          timestamp: "07:40",
          lat: 40.752,
          lng: -73.9817,
          type: "origin",
          speedMph: 0,
          note: "Route started from Fleet yard.",
        },
        {
          id: "route_2_p2",
          label: "Stop 1",
          timestamp: "08:31",
          lat: 40.7736,
          lng: -73.9566,
          type: "stop",
          speedMph: 19,
          note: "Customer access confirmed.",
        },
        {
          id: "route_2_p3",
          label: "Alert",
          timestamp: "09:12",
          lat: 40.7829,
          lng: -73.9654,
          type: "incident",
          speedMph: 41,
          note: "Speed threshold crossed for 45 seconds.",
        },
        {
          id: "route_2_p4",
          label: "Stop 2",
          timestamp: "09:55",
          lat: 40.787,
          lng: -73.9754,
          type: "destination",
          speedMph: 0,
          note: "Arrived at JOB-1104.",
        },
      ],
    },
    {
      id: "route_3",
      vehicleId: "veh_4",
      vehicleUnit: "TRK-305",
      driverName: "Unassigned",
      date: "2026-05-21",
      startTime: "13:10",
      endTime: "15:06",
      distanceMiles: 14.6,
      durationMinutes: 116,
      averageSpeedMph: 15.4,
      stops: 2,
      behaviorEvents: {
        speeding: 0,
        harshBraking: 0,
        idling: 3,
      },
      points: [
        {
          id: "route_3_p1",
          label: "Depot",
          timestamp: "13:10",
          lat: 40.6943,
          lng: -73.9866,
          type: "origin",
          speedMph: 0,
          note: "Brooklyn depot departure.",
        },
        {
          id: "route_3_p2",
          label: "Stop 1",
          timestamp: "14:02",
          lat: 40.6872,
          lng: -73.9754,
          type: "stop",
          speedMph: 17,
          note: "Inventory drop completed.",
        },
        {
          id: "route_3_p3",
          label: "Stop 2",
          timestamp: "15:06",
          lat: 40.6782,
          lng: -73.9442,
          type: "destination",
          speedMph: 0,
          note: "Last known GPS check-in before device went offline.",
        },
      ],
    },
  ];

  const geofenceEvents: FleetGeofenceEvent[] = [
    {
      id: "geoevt_1",
      geofenceId: "geo_1",
      geofenceName: "Chen Dental Group",
      vehicleId: "veh_2",
      vehicleUnit: "TRK-118",
      driverName: "Nora Kim",
      eventType: "entry",
      happenedAt: "2026-05-22T10:26:00",
      linkedRecord: "JOB-1104",
    },
    {
      id: "geoevt_2",
      geofenceId: "geo_2",
      geofenceName: "Northstar HQ",
      vehicleId: "veh_1",
      vehicleUnit: "TRK-104",
      driverName: "Ethan Brooks",
      eventType: "exit",
      happenedAt: "2026-05-22T08:15:00",
      linkedRecord: "Fleet yard",
    },
    {
      id: "geoevt_3",
      geofenceId: "geo_3",
      geofenceName: "Brooklyn Priority Zone",
      vehicleId: "veh_4",
      vehicleUnit: "TRK-305",
      driverName: "Unassigned",
      eventType: "exit",
      happenedAt: "2026-05-21T16:44:00",
      linkedRecord: "Customer cluster",
    },
  ];

  return {
    vehicles,
    drivers,
    maintenanceLogs,
    fuelLogs,
    geofences,
    routeHistories,
    geofenceEvents,
  };
}

export function formatFleetDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatFleetCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
