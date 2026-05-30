exports.handler = async (event) => {
  try {
    const { phone, bundle, network } = JSON.parse(event.body);

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

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
