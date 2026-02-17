
export async function POST(req) {
  try {
    const { text, source, target } = await req.json();

    // Nigerian languages codes 
    const nigerianLangs = ["ig", "ha", "yo"];

    if (
      nigerianLangs.includes(source) ||
      nigerianLangs.includes(target)
    ) {
      if (source !== "en" && target !== "en") {
        return Response.json({
          translatedText:
            "Nigerian languages only support English translation for now.",
        });
      }

      try {
        const response = await fetch(
        "https://translate.astian.org/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: text,
            source,
            target,
            format: "text",
          }),
        }
      );

      const data = await response.json();

        if (data.translatedText) {
          return Response.json({
            translatedText: data.translatedText,
          });
        }     
      } catch (err) {
        console.log("Nigerian API failed, falling back...");       
      }     
    }

      // Memory API
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${text}&langpair=${source}|${target}`
      );

      if (!response.ok) {
        throw new Error("Translation API Failed");
      }

      const data = await response.json();

      return Response.json({ 
        translatedText: data.responseData. translatedText 
      });
    } catch (error) {
     console.log("API ERROR:", error);

      return Response.json(     
      { error: "Translation failed"},
      { status: 500 }
    );
  }
}