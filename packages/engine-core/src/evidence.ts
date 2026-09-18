import type { EvidenceRecord } from "./types";

/** Which lettered process components have at least one evidence record for this outcome. */
export function provenComponents(evidence: readonly EvidenceRecord[], outcomeCode: string): Set<string> {
  const codes = evidence.filter((e) => e.outcomeCode === outcomeCode).map((e) => e.componentCode);
  return new Set(codes);
}
