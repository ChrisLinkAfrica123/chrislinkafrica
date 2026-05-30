exports.handler = async (event) => {
  try {
    const { phone, bundle, network } = JSON.parse(event.body);

    if (!process.env.HUBNET_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Missing HUBNET_API_KEY in Netlify env"
        })
      };
    }

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
