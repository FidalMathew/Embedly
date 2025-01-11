import Navbar from "@/components/custom/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmbedlyContext } from "@/context/contractContext";
import { PinataSDK } from "pinata-web3";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { ClipboardIcon } from "@heroicons/react/20/solid";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function NFTEdit() {
  // State variables for card customization

  const { toast } = useToast();

  const { currentAccount, embedlyContract } = useContext(EmbedlyContext) as {
    currentAccount: string;
    embedlyContract: { addTemplate: (cid: string) => Promise<any> } | null;
  };

  const [bgColor, setBgColor] = useState("#f3ff94"); // Default background color
  const [buttonColor, setButtonColor] = useState("#5600f5");
  const [heading, setHeading] = useState("Bored APE NFT");
  const [text, setText] = useState(
    "Limited Editon NFT collection. Mint your Bored APE NFT now!"
  );

  const [btnText, setBtnText] = useState("Mint");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imageUrl, setImageUrl] = useState<string>(
    "https://coral-light-cicada-276.mypinata.cloud/ipfs/bafkreiaonna64qwrpt6jimfxen7ox4syhhgxbiev6mon2qrcsepq7wqt3m"
  );

  const [abiFile, setAbiFile] = useState<File | null>(null);
  const [abiUrl, setAbiUrl] = useState<string>("");
  const [functionToInvoke, setFunctionToInvoke] = useState("");

  const [chain, setChain] = useState("Citrea"); // Default chain

  // New fields
  const [templateName, setTemplateName] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");

  // const templateSnippet = "<emb ipfs:// emb>";
  const [templateSnippet, setTemplateSnippet] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Safely accessing the first file
    if (file) {
      setImageFile(file);
    }
  };

  const uploadToIPFS = async () => {
    const pinata = new PinataSDK({
      pinataJwt: import.meta.env.VITE_PINATA_JWT, // Access the variable using import.meta.env
      pinataGateway: "coral-light-cicada-276.mypinata.cloud",
    });

    if (imageFile) {
      const upload = await pinata.upload.file(imageFile);
      console.log(upload, " upload");
      const cid = upload?.IpfsHash;
      console.log("IPFS CID:", cid);

      if (cid) {
        setImageUrl(
          `https://coral-light-cicada-276.mypinata.cloud/ipfs/${cid}`
        );
      }
    } else {
      console.error("No file selected for upload.");
    }
  };

  const uploadABI = async () => {
    const pinata = new PinataSDK({
      pinataJwt: import.meta.env.VITE_PINATA_JWT, // Access the variable using import.meta.env
      pinataGateway: "coral-light-cicada-276.mypinata.cloud",
    });

    if (abiFile) {
      const upload = await pinata.upload.file(abiFile);
      console.log(upload, " upload");
      const cid = upload?.IpfsHash;
      console.log("IPFS CID:", cid);

      if (cid) {
        setAbiUrl(`https://coral-light-cicada-276.mypinata.cloud/ipfs/${cid}`);
      }
    }
  };

  const publishTemplate = async () => {
    // things needed
    // userAddress, imageUrl, bgColor, buttonColor, heading, text
    // templateType = donation
    // chain

    const data = {
      templateId: currentAccount + "_" + templateName,
      chain,
      templateType: "nft",
      contractAddress,
      imageUrl,
      abiUrl,
      functionToInvoke,
      bgColor,
      buttonColor,
      heading,
      text,
      btnText,
    };

    console.log(data, " data");

    const pinata = new PinataSDK({
      pinataJwt: import.meta.env.VITE_PINATA_JWT, // Access the variable using import.meta.env
      pinataGateway: "coral-light-cicada-276.mypinata.cloud",
    });

    const upload = await pinata.upload.json(data);

    console.log(upload, " upload");

    const cid = upload?.IpfsHash;
    console.log("IPFS json CID:", cid);
    console.log(
      "IPFS json URL:",
      `https://coral-light-cicada-276.mypinata.cloud/ipfs/${cid}`
    );

    // if (cid) {
    //   setImageUrl(
    //     `https://coral-light-cicada-276.mypinata.cloud/ipfs/${cid}`
    //   );
    // }

    // contract operations
    if (embedlyContract) {
      const tx = await embedlyContract?.addTemplate(cid);
      console.log(tx, " tx");
      await tx?.wait();

      setTemplateSnippet(`<emb ${cid} emb>`);
      // activate modal

      setDialogOpen(true);
    }
  };

  useEffect(() => {
    if (imageFile) publishTemplate();
  }, [imageUrl]);

  useEffect(() => {
    if (abiFile) uploadABI();
  }, [abiFile]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(templateSnippet);
    console.log("Copied to clipboard!");
    // alert("Copied to clipboard!"); // Optional: Notify user on clipboard copy
    toast({
      description: "Copied to clipboard!",
    });
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* Navbar  */}
        <Navbar />

        {/* Dialog Content  */}
        <DialogContent className="sm:max-w-[725px] h-72">
          <div className="p-4 space-y-4 text-center">
            {/* Header Section */}
            <DialogHeader>
              <DialogTitle className="text-2xl text-center font-semibold text-green-600">
                Your template has been successfully created!
              </DialogTitle>
            </DialogHeader>

            {/* Description Section */}
            <DialogDescription>
              <p className="text-base text-gray-600 mb-8">
                View your templates in the <strong>"Templates"</strong> section.{" "}
                <br />
                Copy the below snippet to share your template with the world!
              </p>
              <div className="bg-gray-100 p-3 rounded-md flex items-stretch justify-between">
                <code className="text-sm text-gray-800">{templateSnippet}</code>
                <span
                  onClick={handleCopyToClipboard}
                  className="cursor-pointer"
                >
                  <ClipboardIcon className="h-5 w-5" />
                </span>
              </div>
            </DialogDescription>
          </div>
        </DialogContent>

        {/* Main Content  */}
        <div className="flex gap-20 justify-between">
          <div></div>
          <div></div>
          {/* Donation Card */}
          <div
            className="border rounded-lg shadow-md p-6 max-w-sm mt-28 "
            style={{
              backgroundColor: bgColor,
              height: "500px",
              width: "400px",
            }}
          >
            {/* Image Section */}
            <div className="w-full h-72 bg-gray-200 rounded-md overflow-hidden">
              <img
                src={
                  imageFile ? URL.createObjectURL(imageFile) : "/bored-ape.png"
                }
                alt="user"
                className="-z-50 overflow-hidden"
              />
            </div>

            {/* Text Section */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold">{heading}</h2>
              <p className="text-sm text-gray-600 mt-2">{text}</p>
            </div>

            {/* Button Section */}
            <div className="mt-4">
              <Button
                className="w-full"
                style={{ backgroundColor: buttonColor, color: "#fff" }}
              >
                {btnText}
              </Button>
            </div>
          </div>
          {/* Editor Section */}
          <div className="border h-screen  shadow-md p-4 max-w-sm pt-20 overflow-y-auto bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
            <h3 className="text-lg font-semibold mb-4  text-purple-800">
              Customize Card
            </h3>

            {/* Template Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Template Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="mt-2"
                placeholder="Enter template name"
                required
              />
            </div>

            {/* Contract Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Contract Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="mt-2"
                placeholder="Enter contract address (chain specific)"
                required
              />
            </div>

            {/* ABI */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                ABI
              </label>
              <Input
                type="file"
                onChange={(e) => setAbiFile(e.target.files?.[0] || null)}
                className="mt-2"
                accept=".json"
                required
              />
            </div>

            {/* Function to Invoke  */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Function to Invoke
              </label>
              <Input
                type="text"
                value={functionToInvoke}
                onChange={(e) => setFunctionToInvoke(e.target.value)}
                className="mt-2"
                placeholder="Enter function to invoke"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Select Chain
              </label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="mt-2 w-full border rounded-md px-2 py-1"
              >
                <option value="Citrea">Citrea (supported by MetaMask)</option>
                <option value="Starknet">Starknet (supported by Argent)</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Image
              </label>
              <Input
                type="file"
                onChange={handleImageChange}
                className="mt-2"
                accept="image/*"
              />
            </div>
            {/* Background Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Background Color
              </label>
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Button Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Button Color
              </label>
              <Input
                type="color"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Heading Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Heading Text
              </label>
              <Input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="mt-2"
                placeholder="Enter heading"
              />
            </div>

            {/* Body Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Body Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-2 w-full border rounded-md px-2 py-1"
                placeholder="Enter description"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Button Text <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={btnText}
                onChange={(e) => setBtnText(e.target.value)}
                className="mt-2"
                placeholder="Enter Button Text"
              />
            </div>

            <div className="mt-4">
              <Button
                onClick={imageFile ? uploadToIPFS : publishTemplate}
                className="bg-purple-500 hover:bg-purple-600 text-white w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Publish Template
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default NFTEdit;
