exports.handler = async (event) => {
  try {
    const { phone, bundle, network } = JSON.parse(event.body);

    // Basic validation
    if (!phone || !bundle || !network) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Missing required fields"
        })
      };
    }

    // Send request to Hubnet
    const response = await fetch(
      `https://console.hubnet.app/live/api/context/business/transaction/${network}-new-transaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.HUBNET_API_KEY}`
        },
        body: JSON.stringify({ phone, bundle })
      }
    );

    const data = await response.json();

    // Handle Hubnet errors properly
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          message: data.message || "Hubnet request failed"
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
