import DonationCitrea from "@/components/custom/DonationCitrea";
import DonationStarknet from "@/components/custom/DonationStarknet";
import NFTCitrea from "@/components/custom/NFTCitrea";
import NFTStarknet from "@/components/custom/NFTStarknet";
import PollCitrea from "@/components/custom/PollCitrea";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface TemplateData {
  templateId: string;
  chain: string;
  templateType: string;
  receiverAddress: string;
  imageUrl: string;
  bgColor: string;
  buttonColor: string;
  heading: string;
  text: string;
  btnText: string;
  contractAddress: `0x${string}`;
  functionToInvoke: string;
  abiUrl: string;
  options: string[];
  pollId: number;
  pollColor: string;
}

function Template() {
  const { id } = useParams<{ id: string }>(); // Extract 'id' from the URL
  const [templateData, setTemplateData] = useState<TemplateData | null>(null); // State to store fetched template data
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Assuming the IPFS URL follows a pattern like below:
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${id}`;
        const response = await fetch(ipfsUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch template data: ${response.statusText}`
          );
        }

        const data: TemplateData = await response.json();
        setTemplateData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {templateData?.chain && templateData?.chain === "Citrea" ? (
        <>
          {templateData?.templateType === "donation" && (
            <DonationCitrea
              bgColor={templateData.bgColor}
              btnText={templateData.btnText}
              buttonColor={templateData.buttonColor}
              heading={templateData.heading}
              text={templateData.text}
              imageUrl={templateData.imageUrl}
              reciverAddress={templateData.receiverAddress || ""}
            />
          )}
          {templateData?.templateType === "nft" && (
            <NFTCitrea
              bgColor={templateData.bgColor}
              imageUrl={templateData.imageUrl}
              heading={templateData.heading}
              text={templateData.text}
              buttonColor={templateData.buttonColor}
              btnText={templateData.btnText}
              contractAddress={templateData.contractAddress || "0x"}
              functionToInvoke={templateData.functionToInvoke || ""}
              abiUrl={templateData.abiUrl}
            />
          )}
          {templateData?.templateType === "poll" && (
            <PollCitrea
              bgColor={templateData.bgColor}
              heading={templateData.heading}
              text={templateData.text}
              options={templateData.options}
              pollId={templateData.pollId}
              pollColor={templateData.pollColor}
            />
          )}
        </>
      ) : (
        <>
          {templateData?.templateType === "donation" && (
            <DonationStarknet
              bgColor={templateData.bgColor}
              btnText={templateData.btnText}
              buttonColor={templateData.buttonColor}
              heading={templateData.heading}
              text={templateData.text}
              imageUrl={templateData.imageUrl}
              reciverAddress={templateData.receiverAddress || ""}
            />
          )}
          {templateData?.templateType === "nft" && (
            <NFTStarknet
              bgColor={templateData.bgColor}
              imageUrl={templateData.imageUrl}
              heading={templateData.heading}
              text={templateData.text}
              buttonColor={templateData.buttonColor}
              btnText={templateData.btnText}
              contractAddress={templateData.contractAddress || "0x"}
              functionToInvoke={templateData.functionToInvoke || ""}
              abiUrl={templateData.abiUrl}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Template;
