import "server-only";

import { getCurrentUser, type Profile } from "./session";

// Authorization errors
export class AuthorizationError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

// Require authenticated user
export async function requireAuth() {
  const auth = await getCurrentUser();
  if (!auth?.user || !auth?.profile) {
    throw new AuthorizationError("You must be logged in to perform this action.");
  }
  return auth as { user: NonNullable<typeof auth.user>; profile: Profile; session: NonNullable<typeof auth.session> };
}

// Require specific role
export async function requireRole(allowedRoles: Profile["role"][]) {
  const auth = await requireAuth();
  if (!allowedRoles.includes(auth.profile.role as Profile["role"])) {
    throw new AuthorizationError(`This action requires one of these roles: ${allowedRoles.join(", ")}`);
  }
  return auth;
}

// Require employer role
export async function requireEmployer() {
  return requireRole(["employer", "admin"]);
}

// Require freelancer role
export async function requireFreelancer() {
  return requireRole(["freelancer", "admin"]);
}

// Require admin role
export async function requireAdmin() {
  return requireRole(["admin"]);
}

// Check if user owns a resource
export function isOwner(resourceOwnerId: string, userId: string): boolean {
  return resourceOwnerId === userId;
}

// Authorization check for job operations
export async function authorizeJobAccess(jobEmployerId: string, action: "read" | "write") {
  const auth = await getCurrentUser();
  
  if (action === "read") {
    // Anyone authenticated can read jobs
    if (!auth?.user) {
      throw new AuthorizationError("You must be logged in to view jobs.");
    }
    return auth;
  }
  
  if (action === "write") {
    // Only job owner or admin can write
    const authResult = await requireAuth();
    if (!isOwner(jobEmployerId, authResult.user.id) && authResult.profile.role !== "admin") {
      throw new AuthorizationError("You don't have permission to modify this job.");
    }
    return authResult;
  }
  
  throw new AuthorizationError("Invalid action");
}

// Authorization check for proposal operations
export async function authorizeProposalAccess(
  proposalFreelancerId: string,
  jobEmployerId: string,
  action: "read" | "write" | "status"
) {
  const auth = await requireAuth();
  const userId = auth.user.id;
  const isAdmin = auth.profile.role === "admin";
  
  if (action === "read") {
    // Proposal owner or job owner can read
    if (!isOwner(proposalFreelancerId, userId) && !isOwner(jobEmployerId, userId) && !isAdmin) {
      throw new AuthorizationError("You don't have permission to view this proposal.");
    }
    return auth;
  }
  
  if (action === "write") {
    // Only proposal owner can edit their proposal
    if (!isOwner(proposalFreelancerId, userId) && !isAdmin) {
      throw new AuthorizationError("You can only modify your own proposals.");
    }
    return auth;
  }
  
  if (action === "status") {
    // Job owner can change proposal status (hire, decline, etc.)
    if (!isOwner(jobEmployerId, userId) && !isAdmin) {
      throw new AuthorizationError("Only the job poster can change proposal status.");
    }
    return auth;
  }
  
  throw new AuthorizationError("Invalid action");
}

// Authorization check for contract operations
export async function authorizeContractAccess(
  contractEmployerId: string,
  contractFreelancerId: string,
  action: "read" | "write"
) {
  const auth = await requireAuth();
  const userId = auth.user.id;
  const isAdmin = auth.profile.role === "admin";
  const isParticipant = isOwner(contractEmployerId, userId) || isOwner(contractFreelancerId, userId);
  
  if (!isParticipant && !isAdmin) {
    throw new AuthorizationError("You don't have permission to access this contract.");
  }
  
  return auth;
}
