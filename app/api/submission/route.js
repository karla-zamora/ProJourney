import { NextResponse } from "next/server";

export async function POST(req) {
  const { sourceCode, languageId } = await req.json();
  console.log("sourceCode: ", sourceCode);
  console.log("languageId: ", languageId);

  if (!sourceCode || !languageId) {
    return NextResponse.json(
      { error: "Source code and language ID are required" },
      { status: 400 }
    );
  }

  const judge0ApiUrl = process.env.JUDGE0_API_URL;
  const judge0ApiKey = process.env.JUDGE0_API_KEY;

  // Check for missing environment variables
  if (!judge0ApiUrl || !judge0ApiKey) {
    console.error("Missing Judge0 API URL or API Key.");
    return NextResponse.json(
      { error: "Internal server configuration error" },
      { status: 500 }
    );
  }

  const url = `${judge0ApiUrl}/submissions?base64_encoded=false&wait=true&fields=*`;

  const headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": judge0ApiKey,
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  };

  const body = {
    source_code: sourceCode,
    language_id: languageId,
  };

  try {
    // First request to submit code for execution
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorDetails = await response.text(); // Log response details for debugging
      console.error("Error response from Judge0 on submission:", errorDetails);
      return NextResponse.json(
        { message: `Error: ${response.statusText}`, details: errorDetails },
        { status: response.status }
      );
    }

    const { token } = await response.json();
    console.log("Received token:", token);

    // Poll for the result using the received token with base64_encoded=true
    const resultUrl = `${judge0ApiUrl}/submissions/${token}?base64_encoded=true&fields=*`;

    const resultResponse = await fetch(resultUrl, {
      method: "GET",
      headers: headers,
    });

    if (!resultResponse.ok) {
      const resultErrorDetails = await resultResponse.text(); // Log response details for debugging
      console.error("Error fetching results from Judge0:", resultErrorDetails);
      return NextResponse.json(
        {
          message: `Error fetching results: ${resultResponse.statusText}`,
          details: resultErrorDetails,
        },
        { status: resultResponse.status }
      );
    }

    const resultData = await resultResponse.json();
    console.log("Execution result:", resultData);

    // Decode Base64-encoded fields if necessary (like stdout, stderr)
    const { stdout, stderr } = resultData;

    // Ensure stdout and stderr are not null before decoding

    console.log("stdout before decoding:", stdout);
    console.log("stderr before decoding:", stderr);
    const stdoutUTF8 = stdout
      ? Buffer.from(stdout, "base64").toString("utf-8")
      : "";
    const stderrUTF8 = stderr
      ? Buffer.from(stderr, "base64").toString("utf-8")
      : "";

    console.log("stdout after decoding:", stdoutUTF8);
    console.log("stderr after decoding:", stderrUTF8);
    const returnData = {
      stdout: stdoutUTF8,
      stderr: stderrUTF8,
    };

    return NextResponse.json(returnData);
  } catch (error) {
    console.error("Error executing code:", error);
    return NextResponse.json(
      { message: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
