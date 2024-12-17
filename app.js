// script.js

const extractBtn = document.getElementById("extract-btn");
const urlInput = document.getElementById("url-input");
const languageSelect = document.getElementById("language-select");
const resultsDiv = document.getElementById("results");

const apiKey = "2584577010msh77a82e7bba98997p12d905jsn5157fdba8a09";
const apiHost = "article-extractor-and-summarizer.p.rapidapi.com";

extractBtn.addEventListener("click", async () => {
  const urlToExtract = urlInput.value.trim();
  const language = languageSelect.value;

  if (!urlToExtract) {
    alert("Please enter a URL to extract!");
    return;
  }

  try {
    resultsDiv.textContent = "Extracting content, please wait...";
    
    // Step 1: Extract content
    const extractResponse = await fetch(
      `https://${apiHost}/extract?url=${encodeURIComponent(urlToExtract)}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": apiHost,
        },
      }
    );
    const extractData = await extractResponse.json();

    // Step 2: Summarize content
    const summaryResponse = await fetch(
      `https://${apiHost}/summarize-text`,
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": apiHost,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang: language,
          text: extractData.content || "No content available",
        }),
      }
    );
    const summaryData = await summaryResponse.json();

    // Display results
    resultsDiv.innerHTML = `
      <h3>Title: ${extractData.title || "No title available"}</h3>
      <p><strong>Description:</strong> ${extractData.description || "No description available"}</p>
      <p><strong>Author:</strong> ${extractData.author || "Unknown"}</p>
      <p><strong>Published:</strong> ${extractData.published || "Unknown"}</p>
      <p><strong>Summary:</strong> ${summaryData.summary || "No summary available"}</p>
      <img src="${extractData.image}" alt="Article image" style="max-width: 100%; margin: 10px 0;">
      <p><a href="${extractData.links[0]}" target="_blank">Read Full Article</a></p>
    `;
  } catch (error) {
    console.error("Error:", error);
    resultsDiv.textContent = "Failed to extract or summarize content. Please try again.";
  }
});
