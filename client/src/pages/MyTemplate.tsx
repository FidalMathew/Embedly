import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContext, useEffect, useState } from "react";
import { EmbedlyContext } from "@/context/contractContext";
import { Navbar } from "@/components/custom/Navbar";

interface Template {
  id: string;
  templateId: string;
  templateType: string;
  chain: string;
}

function MyTemplate() {
  const { embedlyContract } = useContext(EmbedlyContext) as {
    currentAccount: string;
    embedlyContract: { getTemplates: () => Promise<any> } | null;
  };

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

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

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        {/* Left Side: Template Cards */}
        <ScrollArea className="w-2/5 h-full bg-gray-100 p-4 mt-16 flex items-center justify-center">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="mb-4 cursor-pointer w-4/5"
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardHeader>
                <CardTitle>{template.templateId.slice(43)}</CardTitle>
                <CardDescription>
                  <p>
                    <strong>Type:</strong> {template.templateType}
                  </p>
                  <p>
                    <strong>Chain:</strong> {template.chain}
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>

        {/* Right Side: Iframe Preview */}
        <div className="flex-1 flex items-center justify-center  p-4">
          {selectedTemplate ? (
            <iframe
              src={`/custom/${selectedTemplate}`}
              title="Template Preview"
              className="w-[400px] h-[500px] rounded-lg border border-gray-300"
            ></iframe>
          ) : (
            <p className="text-gray-500">Select a template to preview</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTemplate;
