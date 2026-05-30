
function buy() {
  const phone = document.getElementById("phone").value;
  const network = document.getElementById("network").value;
  const bundle = document.getElementById("bundle").value;

  const amount = bundle * 10 * 100; // example pricing

  let handler = PaystackPop.setup({
    key: "YOUR_PAYSTACK_PUBLIC_KEY",
    email: phone + "@client.com",
    amount: amount,
    currency: "GHS",

    metadata: {
      phone: phone,
      network: network,
      bundle: bundle
    },

    callback: function(response) {
      document.getElementById("status").innerText = "Payment successful...";

      // Send to backend for Hubnet delivery
      fetch("/.netlify/functions/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reference: response.reference
        })
      })
      .then(res => res.json())
      .then(data => {
        document.getElementById("status").innerText =
          data.success ? "Bundle delivered!" : "Delivery failed";
      });
    },

    onClose: function() {
      document.getElementById("status").innerText = "Payment cancelled";
    }
  });

  handler.openIframe();
}
