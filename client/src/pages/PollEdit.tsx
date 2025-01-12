import Navbar from "@/components/custom/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmbedlyContext } from "@/context/contractContext";
import { PinataSDK } from "pinata-web3";
import { useContext, useEffect, useState } from "react";
import { ClipboardIcon } from "@heroicons/react/20/solid";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import citreaPollABI from "@/lib/citrea_pollAbi.json";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ethers } from "ethers";

function PollEdit() {
  const { toast } = useToast();
  const { currentAccount, embedlyContract } = useContext(EmbedlyContext) as {
    currentAccount: string;
    embedlyContract: { addTemplate: (cid: string) => Promise<any> } | null;
  };

  const [bgColor, setBgColor] = useState("#f3ff94");
  const [pollColor, setPollColor] = useState("#5600f5");
  const [heading, setHeading] = useState("Poll Title");
  const [text, setText] = useState("Describe your poll here...");
  const [templateName, setTemplateName] = useState<string>("");
  const [chain, setChain] = useState("Citrea");

  const [options, setOptions] = useState([
    { id: 1, text: "Option 1", votes: 2 },
    { id: 2, text: "Option 2", votes: 4 },
  ]);
  const [templateSnippet, setTemplateSnippet] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [totalPolls, setTotalPolls] = useState(0);

  const { ethereum } = window;

  if (!ethereum) {
    alert("Metamask not found");
    return;
  }

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const pollContractAddress = "0x46bf74A07F59BCf3446e7aabF89043bC39f3322C";

  const pollContract = new ethers.Contract(
    pollContractAddress,
    citreaPollABI,
    signer
  );

  useEffect(() => {
    const fetchTotalPolls = async () => {
      console.log("Poll Contract:", pollContract);
      const totalPolls = await pollContract.getPollCount();
      setTotalPolls(Number(totalPolls));

      // console.log("Total Polls:", totalPolls.toString());
    };

    if (pollContract) fetchTotalPolls();
  }, [pollContract]);

  const addOption = () => {
    if (options.length < 4) {
      setOptions([
        ...options,
        {
          id: options.length + 1,
          text: `Option ${options.length + 1}`,
          votes: 0,
        },
      ]);
    } else {
      toast({ description: "You can only add up to 4 options." });
    }
  };

  const updateOption = (id: number, value: string) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, text: value } : opt))
    );
  };

  // Function to remove an option
  const removeOption = (id: number) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const publishTemplate = async () => {
    const tempOptions = options.map((option) => option.text);

    const data = {
      templateId: currentAccount + "_" + templateName,
      chain,
      pollId: totalPolls + 1,
      templateType: "poll",
      bgColor,
      pollColor,
      heading,
      text,
      options: tempOptions,
    };

    const pinata = new PinataSDK({
      pinataJwt: import.meta.env.VITE_PINATA_JWT,
      pinataGateway: "coral-light-cicada-276.mypinata.cloud",
    });

    const upload = await pinata.upload.json(data);
    const cid = upload?.IpfsHash;

    if (embedlyContract) {
      const tx = await embedlyContract?.addTemplate(cid);
      await tx?.wait();
    }

    if (pollContract) {
      const tx = await pollContract.createPoll(text, tempOptions);
      await tx.wait();
      setTemplateSnippet(`<emb ${cid} emb>`);
      setDialogOpen(true);
    }

    alert("Poll template created successfully!");
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(templateSnippet);
    toast({ description: "Copied to clipboard!" });
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Navbar />

        <DialogContent className="sm:max-w-[725px] h-72">
          <div className="p-4 space-y-4 text-center">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center font-semibold text-green-600">
                Your poll template has been successfully created!
              </DialogTitle>
            </DialogHeader>

            <DialogDescription>
              <p className="text-base text-gray-600 mb-8">
                View your templates in the <strong>"Templates"</strong> section.
                <br />
                Copy the below snippet to share your poll template!
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

        <div className="flex gap-20 justify-between">
          <div></div>
          <div></div>
          <div
            className="border rounded-lg shadow-md p-6 max-w-sm mt-28"
            style={{
              backgroundColor: bgColor,
              height: "500px",
              width: "400px",
            }}
          >
            <div className="mt-4">
              <h2
                className="text-2xl font-semibold"
                style={{ color: pollColor }}
              >
                {heading}
              </h2>
              <p className="text-base text-gray-700 mt-2">{text}</p>

              <ul className="mt-10 space-y-3">
                {options.map((option) => (
                  <li
                    key={option.id}
                    className="relative flex justify-between items-center bg-white border border-gray-300 rounded-md p-4 hover:shadow-md transition duration-300 ease-in-out"
                  >
                    <span className="text-sm " style={{ color: pollColor }}>
                      {option.text}
                    </span>

                    {/* Background Progress Fill */}
                    {/* <div
                      className="absolute top-0 left-0 h-full  rounded-md opacity-15"
                      style={{
                        width: `${(option.votes / 5) * 100}%`, // Dynamically set width based on the votes
                        transition: "width 0.3s ease-in-out", // Smooth transition effect
                        backgroundColor: pollColor,
                      }}
                    /> */}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Button
                  className="w-full"
                  style={{ backgroundColor: pollColor, color: "#fff" }}
                >
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>

          {/* Poll Editor  */}

          <div className="border h-screen shadow-md p-4 max-w-sm pt-20 overflow-y-auto bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-purple-800">
              Customize Poll
            </h3>

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

            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Button Color
              </label>
              <Input
                type="color"
                value={pollColor}
                onChange={(e) => setPollColor(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Poll Title
              </label>
              <Input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="mt-2"
                placeholder="Enter poll title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">
                Poll Description
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-2 w-full border rounded-md px-2 py-1"
                placeholder="Describe your poll"
              ></textarea>
            </div>

            {options.map((option, index) => (
              <div key={option.id} className="mb-4">
                <label className="block text-sm font-medium text-pink-700">
                  Option {index + 1}
                </label>
                <div className="flex items-center justify-center">
                  <Input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    className="mt-2"
                    placeholder={`Enter text for option ${index + 1}`}
                  />
                  {/* <Button
                    onClick={() => removeOption(option.id)}
                    className="ml-2 bg-red-500 text-white"
                  >
                    Remove
                  </Button> */}
                  <Trash
                    className="w-6 h-6 text-red-500 ml-2 cursor-pointer"
                    onClick={() => removeOption(option.id)}
                  />
                </div>
              </div>
            ))}

            {options.length < 4 && (
              <Button
                onClick={addOption}
                className="  w-full mt-4 border border-purple-500 text-purple-500 bg-white hover:bg-white hover:text-purple-500"
              >
                Add Option
              </Button>
            )}

            <div className="mt-4">
              <Button
                onClick={publishTemplate}
                className="bg-purple-500 hover:bg-purple-600 text-white w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Publish Poll Template
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default PollEdit;
