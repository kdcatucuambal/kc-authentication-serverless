// import jsonwebtoken from 'jsonwebtoken'
// import jwkToPem from 'jwk-to-pem'
//
// const jsonWebKeys = [  // from https://cognito-idp.us-west-2.amazonaws.com/<UserPoolId>/.well-known/jwks.json
//     {
//         "alg": "RS256",
//         "e": "AQAB",
//         "kid": "ABCDEFGHIJKLMNOPabc/1A2B3CZ5x6y7MA56Cy+6ubf=",
//         "kty": "RSA",
//         "n": "...",
//         "use": "sig"
//     },
//     {
//         "alg": "RS256",
//         "e": "AQAB",
//         "kid": "XYZAAAAAAAAAAAAAAA/1A2B3CZ5x6y7MA56Cy+6abc=",
//         "kty": "RSA",
//         "n": "...",
//         "use": "sig"
//     }
// ]
//
// function validateToken(token) {
//     const header = decodeTokenHeader(token);  // {"kid":"XYZAAAAAAAAAAAAAAA/1A2B3CZ5x6y7MA56Cy+6abc=", "alg": "RS256"}
//     const jsonWebKey = getJsonWebKeyWithKID(header.kid);
//     verifyJsonWebTokenSignature(token, jsonWebKey, (err, decodedToken) => {
//         if (err) {
//             console.error(err);
//         } else {
//             console.log(decodedToken);
//         }
//     })
// }
//
// function decodeTokenHeader(token) {
//     const [headerEncoded] = token.split('.');
//     const buff = new Buffer(headerEncoded, 'base64');
//     const text = buff.toString('ascii');
//     return JSON.parse(text);
// }
//
// function getJsonWebKeyWithKID(kid) {
//     for (let jwk of jsonWebKeys) {
//         if (jwk.kid === kid) {
//             return jwk;
//         }
//     }
//     return null
// }
//
// function verifyJsonWebTokenSignature(token, jsonWebKey, clbk) {
//     const pem = jwkToPem(jsonWebKey);
//     jsonwebtoken.verify(token, pem, {algorithms: ['RS256']}, (err, decodedToken) => clbk(err, decodedToken))
// }
//
//
// validateToken('xxxxxxxxx.XXXXXXXX.xxxxxxxx')