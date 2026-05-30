exports.handler = async (event) => {
  try {
    const { phone, bundle, network } = JSON.parse(event.body);

    // 🔴 DEBUG LOG (shows in Netlify functions logs)
    console.log("REQUEST FROM FRONTEND:", {
      phone,
      bundle,
      network
    });

    if (!phone || !bundle || !network) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Missing required fields"
        })
      };
    }

    const response = await fetch(
      `https://console.hubnet.app/live/api/context/business/transaction/${network}-new-transaction`,
      {
        method: "POST",
        headers: {
          token: `Bearer ${process.env.HUBNET_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: phone,
          bundle: Number(bundle), // 🔴 FORCE NUMBER FORMAT
          debug: true
        })
      }
    );

    const data = await response.json();

    // 🔴 DEBUG LOG (Hubnet response)
    console.log("HUBNET RESPONSE:", data);

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
    console.log("ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
