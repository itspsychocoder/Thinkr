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
  deleteSelectedText,
  fonts
}) {
  const selectedText = texts.find(t => t.id === currentId);

  return (
    <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-4">
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-white dark:bg-gray-700">
          <TabsTrigger value="properties" className="text-xs dark:text-white dark:data-[state=active]:bg-gray-600">Properties</TabsTrigger>
          <TabsTrigger value="layers" className="text-xs dark:text-white dark:data-[state=active]:bg-gray-600">Layers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="mt-4">
          <div className="space-y-4">
            <h3 className="font-semibold dark:text-white">Text Properties</h3>
            {selectedText ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="selected-text" className="dark:text-gray-200">Text Content</Label>
                  <Textarea 
                    value={selectedText.value}
                    onChange={e => updateSelectedText('value', e.target.value)}
                    id="selected-text"
                    className="w-full h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selected-color" className="dark:text-gray-200">Color</Label>
                  <Input 
                    value={selectedText.color} 
                    onChange={e => updateSelectedText('color', e.target.value)} 
                    type="color" 
                    id="selected-color" 
                    className="w-full h-10 dark:bg-gray-700 dark:border-gray-600" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selected-size" className="dark:text-gray-200">Size: {selectedText.size}px</Label>
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
                  <Label htmlFor="selected-font" className="dark:text-gray-200">Font Family</Label>
                  <Select value={selectedText.font} onValueChange={value => updateSelectedText('font', value)}>
                    <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    {
                      fonts.map((f) => (
                        <SelectItem key={f.label} value={f.label} className="dark:text-white dark:focus:bg-gray-600">{f.name}</SelectItem>
                      ))
                    }
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
              <p className="text-gray-500 dark:text-gray-400 text-center">No text selected</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="layers" className="mt-4">
          <div className="space-y-4">
            <h3 className="font-semibold dark:text-white">Text Layers</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {texts.length > 0 ? (
                texts.map((textItem) => (
                  <div 
                    key={textItem.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      currentId === textItem.id 
                        ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600' 
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'
                    }`}
                    onClick={() => setCurrentId(textItem.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate dark:text-white">
                          Text {textItem.id}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          "{textItem.value}"
                        </p>
                      </div>
                      <div className="ml-2 flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded border border-gray-300 dark:border-gray-500"
                          style={{ backgroundColor: textItem.color }}
                        ></div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {textItem.size}px
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center">No text layers</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}