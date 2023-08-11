const mapping: Record<string, string> = {
  appointments: 'appointment',
  'insurance-plans': 'insurance_plan',
  organizations: 'organization',
  patients: 'patient',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
