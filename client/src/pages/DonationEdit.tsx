import { Navbar } from "@/components/custom/Navbar";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function DonationStarknetEdit() {
  // State variables for card customization

  const { toast } = useToast();

  const { currentAccount, embedlyContract } = useContext(EmbedlyContext) as {
    currentAccount: string;
    embedlyContract: { addTemplate: (cid: string) => Promise<any> } | null;
  };

  const [bgColor, setBgColor] = useState("#ffffff"); // Default background color
  const [buttonColor, setButtonColor] = useState("#000000");
  const [heading, setHeading] = useState("Support Education");
  const [text, setText] = useState(
    "Help provide books and resources to underprivileged children."
  );

  const [btnText, setBtnText] = useState("Donate");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imageUrl, setImageUrl] = useState<string>(
    "https://coral-light-cicada-276.mypinata.cloud/ipfs/bafkreieti3xvkumm7wi5cygkhqhexk77swa4mzsloa6t2le3rvwtkxypiy"
  );

  const [chain, setChain] = useState("Citrea"); // Default chain

  // New fields
  const [templateName, setTemplateName] = useState<string>("");
  const [receiverAddress, setReceiverAddress] = useState<string>("");

  // const templateSnippet = "<emb ipfs:// emb>";
  const [templateSnippet, setTemplateSnippet] = useState<string>(
    "<emb bafkreiefranu36unulja3vickpalzsrzfr6ezfwurcxhhxpkibxdx7ngka emb>"
  );
  const [dialogOpen, setDialogOpen] = useState(true);

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

  const publishTemplate = async () => {
    // things needed
    // userAddress, imageUrl, bgColor, buttonColor, heading, text
    // templateType = donation
    // chain

    const data = {
      templateId: currentAccount + "_" + templateName,
      chain,
      templateType: "donation",
      receiverAddress,
      imageUrl,
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
            <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
              <img
                src={
                  imageFile ? URL.createObjectURL(imageFile) : "/donation.png"
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

            {/* Input Section */}
            <div className="mt-4">
              <label
                htmlFor="donation-amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <Input
                type="text"
                id="donation-amount"
                placeholder="Enter amount in ETH"
                className="mt-2 w-full"
              />
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
          <div
            className="border h-screen  shadow-md p-4 max-w-sm pt-20 overflow-y-auto"
            style={{ backgroundColor: "#f9f9f9" }}
          >
            <h3 className="text-lg font-semibold mb-4">Customize Card</h3>

            {/* Template Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
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

            {/* Receiver Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Receiver Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                className="mt-2"
                placeholder="Enter receiver address (chain specific)"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
                className="w-full"
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

export default DonationStarknetEdit;
