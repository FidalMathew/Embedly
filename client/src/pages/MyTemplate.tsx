import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmbedlyContext } from "@/context/contractContext";
import Navbar from "@/components/custom/Navbar";
import { ArrowRight, Trash, ClipboardCopy } from "lucide-react";

interface Template {
  id: string;
  templateId: string;
  templateType: string;
  chain: string;
  reciverAddress: string;
  contractAddress: string;
}

export default function MyTemplates() {
  const { embedlyContract } = useContext(EmbedlyContext) as {
    currentAccount: string;
    embedlyContract: {
      getTemplates: () => Promise<any>;
      deleteTemplate: (id: string) => Promise<any>;
    } | null;
  };

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleCopyToClipboard = (id: string) => {
    navigator.clipboard.writeText(`<emb ${id} emb>`);
    console.log("Copied to clipboard!");
    alert("Copied to clipboard!");
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!embedlyContract) return;

      try {
        const templateIds = await embedlyContract.getTemplates();
        console.log("Template IDs:", templateIds);

        const fetchedTemplates: Template[] = await Promise.all(
          templateIds.map(async (id: string) => {
            const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${id}`;
            const response = await fetch(ipfsUrl);

            if (!response.ok) {
              throw new Error(
                `Failed to fetch template data: ${response.statusText}`
              );
            }

            const data = await response.json();
            return { ...data, id }; // Include the ID for the template
          })
        );

        console.log("Fetched Templates:", fetchedTemplates);
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.log("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, [embedlyContract]);

  const handleDelete = async (id: string) => {
    try {
      await embedlyContract?.deleteTemplate(id);

      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template.id !== id)
      );
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-purple-800 mb-8 mt-16">
          My Templates
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side: Template Cards */}
          <div className="md:col-span-2">
            <ScrollArea className="h-[600px] w-full rounded-md border border-purple-200 bg-white/50 backdrop-blur-sm p-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white/70"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-pink-700">
                      {template.templateId.slice(43)}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-purple-700">
                            <strong>Type:</strong> {template.templateType}
                          </p>
                          <p className="text-purple-700">
                            <strong>Chain:</strong> {template.chain}
                          </p>
                          {template.reciverAddress && (
                            <p className="text-purple-700">
                              <strong>Receiver:</strong>{" "}
                              {template.reciverAddress}
                            </p>
                          )}
                          {template.contractAddress && (
                            <p className="text-purple-700">
                              <strong>Contract:</strong>{" "}
                              {template.contractAddress}
                            </p>
                          )}
                        </div>
                        <div>
                          <span className="flex space-x-2">
                            {" "}
                            <Trash
                              className="w-6 h-6 text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(template.id);
                              }}
                            />{" "}
                            <ClipboardCopy
                              className="w-6 h-6 text-blue-500"
                              onClick={() => handleCopyToClipboard(template.id)}
                            />{" "}
                          </span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </ScrollArea>
          </div>

          {/* Right Side: Iframe Preview */}
          <div className="flex flex-col items-center justify-center bg-white backdrop-blur-sm rounded-lg shadow-lg p-4">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
              Template Preview
            </h2>
            {selectedTemplate ? (
              <iframe
                src={`/custom/${selectedTemplate}`}
                title="Template Preview"
                className="w-full h-[500px] rounded-lg "
              ></iframe>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center">
                <p className="text-pink-700 mb-4">
                  Select a template to preview
                </p>
                <ArrowRight className="w-8 h-8 text-purple-500 animate-bounce" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
