// Function to inject a script into the page context

async function replaceEmbTags() {
  // Find all span elements containing <emb ... emb> or &lt;emb ... emb&gt;

  console.log("Inside replaceEmbTags");
  const spans = document.querySelectorAll("span");

  const fetchPromises = [];
  spans.forEach((span) => {
    const embRegex = /<emb\s*([^<]*)\s*emb>/g;
    let match;
    const decodedHTML = span.innerHTML
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    while ((match = embRegex.exec(decodedHTML)) !== null) {
      let url = null;
      const match1 = match;

      console.log("MATCHHHHH: ", match1);

      const url1 = match[1].trim();

      console.log("URL1: ", url1);

      // if (url1.startsWith("http")) url = url1;
      // else if (url1.startsWith("ipfs://"))
      //   url = "https://ipfs.io/ipfs/" + url1.substring("ipfs://".length);

      // console.log(`Fetching URL: ${url}`); // Debugging information
      // if (!url) continue;

      const defaultResponse = {
        span: "defaultSpan",
        match: "defaultMatch",
        // htmlText:
        //   '<html><p>Default HTML content</p><button class="fid-button">Switch Chain</button></html>',

        htmlText: `<html>

<head>
    <title>Parent Page with iframe</title>
    <style>
        .iframe-container {
            width: 100%;
            display: flex;
            justify-content: center;
            // max-width: 800px;
            // margin: 20px auto;
            // border: 1px solid #ccc;
        }

        iframe {
          width: 400px;
          height: 500px;
          border: none;
          border-radius: 15px;
        }
    </style>
</head>

<body>
    <div class="iframe-container">
        <iframe src="http://localhost:5173/custom/bafkreigoipk2irrkvdiyst3zpe53xaeozzewe2ki7w5op7svlqg634i74u" title="Embedded React App"
            allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone"
            sandbox="allow-same-origin allow-scripts allow-forms"></iframe>
    </div>
</body>

</html>
`,
        jsCode: ``,
      };

      // https://echo-verse-vert.vercel.app/

      // add html content
      span.innerHTML = defaultResponse.htmlText;
    }
  });
}

// Run the function every 1 second

console.log("Running replaceEmbTags");
setInterval(replaceEmbTags, 1000);
