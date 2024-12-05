import { useAuth } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { DownloadCloud, PaperclipIcon, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Browse = () => {
  const user = useAuth((state) => state.user);
  const [form, setForm] = useState({
    institute: "",
    search: "",
  });

  async function paginateInstitutes() {
    try {
      const response = await fetch(
        `/api/institute/paginate?limit=-1&search=${form.institute}&page=1`
      );
      const data = await response.json();
      if (response.ok) {
        // map through the institutes and reformat their JSON for our form logic
        const institutes = data.institutes.map(
          (institute: { name: string }) => {
            return {
              label: institute.name,
              value: institute.name,
            };
          }
        );
        return institutes;
      }
    } catch (error) {
      throw error;
    }
  }

  async function paginateDocuments() {
    try {
      const response = await fetch(
        `/api/document/paginate?limit=16&search=${form.search}&institute=${form.institute}&page=1`
      );
      const data = await response.json();
      if (response.ok) {
        return data.documents;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  const {
    refetch: documentRefetch,
    data: documents,
    isLoading: isDocumentLoading,
  } = useQuery("getdocuments", paginateDocuments, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    refetch: searchRefetch,
    isLoading: searchLoading,
    data: searchData,
  } = useQuery("getinstitutes", paginateInstitutes, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchRefetch();
    }, 500); // wait for 500ms before sending the request
    return () => clearTimeout(delayDebounceFn); // cleanup the timeout if the effect is called again
  }, [form.institute]);

  return (
    <div className="mt-28 mx-8">
      <h1 className="text-xl font-semibold">
        👋 Hello {user?.firstname}! Welcome again to the platform.
      </h1>
      <p className="text-zinc-600">
        Browse through the platform to find the best resources for your studies.
      </p>

      <div className="mt-8"></div>
      <div className="flex flex-col gap-2">
        {searchData && (
          <Combobox
            value={form.institute}
            placeholder="Search Your Institute"
            items={searchData}
            onValueChange={(value) => {
              setForm((prev) => ({ ...prev, institute: value }));
            }}
          />
        )}

        <Input
          type="text"
          placeholder="Document Name"
          className="border border-gray-300 p-2 rounded-md"
          value={form.search}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, search: e.target.value }));
          }}
        />
        <Button
          onClick={() => {
            documentRefetch();
          }}
          className="flex items-center gap-1"
        >
          {" "}
          <Search className="w-4 h-4" /> Search
        </Button>

        <div className="grid grid-cols-4">
          {documents &&
            documents.map((document: any) => (
              <div
                key={document.id}
                className="flex flex-col items-center gap-2 justify-center border border-gray-300 p-4 rounded-md"
              >
                <PaperclipIcon className="w-8 h-8" />
                <h2 className="text-md  font-semibold">{document.title}</h2>
                <p className="text-zinc-600 text-sm">{document.description}</p>
                <Link
                  to={document.src}
                  className={cn(
                    buttonVariants({
                      variant: "default",
                      className: "w-full flex items-center gap-1",
                    })
                  )}
                >
                  <DownloadCloud className="w-4 h-4" /> Download
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
