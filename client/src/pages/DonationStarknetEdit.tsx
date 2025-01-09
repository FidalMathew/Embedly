import { Navbar } from "@/components/custom/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PinataSDK } from "pinata-web3";
import { ChangeEvent, useState } from "react";

function DonationStarknetEdit() {
  // State variables for card customization
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

    await uploadToIPFS();

    const data = {
      userAddress: "0x1234567890",
      imageUrl,
      bgColor,
      buttonColor,
      heading,
      text,
      templateType: "donation",
      chain: "starknet",
    };

    const pinata = new PinataSDK({
      pinataJwt: import.meta.env.VITE_PINATA_JWT, // Access the variable using import.meta.env
      pinataGateway: "coral-light-cicada-276.mypinata.cloud",
    });

    const upload = await pinata.upload.json(data);

    console.log(upload, " upload");
  };

  return (
    <>
      <Navbar />
      <div className="flex gap-20 justify-between">
        <div></div>
        <div></div>
        {/* Donation Card */}
        <div
          className="border rounded-lg shadow-md p-6 max-w-sm mt-28 "
          style={{ backgroundColor: bgColor, height: "fit-content" }}
        >
          {/* Image Section */}
          <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : "/donation.png"}
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
              type="number"
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
              Button Text
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
            <Button onClick={publishTemplate} className="w-full">
              Publish Template
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DonationStarknetEdit;
