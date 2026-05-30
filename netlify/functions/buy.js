const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { phone, bundle, network } = JSON.parse(event.body);

    if (!phone || !bundle || !network) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing required fields"
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

    // IMPORTANT: catch Hubnet failures properly
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          error: data.message || "Hubnet request failed"
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

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    };
  }
};
