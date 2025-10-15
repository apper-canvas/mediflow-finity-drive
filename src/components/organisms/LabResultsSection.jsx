import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import labResultService from '@/services/api/labResultService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Empty from '@/components/ui/Empty';
import FileUploadModal from '@/components/molecules/FileUploadModal';

const LabResultsSection = ({ patientId }) => {
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState({ open: false, result: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    loadLabResults();
  }, [patientId]);

  const loadLabResults = async () => {
    try {
      setLoading(true);
      const results = await labResultService.getByPatientId(patientId);
      setLabResults(results);
    } catch (error) {
      toast.error('Failed to load lab results');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, notes) => {
    try {
      await labResultService.create(patientId, file, notes);
      toast.success('Lab result uploaded successfully');
      setUploadModalOpen(false);
      loadLabResults();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handlePreview = async (result) => {
    try {
      const fullResult = await labResultService.getById(result.Id);
      setPreviewModal({ open: true, result: fullResult });
    } catch (error) {
      toast.error('Failed to load file preview');
    }
  };

  const handleDownload = async (result) => {
    try {
      const fullResult = await labResultService.getById(result.Id);
      const link = document.createElement('a');
      link.href = fullResult.FileData;
      link.download = fullResult.FileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('File downloaded');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async () => {
    try {
      await labResultService.delete(deleteConfirm.id);
      toast.success('Lab result deleted successfully');
      setDeleteConfirm({ open: false, id: null });
      loadLabResults();
    } catch (error) {
      toast.error('Failed to delete lab result');
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return 'FileText';
    if (fileType.includes('image')) return 'Image';
    return 'File';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lab Results & Test Reports</CardTitle>
            <Button
              size="sm"
              icon="Upload"
              onClick={() => setUploadModalOpen(true)}
            >
              Upload Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-32"></div>
                </div>
              ))}
            </div>
          ) : labResults.length === 0 ? (
            <Empty
              message="No lab results uploaded yet"
              icon="FileText"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {labResults.map((result) => (
                <div
                  key={result.Id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ApperIcon
                          name={getFileIcon(result.FileType)}
                          size={20}
                          className="text-primary"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {result.FileName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {labResultService.formatFileSize(result.FileSize)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {format(new Date(result.UploadDate), 'MMM d, yyyy h:mm a')}
                  </p>
                  {result.Notes && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {result.Notes}
                    </p>
                  )}
                  <div className="flex items-center space-x-2">
                    {result.FileType.includes('image') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Eye"
                        onClick={() => handlePreview(result)}
                      >
                        Preview
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Download"
                      onClick={() => handleDownload(result)}
                    >
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => setDeleteConfirm({ open: true, id: result.Id })}
                      className="text-error hover:text-error"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FileUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      {previewModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {previewModal.result?.FileName}
              </h3>
              <button
                onClick={() => setPreviewModal({ open: false, result: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={previewModal.result?.FileData}
                alt={previewModal.result?.FileName}
                className="max-w-full h-auto mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={24} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Lab Result</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this lab result? The file will be permanently removed.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm({ open: false, id: null })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LabResultsSection;