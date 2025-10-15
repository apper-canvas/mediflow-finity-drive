import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "There are no items to display at the moment.", 
  actionLabel = "Add New",
  onAction,
  icon = "FileText"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full p-6 mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={20} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default Empty;