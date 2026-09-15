import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import { getCareersApi } from "../../api/listApi";

interface Career {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  experience: string;
  location: string;
  coverLetter: string;
  position : string;
  resume: string;
  createdAt: string;
}

export default function CareerList() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCareers = async () => {
    try {
      setLoading(true);

      const response = await getCareersApi();

      if (response.data.success) {
        setCareers(response.data.data);
      }
    } catch (error) {
      console.log("Career Fetch Error :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  return (
    <>
      <PageBreadcrumb pageTitle="Career Enquiry List" />

      <div className="space-y-6">
        <ComponentCard title="Career Enquiry List">
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
                      Mobile
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Experience
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Location
                    </TableCell>
 <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Position
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Cover Letter
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Resume
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
                      <TableCell className="px-5 py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : careers.length > 0 ? (
                    careers.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="px-5 py-4 text-start">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item.fullName}
                          </span>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          {item.email}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          {item.mobile}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          {item.experience} Years
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          {item.location}
                        </TableCell>
      <TableCell className="px-5 py-4 text-start">
                          {item.position}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          {item.coverLetter
                            ? item.coverLetter.length > 40
                              ? item.coverLetter.substring(0, 40) + "..."
                              : item.coverLetter
                            : "-"}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          <a
                            href={`${item.resume.replace(
                              /\\/g,
                              "/"
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Resume
                          </a>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          {new Date(item.createdAt).toLocaleString("en-GB")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="px-5 py-4 text-center">
                        No Career Applications Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}