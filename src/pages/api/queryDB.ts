export const POST: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      columns: ["nombre", "edad"],
      rows: [
        ["Juan Pérez", 45],
        ["María Gómez", 38],
        ["Carlos Ruiz", 50],
      ],
    })
  );
};
