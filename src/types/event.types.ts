export interface AuditEvent {
  actor_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  before_state?: Record<string, unknown>;
  after_state?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}
