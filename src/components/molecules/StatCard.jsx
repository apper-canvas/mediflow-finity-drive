import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary bg-blue-50",
    success: "text-success bg-green-50",
    warning: "text-warning bg-orange-50",
    error: "text-error bg-red-50",
    info: "text-info bg-blue-50"
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <ApperIcon
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"}
                  size={16}
                  className={trend === "up" ? "text-success" : "text-error"}
                />
                <span className={`text-sm ml-1 ${trend === "up" ? "text-success" : "text-error"}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;