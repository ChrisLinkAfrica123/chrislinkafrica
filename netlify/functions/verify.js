const bundlePrices = {
  "1": 1024,
  "2": 2048,
  "5": 5120,
  "10": 10240,
  "20": 20480,
  "50": 51200,
  "100": 102400
};

function buy() {
  const phone = document.getElementById("phone").value;
  const network = document.getElementById("network").value;
  const bundle = document.getElementById("bundle").value;

  const bundleInMB = bundlePrices[bundle];

  document.getElementById("status").innerText = "Processing...";

  fetch("/.netlify/functions/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone,
      network,
      bundle: bundleInMB
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("status").innerText =
      data.success ? "Order successful!" : (data.message || "Failed");
  })
  .catch(() => {
    document.getElementById("status").innerText = "Error";
  });
}
