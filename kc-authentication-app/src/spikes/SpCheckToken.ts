import {verify} from "jsonwebtoken";
//import jwtToPem from "jwk-to-pem"
import { CognitoJwtVerifier } from "aws-jwt-verify";

const token = "eyJraWQiOiJNVmVkcXVudUFocUtlMVNTUWhUMFdZSzFFZXY2TlowUnVOc1pCVDAxYVwvMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiNDU4NzRlOC0zMDIxLTcwNGQtN2NkMC1hNTE4M2M2NzRiZWMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV83VzZYMG42djAiLCJjbGllbnRfaWQiOiJlN2szNGUxbTVpaWJhNjl0YWJsdmxnbDBqIiwib3JpZ2luX2p0aSI6ImM3ZWY2OTFlLTUyNWMtNDFlMy1iMjdmLWQ1ZmRjYjM4ZWU4OSIsImV2ZW50X2lkIjoiMTQzMTFlNTgtODg5ZC00YzViLWExNmEtNjI3ZGIzMWIzZDc2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY4ODM0MDAwNywiZXhwIjoxNjg4MzQzNjA3LCJpYXQiOjE2ODgzNDAwMDcsImp0aSI6ImIzNGI5M2RhLWI4MzktNDYyMC1iNjk3LWM3NmQyZTEwZjM4YSIsInVzZXJuYW1lIjoia2NhdHVjdWFtYmEifQ.ZcRiCLgbyUIov1sJn95ym6xMDSgq9zLskyQ1A6su8WJD49wEQe3_N1UXpDcdJ8PRQ2B9F-DjB7W85wqrRkud3cWQfQDCfZ61Gi4Vw_C7WX3f4ii3WyZzG17Tj33y8jqZrsyp67KZHtJpdgUW_CZGTEKLqkU4mRBUJPjsH2JED1wbI1GaMvK85pQf6rq39GG8ruTxoqUCiLzdDxawtxX-RtTNz7pR7hAJ5q50V3NEzOF5Hx_Gt0SeP7mRfoXI7RKikGurGc_NzXAZlc57--NfMrt0OG_P7ElUkgST8qoAGZu9mLgq4W6oVorJSDDpFF4jWqQPkWpietX0EZhEBDxkig";

// const jwksjson ={
//     "keys": [
//         {
//             "alg": "RS256",
//             "e": "AQAB",
//             "kid": "yVc2phNXHwzh88Ii5gvR0vpmlUMHd+g2jo6xtpO6jO4=",
//             "kty": "RSA",
//             "n": "vubaVVp5k8_24lHYdau5kkIfMExBGLjPwR9hOc6cLJHOGQHFfADSWQ5oSqoYSzCocpD3xJMg1c7BTF8J3pPcSPXcXWtD1sO7jPNgBrt7DaGk-0_shXtpGbtG3cEV18Aty7-6bqDdRpV55V4zTmGyyg7vS4ROC-wtJOByHpYHW120WzTjjJz_BBmV3ZnkYTMxCFcRbP17EbHcv_kGYfOhtXLDx-wjBe8ZiTNgQZWM-V_e_C-0NqjuYDRzfKLX1vf2yWscuCw8usgHVEsI_nBunEea1PFA4ia4QM8K5rB8ENBJ-Pw174tn9_HmB0pX1Rvx9nw0VJ8zMw4y2hNOuj6arQ",
//             "use": "sig"
//         },
//         {
//             "alg": "RS256",
//             "e": "AQAB",
//             "kid": "MVedqunuAhqKe1SSQhT0WYK1Eev6NZ0RuNsZBT01a/0=",
//             "kty": "RSA",
//             "n": "tv3l2jRSz2QSo-qjdHrv6-3Ecgd0eysowwwHmJDfWseGBMYeyqy8IZnsZYROp00dQZ1ERBuWF86bZmomktUebQ5fVLPToowry0ICTyPzim-6ku8elvwLCBNlr6rxhhuWQjK_IJfG9Kxci3AYC8w9OXQjY_XrxHJ0kYYQf05okmrbzvsIi2tJOVDBSgfxW3LBbsTERssspaygXFdLhPMnHQOPnk2cgSYxfXjHmc4DbPV2OP4oWd0m_BO1Ab-Kj2CLSTvd9sJ6a4r4VMMrkJViV76dXBuuCfVv-MD6ovGv3E2-v1ZKKUertk-S8ZSNd3gezsmXfhkZohSHBb9QaELtXw",
//             "use": "sig"
//         }
//     ]
// }
//
// const pem = jwtToPem(jwksjson["keys"][0] as any)
// console.log("pem" + pem)
//
//
// const response = verify(token, pem, {algorithms: ['RS256']});

const verifier = CognitoJwtVerifier.create({
    userPoolId: "us-east-1_7W6X0n6v0",
    tokenUse: "access",
    clientId: "e7k34e1m5iiba69tablvlgl0j",
});



const payload = verifier.verifySync(token);






console.log(payload);