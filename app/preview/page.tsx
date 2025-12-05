"use client";

import { useState } from "react";
import {
  MobileShell,
  FridgeView,
  TimerView,
  GuideView,
  StatsView,
  type EggBox,
  type TabId,
} from "@/components/eggscuseme";

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState<TabId>("fridge");
  const [boxes, setBoxes] = useState<EggBox[]>([
    {
      id: 1,
      laidDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      quantity: 6,
    },
    {
      id: 2,
      laidDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      quantity: 4,
    },
  ]);

  const handleAddBox = (box: EggBox) => {
    setBoxes((prev) => [...prev, box]);
  };

  const handleDeleteBox = (id: number) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "fridge":
        return (
          <FridgeView
            boxes={boxes}
            onAddBox={handleAddBox}
            onDeleteBox={handleDeleteBox}
          />
        );
      case "timer":
        return <TimerView />;
      case "guide":
        return <GuideView />;
      case "stats":
        return <StatsView />;
      default:
        return (
          <FridgeView
            boxes={boxes}
            onAddBox={handleAddBox}
            onDeleteBox={handleDeleteBox}
          />
        );
    }
  };

  return (
    <MobileShell defaultTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MobileShell>
  );
}
