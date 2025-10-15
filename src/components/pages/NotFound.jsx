import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Icon */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
            <ApperIcon name="FileQuestion" size={48} className="text-white" />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-gray-900">
              Page Not Found
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to where you need to be.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link to="/">
              <Button variant="primary" icon="Home" className="w-full">
                Return to Dashboard
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Link to="/patients">
                <Button variant="outline" icon="Users" size="sm" className="w-full">
                  Patients
                </Button>
              </Link>
              <Link to="/appointments">
                <Button variant="outline" icon="Calendar" size="sm" className="w-full">
                  Appointments
                </Button>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Need help? Contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;