"use client";

import Image from "next/image";
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
import { useEffect, useRef, useState } from "react";
import RightSidebar from "@/components/RightSidebar";

export default function Home() {
  const canvasRef = useRef(null)

  const [imgObj, setImgObj] = useState(null)

  const [texts, setTexts] = useState([])

  const [font, setFont] = useState("Arial")
  const [fontSize, setFontSize] = useState(40)
  const [fontColor, setFontColor] = useState("#FFFFFF")

  const [dragging, setDragging] = useState(false)

  const [currentId, setCurrentId] = useState(0)

  const [text, setText] = useState("")

  // Keep track of mouse offset inside text
  const offsetRef = useRef({ x: 0, y: 0 })

  const updateSelectedText = (property, value) => {
    const selectedText = texts.find(t => t.id === currentId);
    if (!selectedText) return;

    const updatedTexts = texts.map(text =>
      text.id === currentId
        ? { ...text, [property]: value }
        : text
    );
    setTexts(updatedTexts);
  };

  const deleteSelectedText = () => {
    const selectedText = texts.find(t => t.id === currentId);
    if (!selectedText) return;

    const updatedTexts = texts.filter(text => text.id !== currentId);
    setTexts(updatedTexts);
    setCurrentId(0);
  };



  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    console.log(file)
    if (!file) return

    const reader = new FileReader()
    reader.onload = function (event) {
      const img = new window.Image()
      img.onload = function () {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Resize canvas to image
        canvas.width = img.width
        canvas.height = img.height

        // Draw image on canvas
        setImgObj(img)
        ctx.drawImage(img, 0, 0)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    ctx.font = `${fontSize}px ${font}`
    const textWidth = ctx.measureText(text).width
    const textHeight = fontSize // rough estimate

    texts.forEach(element => {

      // ✅ check bounding box of current text
      if (
        x >= element.x &&
        x <= element.x + textWidth &&
        y <= element.y &&
        y >= element.y - textHeight
      ) {
        setDragging(true)
        setCurrentId(element.id)
        offsetRef.current = { x: x - element.x, y: y - element.y }
      }

    })


  }

  const handleMouseMove = (e) => {
    if (!dragging || !imgObj) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newPos = {
      x: x - offsetRef.current.x,
      y: y - offsetRef.current.y,
    }
    let otherElements = texts.filter(text => text.id != currentId);
    let elementToChange = texts.find(item => item.id === currentId);
    elementToChange.x = newPos.x;
    elementToChange.y = newPos.y;
    console.log("Element Changed: ", elementToChange)

    setTexts([...otherElements, elementToChange]);

    drawCanvas(imgObj)
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  const drawCanvas = (img, newTexts) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Resize canvas to match image
    canvas.width = img.width
    canvas.height = img.height

    // Draw image
    ctx.drawImage(img, 0, 0)

    if (Array.isArray(newTexts) && newTexts.length > 0) {
      newTexts.forEach(text => {
        ctx.font = `${text.size}px ${text.font}`
        ctx.fillStyle = text.color
        ctx.textAlign = "center"
        ctx.fillText(text.value, text.x, text.y)
      });
    }
    else {
      texts.forEach(text => {
        ctx.font = `${text.size}px ${text.font}`
        ctx.fillStyle = text.color
        ctx.textAlign = "center"
        ctx.fillText(text.value, text.x, text.y)
      });
    }
  }

  const handleTextAdd = () => {
    let newId = texts.length + 1
    let newItem = { id: newId, value: text, font: font, size: fontSize, color: fontColor, x: 100, y: 100 }
    setTexts([...texts, newItem]);
  }


  useEffect(() => {
    const canvas = canvasRef.current
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseleave", handleMouseUp)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mouseleave", handleMouseUp)
    }
  })

  useEffect(() => {
    if (!canvasRef.current || !imgObj) return;
    drawCanvas(imgObj, texts);
  }, [texts, imgObj]);

  return (
    <div className="flex h-screen">
      {/* Left sidebar with tabs */}
      <div className="w-1/4 bg-gray-100 p-4">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 grid-rows-2 h-20">
            <TabsTrigger value="upload" className="text-xs">Image Upload</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="pretext" className="text-xs">Pre-texts</TabsTrigger>
            <TabsTrigger value="download" className="text-xs">Download</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Upload Image</h3>

              {/* Nested tabs for upload methods */}
              <Tabs defaultValue="local" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-10">
                  <TabsTrigger value="local" className="text-xs">Upload Image</TabsTrigger>
                  <TabsTrigger value="unsplash" className="text-xs">Unsplash</TabsTrigger>
                </TabsList>

                <TabsContent value="local" className="mt-4">
                  <div className="space-y-4">
                    <Input type="file" onChange={handleImageUpload} accept="image/*" className="w-full" />
                    <p className="text-sm text-gray-600">Upload an image from your device</p>
                    <p>Selected Text: {currentId}</p>
                  </div>
                </TabsContent>

                <TabsContent value="unsplash" className="mt-4">
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Search for images..."
                      className="w-full"
                    />
                    <Button className="w-full" variant="outline">
                      Search Unsplash
                    </Button>
                    <div className="text-center text-sm text-gray-500">
                      <p>Search and select images from Unsplash</p>
                      <p className="text-xs mt-2">Feature coming soon...</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>


          <TabsContent value="style" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Style Options</h3>
              <div className="space-y-2">
                <Label htmlFor="font-color">Font Color</Label>
                <Input value={fontColor} onChange={e => setFontColor(e.target.value)} type="color" id="font-color" className="w-full h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Input value={fontSize} onChange={e => setFontSize(e.target.value)} type="range" id="font-size" min="12" max="72" className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arial">Arial</SelectItem>
                    <SelectItem value="times">Times New Roman</SelectItem>
                    <SelectItem value="helvetica">Helvetica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pretext" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Pre-made Texts</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">Sample Text 1</Button>
                <Button variant="outline" className="w-full justify-start">Sample Text 2</Button>
                <Button variant="outline" className="w-full justify-start">Sample Text 3</Button>
              </div>
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Add custom text..."
                className="w-full h-20"
              />
              <Button onClick={handleTextAdd} className="w-full justify-start">Add Text</Button>
            </div>
          </TabsContent>

          <TabsContent value="download" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Download Options</h3>
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="svg">SVG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quality">Quality</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" variant="default">Download Image</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right side with canvas */}
      <div className="w-3/4 bg-white p-4 border rounded-md cursor-move">
        <canvas ref={canvasRef} id="mainCanvas" width="800" height="600" className="border border-gray-300"></canvas>
      </div>

      {/* Right sidebar */}
      <RightSidebar
        texts={texts}
        currentId={currentId}
        setCurrentId={setCurrentId}
        updateSelectedText={updateSelectedText}
        deleteSelectedText={deleteSelectedText}
      />
    </div>
  );
}