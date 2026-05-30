function buy() {
  const phone = document.getElementById("phone").value;
  const network = document.getElementById("network").value;
  const bundle = document.getElementById("bundle").value;

  document.getElementById("status").innerText = "Processing...";

  fetch("/.netlify/functions/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone,
      network,
      bundle
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("status").innerText =
      data.success ? "Order sent successfully!" : "Failed";
  })
  .catch(() => {
    document.getElementById("status").innerText = "Error";
  });
}
