import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DonationStarknetProps {
  bgColor: string;
  imageUrl?: string; // Optional prop for image URL
  heading: string;
  text: string;
  buttonColor: string;
  btnText: string;
}

function DonationStarknet({
  bgColor,
  imageUrl, // Default image if no URL is provided
  heading,
  text,
  buttonColor,
  btnText,
}: DonationStarknetProps) {
  return (
    <div className="flex justify-center">
      <div
        className="border rounded-lg shadow-md p-6 max-w-sm mt-28"
        style={{ backgroundColor: bgColor, height: "fit-content" }}
      >
        {/* Image Section */}
        <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt="Donation"
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
    </div>
  );
}

export default DonationStarknet;
