import {KcUtil} from "../utils/KcUtil";

const token = "Bearer xyzuio";
const method = "arn:aws:execute-api:us-east-1:818802851925:vo2kc7iwr2/v1/GET/labs/balances/AB-1123";
KcUtil.generatePolicy({authorizationToken: token, methodArn: method, type: "TOKEN"}).then(policy => {
    console.log(JSON.stringify(policy));
});