export const GET: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      sql: "SELECT nombre, edad FROM empleados WHERE edad > 30",
    })
  );
};
