"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import englishTexts from "@/data/english-texts.json";
import urduTexts from "@/data/urdu-texts.json";

export default function PreMadeTexts({ setText }) {
  const handleTextSelect = (selectedText) => {
    setText(selectedText);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Pre-made Texts</h3>
      
      <Tabs defaultValue="english" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10">
          <TabsTrigger value="english" className="text-xs">English</TabsTrigger>
          <TabsTrigger value="urdu" className="text-xs">اردو</TabsTrigger>
        </TabsList>

        <TabsContent value="english" className="mt-4">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {englishTexts.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => handleTextSelect(item.text)}
              >
                <div className="text-xs">
                  <div className="font-medium truncate">{item.text}</div>
                  <div className="text-gray-500 capitalize">{item.category}</div>
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="urdu" className="mt-4">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {urduTexts.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="w-full justify-start text-right h-auto p-3"
                onClick={() => handleTextSelect(item.text)}
              >
                <div className="text-xs w-full">
                  <div className="font-medium truncate" dir="rtl">{item.text}</div>
                  <div className="text-gray-500 text-left capitalize">{item.category}</div>
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}