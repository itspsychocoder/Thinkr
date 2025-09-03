"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RightSidebar({ 
  texts, 
  currentId, 
  setCurrentId, 
  updateSelectedText, 
  deleteSelectedText 
}) {
  const selectedText = texts.find(t => t.id === currentId);

  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
          <TabsTrigger value="layers" className="text-xs">Layers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="mt-4">
          <div className="space-y-4">
            <h3 className="font-semibold">Text Properties</h3>
            {selectedText ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="selected-text">Text Content</Label>
                  <Textarea 
                    value={selectedText.value}
                    onChange={e => updateSelectedText('value', e.target.value)}
                    id="selected-text"
                    className="w-full h-20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selected-color">Color</Label>
                  <Input 
                    value={selectedText.color} 
                    onChange={e => updateSelectedText('color', e.target.value)} 
                    type="color" 
                    id="selected-color" 
                    className="w-full h-10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selected-size">Size: {selectedText.size}px</Label>
                  <Input 
                    value={selectedText.size} 
                    onChange={e => updateSelectedText('size', e.target.value)}  
                    type="range" 
                    id="selected-size" 
                    min="12" 
                    max="72" 
                    className="w-full" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selected-font">Font Family</Label>
                  <Select value={selectedText.font} onValueChange={value => updateSelectedText('font', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={deleteSelectedText} 
                  variant="destructive" 
                  className="w-full"
                >
                  Delete Text
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No text selected</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="layers" className="mt-4">
          <div className="space-y-4">
            <h3 className="font-semibold">Text Layers</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {texts.length > 0 ? (
                texts.map((textItem) => (
                  <div 
                    key={textItem.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      currentId === textItem.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentId(textItem.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          Text {textItem.id}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          "{textItem.value}"
                        </p>
                      </div>
                      <div className="ml-2 flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: textItem.color }}
                        ></div>
                        <span className="text-xs text-gray-400">
                          {textItem.size}px
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No text layers</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}