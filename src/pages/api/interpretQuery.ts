export const GET: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      summary:
        "Hay 3 empleados mayores de 30 años. La edad promedio es 44.3 años. Juan Pérez es el más antiguo.",
    })
  );
};
