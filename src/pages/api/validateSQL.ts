import type { APIRoute } from "astro";
import dotenv from "dotenv";
dotenv.config();

export const prerender = false;

/**
 * Endpoint de validación de consultas SQL
 * - Detecta comandos peligrosos (DROP, DELETE sin WHERE, etc.)
 * - Valida sintaxis básica
 * - Registra auditoría
 */
export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const sql = body.sql;

    if (!sql || typeof sql !== "string") {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "SQL query is required",
          severity: "error",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const warnings: string[] = [];
    const errors: string[] = [];
    const normalizedSQL = sql.trim().toUpperCase();

    // Validación 1: Comandos peligrosos
    const dangerousCommands = ["DROP", "TRUNCATE", "ALTER", "GRANT", "REVOKE"];
    for (const cmd of dangerousCommands) {
      if (normalizedSQL.startsWith(cmd)) {
        errors.push(
          `Comando ${cmd} no permitido por razones de seguridad`
        );
      }
    }

    // Validación 2: DELETE/UPDATE sin WHERE
    if (
      normalizedSQL.startsWith("DELETE") &&
      !normalizedSQL.includes("WHERE")
    ) {
      errors.push("DELETE sin cláusula WHERE no permitido (borraría toda la tabla)");
    }

    if (
      normalizedSQL.startsWith("UPDATE") &&
      !normalizedSQL.includes("WHERE")
    ) {
      warnings.push("UPDATE sin WHERE afectará a todos los registros");
    }

    // Validación 3: Posibles SQL Injection
    const injectionPatterns = [
      /;\s*DROP/i,
      /;\s*DELETE/i,
      /--/,
      /\/\*/,
      /xp_cmdshell/i,
      /exec\s*\(/i,
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(sql)) {
        errors.push("Patrón sospechoso detectado - posible SQL injection");
        break;
      }
    }

    // Validación 4: Sintaxis básica de SELECT
    if (normalizedSQL.startsWith("SELECT")) {
      if (!normalizedSQL.includes("FROM")) {
        errors.push("SELECT sin cláusula FROM no es válido");
      }
    }

    // Validación 5: Límite de resultados recomendado
    if (
      normalizedSQL.startsWith("SELECT") &&
      !normalizedSQL.includes("ROWNUM") &&
      !normalizedSQL.includes("FETCH FIRST")
    ) {
      warnings.push(
        "Considera limitar los resultados con ROWNUM o FETCH FIRST"
      );
    }

    // Log de auditoría (en producción, guardar en base de datos)
    const auditLog = {
      timestamp: new Date().toISOString(),
      sql: sql.substring(0, 200), // Primeros 200 caracteres
      valid: errors.length === 0,
      warnings: warnings.length,
      errors: errors.length,
    };
    console.log("[AUDIT]", JSON.stringify(auditLog));

    // Respuesta
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          valid: false,
          errors,
          warnings,
          severity: "error",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        valid: true,
        warnings,
        severity: warnings.length > 0 ? "warning" : "ok",
        message: "Consulta validada correctamente",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ error: "Invalid request" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};
