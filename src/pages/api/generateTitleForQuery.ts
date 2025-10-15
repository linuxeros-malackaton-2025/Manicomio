export const GET: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      title: "Empleados mayores de 30 años",
    })
  );
};