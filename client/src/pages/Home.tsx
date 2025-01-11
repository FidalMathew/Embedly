import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Download, Pencil, Share2 } from "lucide-react";
import Navbar from "@/components/custom/Navbar";

export default function Home() {
  const steps = [
    {
      icon: Download,
      title: "Install Extension",
      description: "Get started by installing our browser extension",
    },
    {
      icon: Pencil,
      title: "Create Template",
      description: "Design your custom content template",
    },
    {
      icon: Share2,
      title: "Share on Socials",
      description: "Easily share your content across social platforms",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-10">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-800 sm:text-4xl md:text-5xl mb-6">
              Effortlessly Share Stunning Content Across Socials with Embedly
            </h1>
            <p className="text-lg text-pink-700 mb-8">
              Follow these simple steps to get started with Embedly
            </p>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className="bg-white/50 backdrop-blur-sm border-2 border-purple-200 shadow-lg"
                >
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-purple-800" />
                    </div>
                    <CardTitle className="text-xl text-pink-700">
                      Step {index + 1}: {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-purple-700">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10">
              <Button
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create yours now!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/30 backdrop-blur-sm rounded-lg shadow-lg p-4 aspect-square">
              <img
                src="/placeholder.svg"
                alt="Embedly Preview"
                width={500}
                height={500}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">
            Supported Chains and Wallets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-pink-700 mb-2">
                Supported Chains
              </h3>
              <ul className="list-disc list-inside text-purple-700">
                <li>Starknet</li>
                <li>Citrea</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-pink-700 mb-2">
                Supported Wallets
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <img
                    src="/argent.svg"
                    alt="Argent Wallet"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span className="text-purple-700">Argent Wallet</span>
                </div>
                <div className="flex items-center">
                  <img
                    src="/metamask.svg"
                    alt="Metamask"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span className="text-purple-700">Metamask</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
