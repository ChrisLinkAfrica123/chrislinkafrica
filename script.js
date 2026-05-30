function buy() {
  const phone = document.getElementById("phone").value;
  const network = document.getElementById("network").value;
  const bundle = document.getElementById("bundle").value;

  const status = document.getElementById("status");
  status.innerText = "Processing...";

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
  .then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || "Request failed");
    }

    return data;
  })
  .then((data) => {
    if (data.success) {
      status.innerText = "Order sent successfully!";
    } else {
      status.innerText = data.message || data.error || "Failed";
    }
  })
  .catch((err) => {
    status.innerText = err.message || "Error occurred";
    console.error(err);
  });
}
