import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Could not access page (${response.status}: ${response.statusText}). You can paste the job description text directly.`,
        },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Strip unneeded elements
    $("script, style, noscript, nav, footer, header, svg, iframe, form, button").remove();

    // Try extracting OpenGraph / Meta details
    const ogTitle = $('meta[property="og:title"]').attr("content") || $("title").text() || "";
    const ogSiteName =
      $('meta[property="og:site_name"]').attr("content") ||
      $('meta[name="author"]').attr("content") ||
      parsedUrl.hostname.replace(/^www\./, "").split(".")[0];

    // Clean up title (often in form "Role at Company" or "Role - Location")
    let title = ogTitle.split(/[-|–—:]/)[0].trim();
    if (!title) title = "New Job Opportunity";

    // Extract main text content
    let mainText = "";
    const possibleContainers = [
      '[data-automation-id="jobPostingDescription"]',
      ".job-description",
      "#job-description",
      ".description",
      "article",
      "main",
      ".content",
      "body",
    ];

    for (const selector of possibleContainers) {
      const el = $(selector);
      if (el.length > 0) {
        const text = el.text().replace(/\s\s+/g, "\n").trim();
        if (text.length > 200) {
          mainText = text;
          break;
        }
      }
    }

    if (!mainText) {
      mainText = $("body").text().replace(/\s\s+/g, "\n").trim();
    }

    // Truncate to reasonable size (max 8000 characters)
    if (mainText.length > 8000) {
      mainText = mainText.substring(0, 8000) + "\n...[truncated]";
    }

    return NextResponse.json({
      title: title,
      company: ogSiteName ? ogSiteName.charAt(0).toUpperCase() + ogSiteName.slice(1) : "",
      jobDescription: mainText,
      jobUrl: url,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to extract job posting";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

