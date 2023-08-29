import {CognitoJwtVerifier} from 'aws-jwt-verify';
import axios from 'axios';
console.log("Starting");
const validate = async (token) => {
    const url = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_7W6X0n6v0/.well-known/jwks.json";

    const verifier = CognitoJwtVerifier.create({
        userPoolId: "us-east-1_7W6X0n6v0",
        tokenUse: "access",
        clientId: "e7k34e1m5iiba69tablvlgl0j",
    });

    try {
        const jwksResponse = await axios.get(url);
        const jwks = jwksResponse.data;
        console.log("jwks: " + JSON.stringify(jwks));
        verifier.cacheJwks(jwks);
        const response = await verifier.verify(token);
        console.log(response);
        return true;
    }catch (e) {
        console.log(e);
        return false;
    }

}

validate('eyJraWQiOiJNVmVkcXVudUFocUtlMVNTUWhUMFdZSzFFZXY2TlowUnVOc1pCVDAxYVwvMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiNDU4NzRlOC0zMDIxLTcwNGQtN2NkMC1hNTE4M2M2NzRiZWMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV83VzZYMG42djAiLCJjbGllbnRfaWQiOiJlN2szNGUxbTVpaWJhNjl0YWJsdmxnbDBqIiwib3JpZ2luX2p0aSI6ImNjNTNiMjE2LTQ5YzEtNGQyZi05YzBkLTBiOTRjNTVhNTYwOSIsImV2ZW50X2lkIjoiMzQxY2Q3NTQtNTQ4NC00YjBjLThhYTAtMTQzZGQyMjMyODliIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY4ODM0MTc1MywiZXhwIjoxNjg4MzQ1MzUzLCJpYXQiOjE2ODgzNDE3NTMsImp0aSI6Ijk0OWUwMDJlLTUxZmMtNDM4My04YTU4LTVkMjQzN2FkMjc2MSIsInVzZXJuYW1lIjoia2NhdHVjdWFtYmEifQ.hkF-I90BDXEd-6C68XTWhcGIPcIuHDQdVDOCNSpMG-cex9QtjbL6AM3-Dirvcg9JN5kANUoCAmnebCPEdCL6OxmIucPeTkNWfDnN5GfbT5xY5SqPQgQoGt-DM_omiDMPSVYNLFq1jxvUjsJZM50iVEVcYyy3DIq43iKLCQscke-wJbsu53j61ptFuRaD_ehHnbhXlPSIShorZDuv8g3SRjqPGuwEVGLu_rF1Fh1tfgyRpLSYlAhK34l_n3RNr0Xbxx5urgqiAybp12kE0WEJGyuPS4pEvS4qdHo2FZS8SzdUm0582R3V5OSihE0C5RoVom1n8F4CtnGR_87PpwRDrA')
    .then(r => console.log("Final response: " + r));