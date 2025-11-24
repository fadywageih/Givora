import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Check, X } from 'lucide-react';

const WholesaleApprovals = () => {
  const [applications, setApplications] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const res = await adminAPI.getWholesaleApplications();
      console.log(res?.data?.applications);
      setApplications(res?.data?.applications);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatus = (id, status) => {
    try {
      if (status === 'approved') {
        adminAPI.approveWholesale(id);
      } else {
        adminAPI.rejectWholesale(id);
      }
      loadApps();
      toast({
        title: `Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `User status updated.`
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Helmet><title>Wholesale Approvals - Admin</title></Helmet>
      <h1 className="text-2xl font-bold text-[#0A1F44] mb-6">Wholesale Applications</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Business</th>
              <th className="p-4 font-semibold text-gray-600">Details</th>
              <th className="p-4 font-semibold text-gray-600">Contact</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {applications.map(app => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-bold text-[#0A1F44]">{app.businessName}</p>
                  <p className="text-sm text-gray-500">EIN: {app.einNumber}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm"><span className="font-medium">Type:</span> {app.businessType}</p>
                  <p className="text-sm text-gray-500">{app.address}, {app.city}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm font-mono">{app.phone}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${app.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    app.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {app.approvalStatus}
                  </span>
                </td>
                <td className="p-4">
                  {app.approvalStatus === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatus(app.id, 'approved')}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatus(app.id, 'rejected')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No applications found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WholesaleApprovals;