/**
 * ═══════════════════════════════════════════════════════
 * Deno Certificate Microservice
 * Topic #8: Deno — ізольований мікросервіс
 * ═══════════════════════════════════════════════════════
 * Генерує SVG-сертифікати про завершення курсу.
 * Працює незалежно від Express бекенду.
 * ═══════════════════════════════════════════════════════
 */

import { generateCertificateSVG } from "./certificate_template.ts";

const PORT = parseInt(Deno.env.get("PORT") ?? "8000");

/**
 * Handle incoming HTTP requests
 */
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // ── CORS Preflight ──
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // ── Health Check ──
  if (url.pathname === "/" || url.pathname === "/health") {
    return new Response(
      JSON.stringify({
        service: "Deno Certificate Generator",
        status: "ok",
        runtime: `Deno ${Deno.version.deno}`,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers }
    );
  }

  // ── Generate Certificate ──
  if (url.pathname === "/generate-cert" && req.method === "POST") {
    try {
      const body = await req.json();
      const { student_name, course_name, completion_date, certificate_id } = body;

      // Validate input
      if (!student_name || !course_name) {
        return new Response(
          JSON.stringify({
            error: "student_name та course_name є обов'язковими полями",
          }),
          { status: 400, headers }
        );
      }

      // Generate SVG certificate
      const svgContent = generateCertificateSVG({
        studentName: student_name,
        courseName: course_name,
        completionDate: completion_date ?? new Date().toISOString(),
        certificateId: certificate_id ?? `CERT-${Date.now()}`,
      });

      // Return SVG as base64 encoded data
      const base64SVG = btoa(unescape(encodeURIComponent(svgContent)));

      console.log(
        `✅ Certificate generated for "${student_name}" — ${course_name}`
      );

      return new Response(
        JSON.stringify({
          success: true,
          certificate_id,
          student_name,
          course_name,
          generated_at: new Date().toISOString(),
          svg_base64: base64SVG,
          svg_data_uri: `data:image/svg+xml;base64,${base64SVG}`,
        }),
        { status: 200, headers }
      );
    } catch (error) {
      console.error("❌ Certificate generation error:", error);
      return new Response(
        JSON.stringify({
          error: "Помилка генерації сертифікату",
          details: (error as Error).message,
        }),
        { status: 500, headers }
      );
    }
  }

  // ── 404 ──
  return new Response(
    JSON.stringify({ error: "Маршрут не знайдено" }),
    { status: 404, headers }
  );
}

console.log(`
╔══════════════════════════════════════════════════╗
║  🎓 Deno Certificate Microservice               ║
║  🌐 Running on: http://localhost:${PORT}           ║
║  🦕 Deno version: ${Deno.version.deno}                    ║
╚══════════════════════════════════════════════════╝
`);

Deno.serve({ port: PORT }, handler);
