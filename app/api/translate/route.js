export async function POST(req) {
  try {
    const { text, source, target } = await req.json();

    const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${text}&langpair=${source}|${target}`
        );

        if (!response.ok) {
          throw new Error("Translation API Failed");
        }

        const data = await response.json();

        return Response.json({ translatedText: data.responseData.translatedText });
  } catch (error) {
    console.log("API ERROR:", error);

    return Response.json(     
      { error: "Translation failed"},
      { status: 500 }
    );
  }
}