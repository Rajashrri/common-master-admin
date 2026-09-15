import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import { getContactsApi, deleteContactApi } from "../../api/listApi";

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const handleViewMessage = (message: string) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };
  const fetchContacts = async () => {
    try {
      setLoading(true);

      const response = await getContactsApi();

      if (response.data.success) {
        setContacts(response.data.data);
      }
    } catch (error) {
      console.log("Contact Fetch Error :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <>
      <PageBreadcrumb pageTitle="Contact List" />

      <div className="space-y-6">
        <ComponentCard title="Contact List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Sr No
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Email
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Phone
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Message
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Date
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {loading ? (
                    <TableRow>
                      <TableCell className="px-5 py-4">Loading...</TableCell>
                    </TableRow>
                  ) : contacts.length > 0 ? (
                    contacts.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="px-5 py-4 text-start">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item.fullName}
                          </span>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item.email}
                          </span>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item.phone}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <button
                            onClick={() => handleViewMessage(item.message)}
                            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                          >
                            View
                          </button>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {new Date(item.createdAt).toLocaleString("en-GB")}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="px-5 py-4 text-center">
                        No Contact Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h2 className="text-lg font-semibold">Message</h2>

                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-xl font-bold"
                      >
                        ×
                      </button>
                    </div>

                    <div className="mt-4 max-h-80 overflow-y-auto">
                      <p className="whitespace-pre-wrap text-gray-700">
                        {selectedMessage}
                      </p>
                    </div>

                    <div className="mt-5 text-right">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
