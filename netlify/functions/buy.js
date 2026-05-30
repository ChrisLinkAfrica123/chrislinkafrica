exports.handler = async (event) => {
  try {
    const { phone, bundle, network } = JSON.parse(event.body);

    if (!phone || !bundle || !network) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Missing required fields"
        })
      };
    }

    // 🔴 Convert to URL encoded format (SAFE FOR HUBNET)
    const formBody = new URLSearchParams();
    formBody.append("phone", phone);
    formBody.append("bundle", String(bundle));

    const response = await fetch(
      `https://console.hubnet.app/live/api/context/business/transaction/${network}-new-transaction`,
      {
        method: "POST",
        headers: {
          token: process.env.HUBNET_API_KEY, // 🔥 NO Bearer (important)
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody.toString()
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          message: data.message || "Hubnet request failed",
          raw: data
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data
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
