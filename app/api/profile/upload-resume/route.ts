import { NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }

    const filename = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    if (filename.endsWith(".pdf")) {
      let pdfModule: any = null;
      try {
        const nodeRequire = eval("require");
        pdfModule = nodeRequire("pdf-parse");
      } catch {
        pdfModule = await import("pdf-parse");
      }

      const PDFParse = pdfModule?.PDFParse || pdfModule?.default?.PDFParse || (typeof pdfModule === "function" ? pdfModule : null);

      if (typeof PDFParse === "function") {
        try {
          const parser = new PDFParse({ data: buffer });
          const res = await parser.getText();
          extractedText = res.text || "";
          if (typeof parser.destroy === "function") {
            await parser.destroy();
          }
        } catch {
          // Fallback if class instantiation failed
          const res = await (PDFParse as any)(buffer);
          extractedText = res.text || "";
        }
      } else if (typeof pdfModule === "function") {
        const res = await pdfModule(buffer);
        extractedText = res.text || "";
      }
    } else if (filename.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    } else if (filename.endsWith(".txt")) {
      extractedText = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        {
          error:
            "Unsupported file format. Please upload a PDF (.pdf), Word document (.docx), or plain text (.txt) file.",
        },
        { status: 400 }
      );
    }

    // Clean page markers, whitespace and linebreaks
    extractedText = extractedText
      .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, "")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!extractedText || extractedText.length < 20) {
      return NextResponse.json(
        {
          error:
            "Could not extract readable text from this file. If this is an image-only scan, please copy and paste the text directly into the profile.",
        },
        { status: 400 }
      );
    }

    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      text: extractedText,
      filename: file.name,
      wordCount,
    });
  } catch (error: unknown) {
    console.error("PDF/Resume upload error:", error);
    const message = error instanceof Error ? error.message : "Failed to parse resume document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
