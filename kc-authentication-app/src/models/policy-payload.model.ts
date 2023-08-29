export interface PolicyPayloadModel {
    principalId: string,
    resource: string,
    effect: "Allow" | "Deny",
}