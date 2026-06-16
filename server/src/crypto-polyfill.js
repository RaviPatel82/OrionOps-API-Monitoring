import { webcrypto } from "node:crypto";

// MongoDB driver uses bare `crypto` in strict CJS modules.
// Ensure Web Crypto API is available on the global object (Node 18 compat).
if (!globalThis.crypto?.getRandomValues) {
    globalThis.crypto = webcrypto;
}

if (typeof global.crypto === "undefined") {
    global.crypto = globalThis.crypto;
}
