import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BarChart2, Gift, Image } from "lucide-react";
import Navbar from "@/components/custom/Navbar";
import { Link } from "react-router-dom";

export default function Create() {
  const templates = [
    {
      icon: BarChart2,
      title: "Poll Template",
      description: "Create interactive polls for your audience",
      link: "/template/poll",
    },
    {
      icon: Gift,
      title: "Donation Template",
      description: "Set up donation campaigns for your cause",
      link: "/template/donation",
    },
    {
      icon: Image,
      title: "NFT Template",
      description: "Showcase and promote your NFT collections",
      link: "/template/nft",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        <h1 className="text-3xl font-extrabold text-purple-800 sm:text-4xl md:text-5xl mb-6 text-center mt-10">
          Choose Your Template
        </h1>
        <p className="text-lg text-pink-700 mb-8 text-center">
          Select a template to get started with your Embedly content
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {templates.map((template, index) => (
            <Card
              key={index}
              className="bg-white/50 backdrop-blur-sm border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="flex flex-col items-center space-y-4 pb-2">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <template.icon className="w-8 h-8 text-purple-800" />
                </div>
                <CardTitle className="text-2xl text-pink-700 text-center">
                  {template.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-purple-700 mb-6">
                  {template.description}
                </CardDescription>
                <Link to={template.link}>
                  <Button
                    size="lg"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
