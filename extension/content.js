async function replaceEmbTags() {
  // Find all span elements containing <emb ... emb> or &lt;emb ... emb&gt;

  console.log("Inside replaceEmbTags");
  const spans = document.querySelectorAll("span");

  spans.forEach((span) => {
    const embRegex = /<emb\s*([^<]*)\s*emb>/g;
    let match;
    const decodedHTML = span.innerHTML
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    while ((match = embRegex.exec(decodedHTML)) !== null) {
      const match1 = match;

      console.log("MATCHHHHH: ", match1);

      const url1 = match[1].trim();
      console.log("URL1: ", url1);

      const defaultResponse = {
        span: "defaultSpan",
        match: "defaultMatch",

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
        <iframe src="http://localhost:5173/custom/${url1}" title="Embedded React App"
            allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone"
            sandbox="allow-same-origin allow-scripts allow-forms"></iframe>
    </div>
</body>

</html>
`,
        jsCode: ``,
      };

      // add html content
      span.innerHTML = defaultResponse.htmlText;
    }
  });
}

// Run the function every 1 second

console.log("Running replaceEmbTags");
setInterval(replaceEmbTags, 1000);
