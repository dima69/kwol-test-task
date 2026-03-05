import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout.tsx", [
    index("auth/register.tsx"),
    route("users", "users.tsx"),
  ]),
] satisfies RouteConfig;
