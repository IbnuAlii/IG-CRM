import {
  Customer,
  CrmSubscription,
  CrmTenant,
  Driver,
  Ride,
  SuperAdminDashboardData,
  SystemAlert,
  SystemHealthMetric,
  TenantRegistration,
  SupportTicket,
  PromotionCode,
  Vehicle,
  SavedAddress,
  PaymentMethod,
  AdminDashboardData,
  AdminCustomerRecord,
  AdminEmployee,
  AdminJob,
  AdminQuote,
  AdminReport,
  AdminTicket,
} from '@/types';

const CITIES = {
  'New York': { lat: 40.7128, lng: -74.006 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'Chicago': { lat: 41.8781, lng: -87.6298 },
  'Houston': { lat: 29.7604, lng: -95.3698 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
};

const FIRST_NAMES = [
  'John', 'Emma', 'Michael', 'Sarah', 'David', 'Jessica', 'James', 'Emily',
  'Robert', 'Amanda', 'William', 'Lisa', 'Richard', 'Michelle', 'Charles', 'Angela',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
];

const CAR_BRANDS = [
  { make: 'Toyota', models: ['Prius', 'Camry', 'Corolla'] },
  { make: 'Honda', models: ['Civic', 'Accord', 'CR-V'] },
  { make: 'Hyundai', models: ['Elantra', 'Sonata', 'Tucson'] },
  { make: 'Ford', models: ['Focus', 'Fusion', 'Escape'] },
  { make: 'Nissan', models: ['Altima', 'Sentra', 'Rogue'] },
];

const COLORS = ['Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Gold'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomName(): string {
  return `${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`;
}

function getRandomEmail(name: string): string {
  return name.toLowerCase().replace(' ', '.') + Math.floor(Math.random() * 1000) + '@example.com';
}

function getRandomPhone(): string {
  return '+1' + Math.floor(Math.random() * 9000000000 + 1000000000);
}

function getRandomCity(): string {
  return getRandomItem(Object.keys(CITIES));
}

function getRandomCoordinates(city: string): { lat: number; lng: number } {
  const cityCoords = CITIES[city as keyof typeof CITIES];
  const offset = 0.05;
  return {
    lat: cityCoords.lat + (Math.random() - 0.5) * offset,
    lng: cityCoords.lng + (Math.random() - 0.5) * offset,
  };
}

export function generateMockCustomers(count: number = 50): Customer[] {
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const name = getRandomName();
    const city = getRandomCity();
    const { lat, lng } = getRandomCoordinates(city);

    const customer: Customer = {
      id: `cust_${i + 1}`,
      name,
      email: getRandomEmail(name),
      phone: getRandomPhone(),
      role: 'customer',
      city,
      avatar: `https://i.pravatar.cc/150?img=${i}`,
      rating: Math.floor(Math.random() * 20 + 40) / 10, // 4.0 - 6.0
      totalRides: Math.floor(Math.random() * 200 + 5),
      savedAddresses: [
        {
          id: `addr_${i}_0`,
          label: 'home',
          address: `${Math.floor(Math.random() * 9000 + 1000)} Main St, ${city}`,
          latitude: lat,
          longitude: lng,
          placeId: `place_${i}_0`,
        },
        {
          id: `addr_${i}_1`,
          label: 'work',
          address: `${Math.floor(Math.random() * 9000 + 1000)} Business Ave, ${city}`,
          latitude: lat + 0.01,
          longitude: lng + 0.01,
          placeId: `place_${i}_1`,
        },
      ] as SavedAddress[],
      paymentMethods: [
        {
          id: `pm_${i}_0`,
          type: 'card',
          name: 'Visa',
          isDefault: true,
          last4: String(Math.floor(Math.random() * 9000 + 1000)),
          expiryDate: '12/25',
        },
        {
          id: `pm_${i}_1`,
          type: 'wallet',
          name: 'Wallet',
          isDefault: false,
        },
      ] as PaymentMethod[],
      ridePreferences: {
        musicPreference: getRandomItem(['quiet', 'music']),
        temperature: getRandomItem(['cold', 'cool', 'warm', 'hot']),
        conversationLevel: getRandomItem(['quiet', 'normal', 'chatty']),
      },
      emergencyContact: {
        name: `${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`,
        phone: getRandomPhone(),
      },
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    };

    customers.push(customer);
  }

  return customers;
}

export function generateMockVehicles(count: number = 50): Vehicle[] {
  const vehicles: Vehicle[] = [];

  for (let i = 0; i < count; i++) {
    const brand = getRandomItem(CAR_BRANDS);
    const vehicle: Vehicle = {
      id: `veh_${i + 1}`,
      driverId: `drv_${i + 1}`,
      make: brand.make,
      model: getRandomItem(brand.models),
      year: Math.floor(Math.random() * 5 + 2020),
      color: getRandomItem(COLORS),
      licensePlate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9000 + 1000)}`,
      registrationNumber: `REG${Math.floor(Math.random() * 900000 + 100000)}`,
      insuranceExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      mileage: Math.floor(Math.random() * 100000 + 10000),
      type: getRandomItem(['economy', 'premium', 'xl']),
      seats: getRandomItem(['economy', 'xl']) === 'economy' ? 4 : 6,
      ac: true,
      wifi: Math.random() > 0.3,
      usb: Math.random() > 0.2,
    };

    vehicles.push(vehicle);
  }

  return vehicles;
}

export function generateMockDrivers(vehicles: Vehicle[], count: number = 50): Driver[] {
  const drivers: Driver[] = [];

  for (let i = 0; i < count; i++) {
    const name = getRandomName();
    const city = getRandomCity();
    const { lat, lng } = getRandomCoordinates(city);
    const vehicle = vehicles[i];

    const driver: Driver = {
      id: `drv_${i + 1}`,
      name,
      email: getRandomEmail(name),
      phone: getRandomPhone(),
      role: 'driver',
      city,
      avatar: `https://i.pravatar.cc/150?img=${i + 100}`,
      licenseNumber: `DL${Math.floor(Math.random() * 9000000 + 1000000)}`,
      licenseExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      vehicleId: vehicle.id,
      vehicle,
      status: getRandomItem(['offline', 'online', 'on-ride', 'on-break']),
      currentLocation: { latitude: lat, longitude: lng },
      rating: Math.floor(Math.random() * 20 + 40) / 10,
      totalRides: Math.floor(Math.random() * 5000 + 100),
      earnings: {
        today: Math.floor(Math.random() * 200 + 50),
        week: Math.floor(Math.random() * 1500 + 300),
        month: Math.floor(Math.random() * 8000 + 1000),
      },
      bankAccount: {
        accountHolder: name,
        accountNumber: String(Math.floor(Math.random() * 900000000 + 100000000)),
        routingNumber: String(Math.floor(Math.random() * 900000 + 100000)),
      },
      documents: [
        {
          id: `doc_${i}_0`,
          type: 'license',
          status: 'verified',
          expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        {
          id: `doc_${i}_1`,
          type: 'insurance',
          status: 'verified',
          expiryDate: new Date(Date.now() + 1 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        {
          id: `doc_${i}_2`,
          type: 'background-check',
          status: 'verified',
          expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
      ],
      acceptanceRate: Math.floor(Math.random() * 40 + 60) / 100,
      cancellationRate: Math.floor(Math.random() * 15) / 100,
      onTimePercentage: Math.floor(Math.random() * 30 + 70) / 100,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    };

    drivers.push(driver);
  }

  return drivers;
}

export function generateMockRides(customers: Customer[], drivers: Driver[], count: number = 100): Ride[] {
  const rides: Ride[] = [];
  const statuses: Array<'requested' | 'accepted' | 'picked-up' | 'in-progress' | 'completed' | 'cancelled'> = [
    'requested',
    'accepted',
    'picked-up',
    'in-progress',
    'completed',
    'cancelled',
  ];

  for (let i = 0; i < count; i++) {
    const customer = getRandomItem(customers);
    const driver = getRandomItem(drivers);
    const city = customer.city || 'New York';
    const cityCoords = CITIES[city as keyof typeof CITIES];

    const pickupOffset = (Math.random() - 0.5) * 0.1;
    const dropoffOffset = (Math.random() - 0.5) * 0.1;

    const pickupLat = cityCoords.lat + pickupOffset;
    const pickupLng = cityCoords.lng + pickupOffset;
    const dropoffLat = cityCoords.lat + dropoffOffset;
    const dropoffLng = cityCoords.lng + dropoffOffset;

    const distance = Math.sqrt(Math.pow(pickupLat - dropoffLat, 2) + Math.pow(pickupLng - dropoffLng, 2)) * 111; // rough km conversion
    const duration = Math.floor(distance * 2 + Math.random() * 10);

    const baseFare = 2.5;
    const distanceFare = distance * 1.5;
    const timeFare = duration * 0.25;
    const surgePricingMultiplier = Math.random() > 0.7 ? 1.5 : 1;
    const discount = Math.random() > 0.9 ? Math.floor(Math.random() * 200) : 0;

    const status = getRandomItem(statuses);

    const ride: Ride = {
      id: `ride_${i + 1}`,
      customerId: customer.id,
      customer,
      driverId: driver.id,
      driver,
      pickupLocation: {
        latitude: pickupLat,
        longitude: pickupLng,
        address: `${Math.floor(Math.random() * 9000 + 1000)} Street, ${city}`,
      },
      dropoffLocation: {
        latitude: dropoffLat,
        longitude: dropoffLng,
        address: `${Math.floor(Math.random() * 9000 + 1000)} Avenue, ${city}`,
      },
      status,
      rideType: getRandomItem(['economy', 'premium', 'xl']),
      fare: {
        baseFare,
        distanceFare: Math.round(distanceFare * 100) / 100,
        timeFare: Math.round(timeFare * 100) / 100,
        surgePricingMultiplier,
        discount,
        total: Math.round((baseFare + distanceFare + timeFare) * surgePricingMultiplier - discount),
        currency: 'USD',
      },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      route: {
        distance: Math.round(distance * 100) / 100,
        duration,
        waypoints: [
          { latitude: pickupLat, longitude: pickupLng },
          { latitude: dropoffLat, longitude: dropoffLng },
        ],
      },
      feedback:
        status === 'completed'
          ? {
              driverId: driver.id,
              customerId: customer.id,
              rideId: `ride_${i + 1}`,
              driverRating: Math.floor(Math.random() * 20 + 30) / 10,
              rideRating: Math.floor(Math.random() * 20 + 30) / 10,
              comments: 'Great ride!',
              createdAt: new Date(),
            }
          : undefined,
    };

    rides.push(ride);
  }

  return rides;
}

export function generateMockTickets(customers: Customer[], count: number = 30): SupportTicket[] {
  const tickets: SupportTicket[] = [];
  const types: Array<'safety' | 'lost-item' | 'billing' | 'ride-issue' | 'driver-issue' | 'other'> = [
    'safety',
    'lost-item',
    'billing',
    'ride-issue',
    'driver-issue',
    'other',
  ];
  const statuses: Array<'open' | 'in-progress' | 'resolved' | 'closed'> = ['open', 'in-progress', 'resolved', 'closed'];

  for (let i = 0; i < count; i++) {
    const customer = getRandomItem(customers);
    const type = getRandomItem(types);

    const ticket: SupportTicket = {
      id: `ticket_${i + 1}`,
      userId: customer.id,
      type,
      subject: `Issue with ${type}`,
      description: `Customer reported an issue: ${type}`,
      status: getRandomItem(statuses),
      priority: getRandomItem(['low', 'medium', 'high', 'urgent']),
      messages: [
        {
          id: `msg_${i}_0`,
          ticketId: `ticket_${i + 1}`,
          userId: customer.id,
          message: 'I have an issue with my recent ride.',
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    tickets.push(ticket);
  }

  return tickets;
}

export function generateMockPromotions(): PromotionCode[] {
  return [
    {
      id: 'promo_1',
      code: 'WELCOME50',
      type: 'percentage',
      value: 50,
      description: 'Welcome offer - 50% off first ride',
      maxUses: 10000,
      currentUses: 3421,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      minRideAmount: 10,
      maxDiscount: 25,
      applicable_ride_types: ['economy', 'premium'],
      active: true,
    },
    {
      id: 'promo_2',
      code: 'SUMMER2024',
      type: 'fixed',
      value: 10,
      description: 'Summer special - $10 off',
      maxUses: 5000,
      currentUses: 2100,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      minRideAmount: 20,
      applicable_ride_types: ['economy', 'premium', 'xl'],
      active: true,
    },
    {
      id: 'promo_3',
      code: 'PREMIUM20',
      type: 'percentage',
      value: 20,
      description: 'Premium members get 20% off',
      maxUses: 1000,
      currentUses: 234,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      applicable_ride_types: ['premium'],
      active: true,
    },
  ];
}

export function generateMockData() {
  const vehicles = generateMockVehicles(50);
  const customers = generateMockCustomers(50);
  const drivers = generateMockDrivers(vehicles, 50);
  const rides = generateMockRides(customers, drivers, 100);
  const tickets = generateMockTickets(customers, 30);
  const promotions = generateMockPromotions();

  return {
    vehicles,
    customers,
    drivers,
    rides,
    tickets,
    promotions,
  };
}

export function generateSuperAdminDashboardData(): SuperAdminDashboardData {
  const tenants: CrmTenant[] = [
    {
      id: 'tenant_1',
      name: 'Northstar HVAC Services',
      subdomain: 'northstar',
      status: 'active',
      subscriptionPlan: 'enterprise',
      subscriptionStatus: 'active',
      billingEmail: 'billing@northstarhvac.com',
      adminName: 'Avery Collins',
      adminEmail: 'avery@northstarhvac.com',
      usersCount: 86,
      createdAt: new Date('2025-08-14'),
    },
    {
      id: 'tenant_2',
      name: 'BrightLine Plumbing',
      subdomain: 'brightline',
      status: 'trial',
      subscriptionPlan: 'professional',
      subscriptionStatus: 'trial',
      billingEmail: 'accounts@brightlineplumbing.com',
      adminName: 'Maya Patel',
      adminEmail: 'maya@brightlineplumbing.com',
      usersCount: 34,
      createdAt: new Date('2026-05-02'),
      trialEndsAt: new Date('2026-06-01'),
    },
    {
      id: 'tenant_3',
      name: 'MetroCare Cleaning',
      subdomain: 'metrocare',
      status: 'active',
      subscriptionPlan: 'basic',
      subscriptionStatus: 'active',
      billingEmail: 'finance@metrocarecleaning.com',
      adminName: 'Jordan Lee',
      adminEmail: 'jordan@metrocarecleaning.com',
      usersCount: 12,
      createdAt: new Date('2026-01-18'),
    },
    {
      id: 'tenant_4',
      name: 'RapidFix Electrical',
      subdomain: 'rapidfix',
      status: 'suspended',
      subscriptionPlan: 'professional',
      subscriptionStatus: 'past_due',
      billingEmail: 'billing@rapidfixelectrical.com',
      adminName: 'Sam Rivera',
      adminEmail: 'sam@rapidfixelectrical.com',
      usersCount: 41,
      createdAt: new Date('2025-11-21'),
    },
    {
      id: 'tenant_5',
      name: 'GreenScape Field Services',
      subdomain: 'greenscape',
      status: 'active',
      subscriptionPlan: 'professional',
      subscriptionStatus: 'active',
      billingEmail: 'ops@greenscapefield.com',
      adminName: 'Nora Bennett',
      adminEmail: 'nora@greenscapefield.com',
      usersCount: 52,
      createdAt: new Date('2025-10-07'),
    },
  ];

  const registrations: TenantRegistration[] = [
    {
      id: 'reg_1',
      companyName: 'Summit Garage Doors',
      adminName: 'Leo Martinez',
      adminEmail: 'leo@summitgaragedoors.com',
      requestedPlan: 'professional',
      status: 'pending',
      submittedAt: new Date('2026-05-18T09:30:00'),
    },
    {
      id: 'reg_2',
      companyName: 'ClearWater Pools',
      adminName: 'Priya Shah',
      adminEmail: 'priya@clearwaterpools.com',
      requestedPlan: 'basic',
      status: 'pending',
      submittedAt: new Date('2026-05-17T15:45:00'),
    },
    {
      id: 'reg_3',
      companyName: 'Atlas Maintenance Group',
      adminName: 'Owen Carter',
      adminEmail: 'owen@atlasmaintenance.com',
      requestedPlan: 'enterprise',
      status: 'pending',
      submittedAt: new Date('2026-05-16T11:20:00'),
    },
  ];

  const subscriptions: CrmSubscription[] = tenants.map((tenant, index) => ({
    id: `sub_${index + 1}`,
    tenantId: tenant.id,
    tenantName: tenant.name,
    plan: tenant.subscriptionPlan,
    status: tenant.subscriptionStatus,
    monthlyAmount:
      tenant.subscriptionPlan === 'enterprise' ? 999 : tenant.subscriptionPlan === 'professional' ? 399 : 99,
    currentPeriodStart: new Date('2026-05-01'),
    currentPeriodEnd: new Date('2026-05-31'),
  }));

  const systemHealth: SystemHealthMetric = {
    apiStatus: 'operational',
    databaseStatus: 'operational',
    websocketStatus: 'operational',
    avgResponseTimeMs: 214,
    errorRate: 0.18,
    uptime: 99.98,
    checkedAt: new Date('2026-05-19T13:05:00'),
  };

  const alerts: SystemAlert[] = [
    {
      id: 'alert_1',
      title: 'Payment retry required',
      description: 'RapidFix Electrical has a past due subscription invoice.',
      severity: 'warning',
      createdAt: new Date('2026-05-19T08:40:00'),
      resolved: false,
    },
    {
      id: 'alert_2',
      title: 'Tenant provisioning queue',
      description: '3 new registrations are waiting for Super Admin approval.',
      severity: 'info',
      createdAt: new Date('2026-05-18T16:10:00'),
      resolved: false,
    },
    {
      id: 'alert_3',
      title: 'API latency spike resolved',
      description: 'Average response time returned below the 500ms target.',
      severity: 'info',
      createdAt: new Date('2026-05-18T12:15:00'),
      resolved: true,
    },
  ];

  const revenueTrend = [
    { month: 'Jan', revenue: 6700, tenants: 22 },
    { month: 'Feb', revenue: 7900, tenants: 27 },
    { month: 'Mar', revenue: 9300, tenants: 31 },
    { month: 'Apr', revenue: 11200, tenants: 36 },
    { month: 'May', revenue: 12800, tenants: 41 },
  ];

  return {
    tenants,
    registrations,
    subscriptions,
    systemHealth,
    alerts,
    revenueTrend,
  };
}

export function generateAdminDashboardData(): AdminDashboardData {
  const employees: AdminEmployee[] = [
    {
      id: 'emp_1',
      name: 'Maya Ortiz',
      email: 'maya.ortiz@northstarhvac.com',
      phone: '+1 212 555 0191',
      role: 'dispatcher',
      status: 'active',
      skills: ['Scheduling', 'Customer communication', 'Route planning'],
      capacityHours: 40,
      scheduledHours: 34,
      jobsCompleted: 142,
      rating: 4.8,
      currentLocation: 'Operations desk',
    },
    {
      id: 'emp_2',
      name: 'Ethan Brooks',
      email: 'ethan.brooks@northstarhvac.com',
      phone: '+1 212 555 0174',
      role: 'technician',
      status: 'active',
      skills: ['HVAC', 'Electrical', 'EPA 608'],
      capacityHours: 38,
      scheduledHours: 32,
      jobsCompleted: 286,
      rating: 4.9,
      currentLocation: 'Midtown East',
    },
    {
      id: 'emp_3',
      name: 'Nora Kim',
      email: 'nora.kim@northstarhvac.com',
      phone: '+1 212 555 0144',
      role: 'technician',
      status: 'active',
      skills: ['Plumbing', 'Boilers', 'Emergency repair'],
      capacityHours: 38,
      scheduledHours: 29,
      jobsCompleted: 231,
      rating: 4.7,
      currentLocation: 'Upper West Side',
    },
    {
      id: 'emp_4',
      name: 'Caleb Reed',
      email: 'caleb.reed@northstarhvac.com',
      phone: '+1 212 555 0182',
      role: 'technician',
      status: 'on_leave',
      skills: ['Appliance repair', 'Diagnostics'],
      capacityHours: 20,
      scheduledHours: 12,
      jobsCompleted: 97,
      rating: 4.5,
      currentLocation: 'Queens',
    },
    {
      id: 'emp_5',
      name: 'Sofia Bennett',
      email: 'sofia.bennett@northstarhvac.com',
      phone: '+1 212 555 0137',
      role: 'manager',
      status: 'active',
      skills: ['Field operations', 'Quality review', 'Escalations'],
      capacityHours: 40,
      scheduledHours: 37,
      jobsCompleted: 118,
      rating: 4.8,
      currentLocation: 'Main office',
    },
  ];

  const customers: AdminCustomerRecord[] = [
    {
      id: 'cust_crm_1',
      name: 'Olivia Martin',
      company: 'Martin Family Trust',
      email: 'olivia.martin@example.com',
      phone: '+1 212 555 0101',
      status: 'vip',
      tags: ['Residential', 'Maintenance plan'],
      addresses: [
        {
          id: 'addr_crm_1',
          label: 'Home',
          address: '118 W 72nd St',
          city: 'New York',
          state: 'NY',
          isPrimary: true,
        },
      ],
      notes: 'Prefers morning appointments and SMS reminders.',
      lifetimeValue: 18420,
      openJobs: 1,
      lastServiceAt: new Date('2026-05-14T10:30:00'),
      createdAt: new Date('2024-09-18T09:20:00'),
      activity: [
        {
          id: 'act_1',
          type: 'job',
          title: 'Preventive maintenance completed',
          description: 'Spring HVAC tune-up completed by Ethan Brooks.',
          happenedAt: new Date('2026-05-14T10:30:00'),
        },
        {
          id: 'act_2',
          type: 'communication',
          title: 'Quote accepted',
          description: 'Approved quote QT-1044 for compressor replacement.',
          happenedAt: new Date('2026-05-10T15:15:00'),
        },
      ],
    },
    {
      id: 'cust_crm_2',
      name: 'Marcus Chen',
      company: 'Chen Dental Group',
      email: 'marcus.chen@example.com',
      phone: '+1 646 555 0116',
      status: 'active',
      tags: ['Commercial', 'Priority'],
      addresses: [
        {
          id: 'addr_crm_2',
          label: 'Clinic',
          address: '220 Madison Ave',
          city: 'New York',
          state: 'NY',
          isPrimary: true,
        },
      ],
      notes: 'Requires after-hours scheduling for treatment rooms.',
      lifetimeValue: 32680,
      openJobs: 2,
      lastServiceAt: new Date('2026-05-17T18:00:00'),
      createdAt: new Date('2023-11-04T11:10:00'),
      activity: [
        {
          id: 'act_3',
          type: 'ticket',
          title: 'Ticket opened',
          description: 'Cooling issue in suite 4 escalated to urgent.',
          happenedAt: new Date('2026-05-19T08:45:00'),
        },
      ],
    },
    {
      id: 'cust_crm_3',
      name: 'Priya Shah',
      company: 'ClearWater Pools',
      email: 'priya.shah@example.com',
      phone: '+1 718 555 0199',
      status: 'new',
      tags: ['Commercial', 'Lead converted'],
      addresses: [
        {
          id: 'addr_crm_3',
          label: 'Office',
          address: '44-12 Vernon Blvd',
          city: 'Queens',
          state: 'NY',
          isPrimary: true,
        },
      ],
      notes: 'Interested in recurring facility maintenance.',
      lifetimeValue: 2400,
      openJobs: 0,
      createdAt: new Date('2026-05-08T14:30:00'),
      activity: [
        {
          id: 'act_4',
          type: 'quote',
          title: 'Quote sent',
          description: 'Initial service quote sent for review.',
          happenedAt: new Date('2026-05-18T10:15:00'),
        },
      ],
    },
    {
      id: 'cust_crm_4',
      name: 'Daniel Rivera',
      company: 'Rivera Property Group',
      email: 'daniel.rivera@example.com',
      phone: '+1 917 555 0128',
      status: 'inactive',
      tags: ['Property management'],
      addresses: [
        {
          id: 'addr_crm_4',
          label: 'Portfolio',
          address: '501 Atlantic Ave',
          city: 'Brooklyn',
          state: 'NY',
          isPrimary: true,
        },
      ],
      notes: 'Needs reactivation campaign before summer season.',
      lifetimeValue: 11960,
      openJobs: 0,
      lastServiceAt: new Date('2025-12-12T13:00:00'),
      createdAt: new Date('2024-02-21T12:00:00'),
      activity: [],
    },
    {
      id: 'cust_crm_5',
      name: 'Avery Collins',
      company: 'Northstar HQ',
      email: 'avery.collins@example.com',
      phone: '+1 212 555 0166',
      status: 'do_not_contact',
      tags: ['Billing hold'],
      addresses: [
        {
          id: 'addr_crm_5',
          label: 'HQ',
          address: '9 E 40th St',
          city: 'New York',
          state: 'NY',
          isPrimary: true,
        },
      ],
      notes: 'Billing dispute in review. Do not send promotional outreach.',
      lifetimeValue: 8900,
      openJobs: 0,
      lastServiceAt: new Date('2026-03-03T09:00:00'),
      createdAt: new Date('2025-01-17T08:20:00'),
      activity: [],
    },
  ];

  const quotes: AdminQuote[] = [
    {
      id: 'quote_1',
      quoteNumber: 'QT-1044',
      customerId: 'cust_crm_1',
      customerName: 'Olivia Martin',
      serviceType: 'Compressor replacement',
      status: 'accepted',
      validUntil: new Date('2026-05-28T23:59:00'),
      createdAt: new Date('2026-05-10T12:30:00'),
      subtotal: 2850,
      tax: 256.5,
      total: 3106.5,
      assignedTo: 'Sofia Bennett',
      lineItems: [
        { id: 'qli_1', description: 'Compressor kit', quantity: 1, unitPrice: 2100, taxable: true },
        { id: 'qli_2', description: 'Labor', quantity: 5, unitPrice: 150, taxable: true },
      ],
    },
    {
      id: 'quote_2',
      quoteNumber: 'QT-1045',
      customerId: 'cust_crm_3',
      customerName: 'Priya Shah',
      serviceType: 'Facility maintenance setup',
      status: 'sent',
      validUntil: new Date('2026-06-02T23:59:00'),
      createdAt: new Date('2026-05-18T10:15:00'),
      subtotal: 1850,
      tax: 166.5,
      total: 2016.5,
      assignedTo: 'Maya Ortiz',
      lineItems: [
        { id: 'qli_3', description: 'Initial site inspection', quantity: 1, unitPrice: 650, taxable: true },
        { id: 'qli_4', description: 'Monthly maintenance retainer', quantity: 1, unitPrice: 1200, taxable: true },
      ],
    },
    {
      id: 'quote_3',
      quoteNumber: 'QT-1046',
      customerId: 'cust_crm_2',
      customerName: 'Marcus Chen',
      serviceType: 'Treatment room cooling upgrade',
      status: 'viewed',
      validUntil: new Date('2026-06-04T23:59:00'),
      createdAt: new Date('2026-05-19T09:20:00'),
      subtotal: 6400,
      tax: 576,
      total: 6976,
      assignedTo: 'Sofia Bennett',
      lineItems: [
        { id: 'qli_5', description: 'Mini-split unit', quantity: 2, unitPrice: 2400, taxable: true },
        { id: 'qli_6', description: 'Install labor', quantity: 8, unitPrice: 200, taxable: true },
      ],
    },
    {
      id: 'quote_4',
      quoteNumber: 'QT-1041',
      customerId: 'cust_crm_4',
      customerName: 'Daniel Rivera',
      serviceType: 'Boiler replacement study',
      status: 'expired',
      validUntil: new Date('2026-05-01T23:59:00'),
      createdAt: new Date('2026-04-10T11:45:00'),
      subtotal: 920,
      tax: 82.8,
      total: 1002.8,
      assignedTo: 'Maya Ortiz',
      lineItems: [
        { id: 'qli_7', description: 'Engineering assessment', quantity: 1, unitPrice: 920, taxable: true },
      ],
    },
  ];

  const jobs: AdminJob[] = [
    {
      id: 'job_1',
      jobNumber: 'JOB-2088',
      customerId: 'cust_crm_1',
      customerName: 'Olivia Martin',
      serviceType: 'Compressor replacement',
      description: 'Replace failed outdoor compressor and test refrigerant levels.',
      status: 'assigned',
      priority: 'high',
      technicianId: 'emp_2',
      technicianName: 'Ethan Brooks',
      scheduledStart: new Date('2026-05-20T09:00:00'),
      estimatedDurationMinutes: 240,
      address: '118 W 72nd St, New York, NY',
      quoteId: 'quote_1',
      recurring: false,
      specialInstructions: 'Customer requested arrival before 9:15 AM.',
    },
    {
      id: 'job_2',
      jobNumber: 'JOB-2089',
      customerId: 'cust_crm_2',
      customerName: 'Marcus Chen',
      serviceType: 'Emergency cooling repair',
      description: 'Diagnose cooling outage in suite 4 and restore service.',
      status: 'pending',
      priority: 'emergency',
      scheduledStart: new Date('2026-05-20T11:30:00'),
      estimatedDurationMinutes: 120,
      address: '220 Madison Ave, New York, NY',
      recurring: false,
      specialInstructions: 'Clinic is active. Check in at reception.',
    },
    {
      id: 'job_3',
      jobNumber: 'JOB-2090',
      customerId: 'cust_crm_2',
      customerName: 'Marcus Chen',
      serviceType: 'Quarterly filter service',
      description: 'Replace filters and inspect rooftop units.',
      status: 'in_progress',
      priority: 'normal',
      technicianId: 'emp_3',
      technicianName: 'Nora Kim',
      scheduledStart: new Date('2026-05-20T08:00:00'),
      estimatedDurationMinutes: 180,
      address: '220 Madison Ave, New York, NY',
      recurring: true,
    },
    {
      id: 'job_4',
      jobNumber: 'JOB-2082',
      customerId: 'cust_crm_4',
      customerName: 'Daniel Rivera',
      serviceType: 'Boiler inspection',
      description: 'Annual boiler safety inspection.',
      status: 'completed',
      priority: 'normal',
      technicianId: 'emp_2',
      technicianName: 'Ethan Brooks',
      scheduledStart: new Date('2026-05-18T13:00:00'),
      estimatedDurationMinutes: 90,
      address: '501 Atlantic Ave, Brooklyn, NY',
      recurring: true,
    },
    {
      id: 'job_5',
      jobNumber: 'JOB-2091',
      customerId: 'cust_crm_3',
      customerName: 'Priya Shah',
      serviceType: 'Site inspection',
      description: 'Initial inspection for recurring maintenance proposal.',
      status: 'on_hold',
      priority: 'low',
      scheduledStart: new Date('2026-05-21T14:00:00'),
      estimatedDurationMinutes: 75,
      address: '44-12 Vernon Blvd, Queens, NY',
      quoteId: 'quote_2',
      recurring: false,
      specialInstructions: 'Waiting on facility access confirmation.',
    },
  ];

  const tickets: AdminTicket[] = [
    {
      id: 'ticket_1',
      ticketNumber: 'TCK-5012',
      customerId: 'cust_crm_2',
      customerName: 'Marcus Chen',
      subject: 'Suite 4 cooling outage',
      status: 'open',
      priority: 'urgent',
      assignedTo: 'Maya Ortiz',
      openedAt: new Date('2026-05-19T08:45:00'),
      slaDueAt: new Date('2026-05-20T12:45:00'),
    },
    {
      id: 'ticket_2',
      ticketNumber: 'TCK-5011',
      customerId: 'cust_crm_1',
      customerName: 'Olivia Martin',
      subject: 'Appointment confirmation needed',
      status: 'resolved',
      priority: 'medium',
      assignedTo: 'Maya Ortiz',
      openedAt: new Date('2026-05-18T11:10:00'),
      slaDueAt: new Date('2026-05-20T11:10:00'),
      resolutionHours: 4.5,
    },
    {
      id: 'ticket_3',
      ticketNumber: 'TCK-5008',
      customerId: 'cust_crm_5',
      customerName: 'Avery Collins',
      subject: 'Billing dispute follow-up',
      status: 'in_progress',
      priority: 'high',
      assignedTo: 'Sofia Bennett',
      openedAt: new Date('2026-05-16T16:20:00'),
      slaDueAt: new Date('2026-05-21T16:20:00'),
    },
  ];

  const reports: AdminReport[] = [
    {
      id: 'report_1',
      name: 'Revenue by Service Type',
      category: 'revenue',
      description: 'Revenue grouped by service family, customer, and close date.',
      lastRunAt: new Date('2026-05-19T17:00:00'),
      schedule: 'weekly',
    },
    {
      id: 'report_2',
      name: 'Job Completion and SLA',
      category: 'operations',
      description: 'Completion rate, average duration, and overdue work by technician.',
      lastRunAt: new Date('2026-05-20T07:30:00'),
      schedule: 'daily',
    },
    {
      id: 'report_3',
      name: 'Customer Growth Cohort',
      category: 'customers',
      description: 'New, active, VIP, inactive, and do-not-contact customer movement.',
      lastRunAt: new Date('2026-05-17T09:15:00'),
      schedule: 'monthly',
    },
    {
      id: 'report_4',
      name: 'Technician Productivity',
      category: 'workforce',
      description: 'Jobs completed, billable hours, rating, and utilization by employee.',
      lastRunAt: new Date('2026-05-18T12:00:00'),
      schedule: 'weekly',
    },
  ];

  const revenueTrend = [
    { date: 'May 14', revenue: 12400, jobs: 18 },
    { date: 'May 15', revenue: 13850, jobs: 21 },
    { date: 'May 16', revenue: 11900, jobs: 17 },
    { date: 'May 17', revenue: 16200, jobs: 24 },
    { date: 'May 18', revenue: 15100, jobs: 23 },
    { date: 'May 19', revenue: 17450, jobs: 27 },
    { date: 'May 20', revenue: 14680, jobs: 20 },
  ];

  return {
    customers,
    quotes,
    tickets,
    jobs,
    employees,
    reports,
    revenueTrend,
  };
}
