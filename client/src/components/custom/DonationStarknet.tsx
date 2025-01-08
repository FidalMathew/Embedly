import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

function DonationStarknet() {
  // State variables for card customization
  const [bgColor, setBgColor] = useState("#ffffff"); // Default background color
  const [buttonColor, setButtonColor] = useState("#000000");
  const [heading, setHeading] = useState("Support Education");
  const [text, setText] = useState(
    "Help provide books and resources to underprivileged children."
  );
  const [imageUrl, setImageUrl] = useState(
    "https://via.placeholder.com/300" // Default image URL
  );

  return (
    <div className="flex gap-8">
      {/* Donation Card */}
      <div
        className="border rounded-lg shadow-md p-4 max-w-sm"
        style={{ backgroundColor: bgColor }}
      >
        {/* Image Section */}
        <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt="Donation cause"
            className="object-cover w-full h-full"
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
            Donation Amount
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
            Donate
          </Button>
        </div>
      </div>

      {/* Editor Section */}
      <div className="border rounded-lg shadow-md p-4 max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Customize Card</h3>

        {/* Image URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <Input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-2"
            placeholder="Enter image URL"
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
      </div>
    </div>
  );
}

export default DonationStarknet;
