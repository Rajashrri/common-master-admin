export const hasPermission = (
  resource: string,
  action: "view" | "add" | "edit" | "delete"
) => {

  const isAdmin = JSON.parse(
    localStorage.getItem("isAdmin") || "false"
  );

  // Admin => Everything allowed
  if (isAdmin) {
    return true;
  }

  const permissions = JSON.parse(
    localStorage.getItem("permissions") || "[]"
  );

  const permission = permissions.find(
    (item: any) => item.resource === resource
  );

  return permission?.operations?.[action] || false;
};