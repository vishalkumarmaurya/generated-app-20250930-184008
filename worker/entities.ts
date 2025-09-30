import { IndexedEntity } from "./core-utils";
import type { Scheme, Application, AuthUser } from "@shared/types";
import { MOCK_SCHEMES, MOCK_APPLICATIONS, MOCK_APPLICATION_EVENTS } from "@shared/mock-data";
// SCHEME ENTITY: one DO instance per scheme
export class SchemeEntity extends IndexedEntity<Scheme> {
  static readonly entityName = "scheme";
  static readonly indexName = "schemes";
  static readonly initialState: Scheme = {
    id: "",
    title: "",
    description: "",
    type: 'Loan',
    maxAmount: "",
    eligibility: "",
    icon: 'Leaf',
  };
  static seedData = MOCK_SCHEMES;
}
// Combine mock applications with their events for seeding
const SEED_APPLICATIONS: Application[] = MOCK_APPLICATIONS.map(app => ({
  ...app,
  events: MOCK_APPLICATION_EVENTS[app.id] || [],
}));
// APPLICATION ENTITY: one DO instance per application
export class ApplicationEntity extends IndexedEntity<Application> {
  static readonly entityName = "application";
  static readonly indexName = "applications";
  static readonly initialState: Application = {
    id: "",
    schemeName: "",
    applicationDate: "",
    amount: 0,
    status: 'In Review',
    type: 'Loan',
    events: [],
  };
  static seedData = SEED_APPLICATIONS;
}
// USER ENTITY: one DO instance per user, keyed by email
export class UserEntity extends IndexedEntity<AuthUser> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: AuthUser = {
    id: "",
    email: "",
    hashedPassword: "",
  };
  // Use email as the key for easier lookup
  static override keyOf(state: AuthUser): string {
    return state.email;
  }
}