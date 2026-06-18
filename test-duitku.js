const crypto = require("crypto");

async function testDuitku() {
  const merchantCode = "DS31943";
  const apiKey = "8a6a2f4c4cf0702cabfd9282f18cd165";
  const merchantOrderId = "INV-" + Date.now();
  const paymentAmount = 10000;

  const signaturePlaintext = `${merchantCode}${merchantOrderId}${paymentAmount}${apiKey}`;
  const signature = crypto.createHash("md5").update(signaturePlaintext).digest("hex");

  const payload = {
    merchantCode,
    paymentAmount,
    merchantOrderId,
    productDetails: "Test Product",
    email: "test@gmail.com",
    phoneNumber: "081234567890",
    customerVaName: "John Doe",
    returnUrl: "https://premiora.my.id/return",
    callbackUrl: "https://premiora.my.id/callback",
    signature
  };

  const urls = [
    "https://api-sandbox.duitku.com/api/merchant/createInvoice",
    "https://sandbox.duitku.com/webapi/api/merchant/createInvoice",
    "https://passport.duitku.com/webapi/api/merchant/createInvoice"
  ];

  for (const url of urls) {
    console.log(`\nTesting ${url}...`);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      console.log(`HTTP ${res.status}: ${text}`);
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

testDuitku();
