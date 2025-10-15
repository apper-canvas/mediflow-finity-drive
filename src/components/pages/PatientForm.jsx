import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "@/components/atoms/Card";
import patientService from "@/services/api/patientService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    height: "",
    weight: "",
    allergies: "",
    existingConditions: "",
    currentMedications: "",
    pastSurgeries: "",
    familyHistory: "",
    primaryPhysician: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      setError("");
      const patient = await patientService.getById(parseInt(id));
setFormData({
        name: patient.name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender || "",
        bloodType: patient.bloodType || "",
        address: patient.address || "",
        emergencyContact: patient.emergencyContact || "",
        emergencyPhone: patient.emergencyPhone || "",
        height: patient.height || "",
        weight: patient.weight || "",
        allergies: Array.isArray(patient.allergies) ? patient.allergies.join(", ") : "",
        existingConditions: Array.isArray(patient.existingConditions) ? patient.existingConditions.join(", ") : "",
        currentMedications: Array.isArray(patient.currentMedications) ? patient.currentMedications.join(", ") : "",
        pastSurgeries: Array.isArray(patient.pastSurgeries) ? patient.pastSurgeries.join(", ") : "",
        familyHistory: patient.familyHistory || "",
        primaryPhysician: patient.primaryPhysician || ""
      });
    } catch (err) {
      setError("Failed to load patient details. Please try again.");
      console.error("Error loading patient:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.bloodType.trim()) {
      newErrors.bloodType = "Blood type is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = "Emergency contact name is required";
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = "Emergency contact phone is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all validation errors");
      return;
    }

    try {
      setSubmitting(true);

      if (isEditMode) {
        await patientService.update(parseInt(id), formData);
        toast.success("Patient updated successfully");
      } else {
        await patientService.create(formData);
        toast.success("Patient created successfully");
      }

      navigate("/patients");
    } catch (err) {
      toast.error(isEditMode ? "Failed to update patient" : "Failed to create patient");
      console.error("Error saving patient:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/patients");
      }
    } else {
      navigate("/patients");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPatient} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isEditMode ? "Edit Patient" : "Add New Patient"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? "Update patient information" : "Enter patient details to create a new record"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-error">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={errors.name ? "border-error" : ""}
                />
                {errors.name && (
                  <p className="text-error text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-error">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  className={errors.email ? "border-error" : ""}
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-error">*</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? "border-error" : ""}
                />
                {errors.phone && (
                  <p className="text-error text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-error">*</span>
                </label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={errors.dateOfBirth ? "border-error" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-error text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-error">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.gender ? "border-error" : "border-gray-300"
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-error text-sm mt-1">{errors.gender}</p>
                )}
              </div>

<div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type <span className="text-error">*</span>
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.bloodType ? "border-error" : "border-gray-300"
                  }`}
                >
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodType && (
                  <p className="text-error text-sm mt-1">{errors.bloodType}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-error">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St, City, State, ZIP"
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.address ? "border-error" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-error text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>
{/* Physical Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ApperIcon name="Activity" size={20} />
              Physical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <Input
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="e.g., 5'8&quot; or 173cm"
                  className={errors.height ? "border-red-500" : ""}
                />
                {errors.height && (
                  <p className="mt-1 text-sm text-red-500">{errors.height}</p>
                )}
              </div>
<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <Input
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 150 lbs or 68 kg"
                  className={errors.weight ? "border-red-500" : ""}
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-500">{errors.weight}</p>
                )}
              </div>
            </div>
          </div>

          {/* Allergies & Medications Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ApperIcon name="AlertCircle" size={20} />
              Allergies & Current Medications
            </h3>
            <div className="space-y-4">
<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies
                  <span className="text-gray-500 text-xs ml-2">(Separate multiple with commas)</span>
                </label>
                <Input
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="e.g., Penicillin, Shellfish, Latex"
                  className={errors.allergies ? "border-red-500" : ""}
                />
                {errors.allergies && (
                  <p className="mt-1 text-sm text-red-500">{errors.allergies}</p>
                )}
              </div>
<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications
                  <span className="text-gray-500 text-xs ml-2">(Separate multiple with commas)</span>
                </label>
                <Input
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  placeholder="e.g., Lisinopril 10mg, Metformin 500mg"
                  className={errors.currentMedications ? "border-red-500" : ""}
                />
                {errors.currentMedications && (
                  <p className="mt-1 text-sm text-red-500">{errors.currentMedications}</p>
                )}
              </div>
            </div>
          </div>

          {/* Medical History Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ApperIcon name="FileText" size={20} />
              Medical History
            </h3>
            <div className="space-y-4">
<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Existing Medical Conditions
                  <span className="text-gray-500 text-xs ml-2">(Separate multiple with commas)</span>
                </label>
                <Input
                  name="existingConditions"
                  value={formData.existingConditions}
                  onChange={handleInputChange}
                  placeholder="e.g., Hypertension, Diabetes, Asthma"
                  className={errors.existingConditions ? "border-red-500" : ""}
                />
                {errors.existingConditions && (
                  <p className="mt-1 text-sm text-red-500">{errors.existingConditions}</p>
                )}
              </div>
<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Past Surgeries
                  <span className="text-gray-500 text-xs ml-2">(Separate multiple with commas)</span>
                </label>
                <Input
                  name="pastSurgeries"
                  value={formData.pastSurgeries}
                  onChange={handleInputChange}
                  placeholder="e.g., Appendectomy (2015), Knee Surgery (2020)"
                  className={errors.pastSurgeries ? "border-red-500" : ""}
                />
                {errors.pastSurgeries && (
                  <p className="mt-1 text-sm text-red-500">{errors.pastSurgeries}</p>
                )}
              </div>
<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Medical History
                </label>
                <textarea
                  name="familyHistory"
                  value={formData.familyHistory}
                  onChange={handleInputChange}
                  placeholder="e.g., Mother: Hypertension, Father: Diabetes"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.familyHistory ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.familyHistory && (
                  <p className="mt-1 text-sm text-red-500">{errors.familyHistory}</p>
                )}
              </div>
            </div>
          </div>

          {/* Primary Care Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ApperIcon name="Stethoscope" size={20} />
              Primary Care
            </h3>
<div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Doctor / Physician
              </label>
              <Input
                name="primaryPhysician"
                value={formData.primaryPhysician}
                onChange={handleInputChange}
                placeholder="e.g., Dr. John Smith"
                className={errors.primaryPhysician ? "border-red-500" : ""}
              />
              {errors.primaryPhysician && (
                <p className="mt-1 text-sm text-red-500">{errors.primaryPhysician}</p>
              )}
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name <span className="text-error">*</span>
                </label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="text"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                  className={errors.emergencyContact ? "border-error" : ""}
                />
                {errors.emergencyContact && (
                  <p className="text-error text-sm mt-1">{errors.emergencyContact}</p>
                )}
              </div>

              <div>
                <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone <span className="text-error">*</span>
                </label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 987-6543"
                  className={errors.emergencyPhone ? "border-error" : ""}
                />
                {errors.emergencyPhone && (
                  <p className="text-error text-sm mt-1">{errors.emergencyPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={submitting}
            >
              {submitting ? "Saving..." : isEditMode ? "Update Patient" : "Create Patient"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PatientForm;