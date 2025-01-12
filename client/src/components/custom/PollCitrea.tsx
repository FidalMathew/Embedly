import { Button } from "@/components/ui/button";
import { EmbedlyContext } from "@/context/contractContext";
import { ethers } from "ethers";

import { useContext, useEffect, useState } from "react";
import citreaPollABI from "@/lib/citrea_pollAbi.json";

interface PollCitreaProps {
  bgColor: string;
  heading: string;
  text: string;
  pollId: number;
  options: string[];
  pollColor: string;
}

function PollCitrea({
  bgColor,
  heading,
  text,
  pollId,
  options,
  pollColor,
}: PollCitreaProps) {
  const { currentAccount, connectWallet } = useContext(EmbedlyContext);

  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [votes, setVotes] = useState<number[]>(options.map(() => 0));

  const [userVote, setUserVote] = useState<number | null>(null);

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

  const fetchUserVote = async () => {
    if (!currentAccount) return;

    try {
      const userVote = await pollContract.getUserVote(pollId, currentAccount);
      console.log(userVote.toNumber(), "userVote");
      setUserVote(userVote.toNumber());
    } catch (error) {
      console.error("Error fetching user vote:", error);
    }
  };

  useEffect(() => {
    const getLiveResults = async () => {
      const results = await pollContract.getLiveResults(pollId);
      console.log(results, "results");

      setTotalVotes(results.totalVotes.toNumber());

      setVotes(results.voteCounts.map((vote: any) => vote.toNumber()));
    };

    if (currentAccount) {
      getLiveResults();
      fetchUserVote();
    }
  }, [currentAccount]);

  const handleVote = async (optionIndex: number) => {
    try {
      if (!currentAccount) {
        await connectWallet();
        return;
      }

      console.log("Voting for option", optionIndex + 1);

      const tx = await pollContract.vote(pollId, optionIndex + 1);
      console.log(tx, "tx");
      await tx.wait();

      setTimeout(() => {
        fetchUserVote();
      }, 1000);

      // alert("Transaction sent!");
    } catch (error) {
      console.error("Error sending transaction:", error);
      // alert("Failed to send transaction.");
    }
  };

  return (
    <div className="flex justify-center">
      <div
        className=" p-6 "
        style={{ backgroundColor: bgColor, height: "500px", width: "400px" }}
      >
        <div className="mt-4">
          <h2 className="text-2xl font-semibold" style={{ color: pollColor }}>
            {heading}
          </h2>
          <p className="text-base text-gray-700 mt-2">{text}</p>

          <ul className="mt-10 space-y-3">
            {options.map((option, index) => {
              const isVotedOption = userVote === index + 1; // Check if this option is the user's vote
              return (
                <li
                  key={index}
                  onClick={() => !userVote && handleVote(index)} // Disable further votes if already voted
                  className={`relative flex justify-between items-center border-gray-300 ${
                    isVotedOption
                      ? "border-solid border-2" // Highlight voted option with a solid border
                      : userVote
                      ? "opacity-50 cursor-not-allowed" // Dim other options if vote is done
                      : "hover:shadow-md cursor-pointer"
                  } border bg-white rounded-md p-4 transition duration-300 ease-in-out`}
                  style={{
                    borderColor: isVotedOption ? pollColor : "", // Border color for the voted option
                  }}
                >
                  <span
                    className="text-sm"
                    style={{
                      color: pollColor, // Use pollColor for the text
                      opacity: isVotedOption ? 1 : userVote ? 0.6 : 1, // Full opacity for voted, reduced for others
                      fontWeight: isVotedOption ? "bold" : "normal", // Bold text for the voted option
                    }}
                  >
                    {option}
                  </span>

                  {/* Background Progress Fill */}
                  <div
                    className={`absolute top-0 left-0 h-full rounded-md ${
                      isVotedOption ? "opacity-30" : "opacity-15"
                    }`}
                    style={{
                      width: `${(votes[index] / totalVotes) * 100}%`, // Dynamically set width based on the votes
                      transition: "width 0.3s ease-in-out", // Smooth transition effect
                      backgroundColor: pollColor,
                    }}
                  />
                </li>
              );
            })}
          </ul>
          {currentAccount === "" && (
            <div className="mt-4">
              <Button
                className="w-full"
                style={{ backgroundColor: pollColor, color: "#fff" }}
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PollCitrea;
