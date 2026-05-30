function buy() {
  const phone = document.getElementById("phone").value;
  const network = document.getElementById("network").value;
  const bundle = document.getElementById("bundle").value;

  document.getElementById("status").innerText = "Processing...";

  fetch(`https://console.hubnet.app/live/api/context/business/transaction/${network}-new-transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"SsWImakDghFSRCIrrX3UpKttLIULGp1GcKQ
    },
    body: JSON.stringify({
      phone: phone,
      bundle: bundle
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById("status").innerText = "Success!";
    } else {
      document.getElementById("status").innerText = "Failed";
    }
  })
  .catch(() => {
    document.getElementById("status").innerText = "Error";
  });
}
