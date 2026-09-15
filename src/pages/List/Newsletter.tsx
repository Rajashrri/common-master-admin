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

import { getNewsletterApi } from "../../api/listApi";

interface Newsletter {
  _id: string;
  email: string;
  createdAt: string;
}

export default function CareerList() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);

      const response = await getNewsletterApi();

      if (response.data.success) {
        setNewsletters(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  return (
    <>
      <PageBreadcrumb pageTitle="Career Enquiry List" />

      <div className="space-y-6">
        <ComponentCard title="Newsletter Enquiry List">
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
                      Email
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
                      <TableCell className="px-5 py-8 text-center" colSpan={3}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : newsletters.length > 0 ? (
                    newsletters.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="px-5 py-4 text-start">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item.email}
                          </span>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          {new Date(item.createdAt).toLocaleString("en-GB")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="px-5 py-8 text-center text-gray-500"
                      >
                        No Newsletter Found
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
