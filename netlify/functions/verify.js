exports.handler = async (event) => {
  try {
    const { reference } = JSON.parse(event.body);

    // 1. Verify payment with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const verifyData = await verifyRes.json();

    // FIXED LOGIC
    if (verifyData.data.status !== "success") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Payment not successful"
        })
      };
    }

    const { metadata } = verifyData.data;

    // 2. Send bundle via Hubnet
    const hubnetRes = await fetch(
      `https://console.hubnet.app/live/api/context/business/transaction/${metadata.network}-new-transaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.HUBNET_API_KEY}`
        },
        body: JSON.stringify({
          phone: metadata.phone,
          bundle: metadata.bundle
        })
      }
    );

    const hubnetData = await hubnetRes.json();

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
