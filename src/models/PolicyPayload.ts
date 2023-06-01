export interface PolicyPayload {
    principalId: string,
    resource: string,
    effect: "Allow" | "Deny",
}