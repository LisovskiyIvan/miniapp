import React from "react";

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function Card({ title, description, icon, onClick }: CardProps) {
  return (
    <div className="bg-white rounded-lg p-4 flex items-start gap-4 shadow m-4 hover:scale-105 transition-all duration-300" onClick={onClick}>
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="font-bold text-lg mb-1">{title}</div>
        <div className="text-gray-600">{description}</div>
      </div>
    </div>
  );
}