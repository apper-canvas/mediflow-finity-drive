import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "appointment" }) => {
  const getStatusVariant = (status, type) => {
    if (type === "appointment") {
      switch (status?.toLowerCase()) {
        case "scheduled":
          return "scheduled";
        case "completed":
          return "completed";
        case "cancelled":
          return "cancelled";
        default:
          return "default";
      }
    } else if (type === "patient") {
      switch (status?.toLowerCase()) {
        case "active":
          return "success";
        case "inactive":
          return "error";
        default:
          return "default";
      }
    }
    return "default";
  };

  return (
    <Badge variant={getStatusVariant(status, type)}>
      {status}
    </Badge>
  );
};

export default StatusBadge;