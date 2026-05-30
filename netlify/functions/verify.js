exports.handler = async (event) => {
  try {
    const { reference } = JSON.parse(event.body);

    // 1. Verify payment with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.data || verifyData.data.status !== "success") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Payment verification failed"
        })
      };
    }

    const { metadata } = verifyData.data;

    // 2. Send request to Hubnet
    const hubnetRes = await fetch(
      `https://console.hubnet.app/live/api/context/business/transaction/${metadata.network}-new-transaction`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUBNET_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: metadata.phone,
          bundle: Number(metadata.bundle)
        })
      }
    );

    const hubnetData = await hubnetRes.json();

    if (!hubnetRes.ok) {
      return {
        statusCode: hubnetRes.status,
        body: JSON.stringify({
          success: false,
          message: hubnetData.message || "Hubnet request failed",
          raw: hubnetData
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        hubnet: hubnetData
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
