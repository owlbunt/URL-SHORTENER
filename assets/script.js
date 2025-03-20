document.addEventListener("DOMContentLoaded", async function () {
    const domainSelect = document.getElementById("domainSelect");

    try {
        const response = await fetch("../configuration.json"); // Adjust path if needed
        const config = await response.json();

        // Populate dropdown with domains
        config.domains.forEach((domain, index) => {
            const option = document.createElement("option");
            option.value = domain;
            option.textContent = domain;
            if (index === 0) option.selected = true; // Select first domain by default
            domainSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading domain list:", error);
    }
});

async function shortenUrl() {
    const longUrl = document.getElementById("longUrl").value.trim();
    const alias = document.getElementById("alias").value.trim();
    const domain = document.getElementById("domainSelect").value;
    const generateButton = document.querySelector("#generateUrl");
    const resultBox = document.getElementById("shortUrl");
    const resultContainer = document.getElementById("result");

    if (!longUrl) {
        resultBox.value = "Please enter a valid URL";
        resultContainer.style.display = "block";
        return;
    }

    let apiUrl = `https://${domain}/api/${encodeURIComponent(longUrl)}`;
    if (alias) {
        apiUrl += `?alias=${encodeURIComponent(alias)}`;
    }

    try {
        generateButton.textContent = ". . ."; // Show loading state

        const response = await fetch(apiUrl);
        const data = await response.json(); // Parse JSON response

        if (response.ok && data.short_url) {
            resultBox.value = data.short_url; // Display short URL
        } else {
            resultBox.value = "Error: " + (data.error || "Unknown error");
        }

        resultContainer.style.display = "block"; // Show result section
    } catch (error) {
        resultBox.value = "Error connecting to the server";
        resultContainer.style.display = "block";
    } finally {
        generateButton.textContent = "Generate"; // Restore button text
    }
}

function copyUrl() {
    const shortUrl = document.getElementById("shortUrl");
    const copyButton = document.getElementById("copyButton");

    if (!shortUrl.value || shortUrl.value.startsWith("Error")) return; // Don't copy if it's an error

    shortUrl.select();
    navigator.clipboard.writeText(shortUrl.value)
        .then(() => {
            copyButton.textContent = "Copied!";
            setTimeout(() => copyButton.textContent = "Copy", 2000); // Reset after 2 sec
        })
        .catch(() => alert("Failed to copy URL"));
}
