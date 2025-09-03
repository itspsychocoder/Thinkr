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
  const [zoom, setZoom] = useState(0.3); // Default zoom level


  const [selectedPlatform, setSelectedPlatform] = useState("instagram");

  // Platform configurations
  const platforms = {
    instagram: { width: 1080, height: 1080, name: "Instagram Post" },
    linkedin: { width: 1200, height: 627, name: "LinkedIn Post" },
    whatsapp: { width: 1080, height: 1920, name: "WhatsApp Status" },
    facebook: { width: 1200, height: 630, name: "Facebook Post" },
    twitter: { width: 1200, height: 675, name: "Twitter Post" }
  };

  // Add image fit option state
  const [imageFitOption, setImageFitOption] = useState("fit");

  // Image fit options
  const imageFitOptions = {
    fit: {
      name: "Fit to Canvas",
      description: "Maintains aspect ratio, may show white space"
    },
    stretch: {
      name: "Stretch to Fill",
      description: "Fills entire canvas, may distort image"
    },
    crop: {
      name: "Crop to Fill",
      description: "Fills canvas by cropping image, maintains aspect ratio"
    }
  };


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
        setImgObj(img);
        // Use drawCanvas instead of manually drawing
        drawCanvas(img, texts)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scale factors for zoom
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
  
    texts.forEach(element => {
      const ctx = canvas.getContext("2d");
      ctx.font = `${element.size}px ${element.font}`;
      const textWidth = ctx.measureText(element.value).width;
      const textHeight = element.size;
  
    // Check if click is within text bounds (considering center alignment)
    if (
      x >= element.x - textWidth/2 &&
      x <= element.x + textWidth/2 &&
      y <= element.y &&
      y >= element.y - textHeight
    ) {
      setDragging(true);
      setCurrentId(element.id);
      offsetRef.current = { x: x - element.x, y: y - element.y };
    }
  });
};

const handleMouseMove = (e) => {
  if (!dragging || !imgObj) return;
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  
  // Calculate scale factors for zoom
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const newPos = {
    x: x - offsetRef.current.x,
    y: y - offsetRef.current.y,
  };
  let otherElements = texts.filter(text => text.id !== currentId);
  let elementToChange = texts.find(item => item.id === currentId);
  
  if (elementToChange) {
    elementToChange.x = newPos.x;
    elementToChange.y = newPos.y;
    setTexts([...otherElements, elementToChange]);
  }
};


  const handleMouseUp = () => {
    setDragging(false)
  }

  const drawCanvas = (img, newTexts) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const platform = platforms[selectedPlatform];

    // Set fixed canvas size based on platform
    canvas.width = platform.width;
    canvas.height = platform.height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (img) {
      if (imageFitOption === "stretch") {
        // Stretch to fill entire canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else if (imageFitOption === "crop") {
        // Crop to fill - maintains aspect ratio but crops if needed
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.max(scaleX, scaleY); // Use max instead of min for cropping

        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Center the image (may crop edges)
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      } else {
        // Fit to canvas - maintains aspect ratio with white space if needed
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.min(scaleX, scaleY);

        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Center the image
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      }
    }

    // Draw texts
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
    if (!text.trim()) return; // Don't add empty text
    
    let newId = texts.length + 1;
    const platform = platforms[selectedPlatform];
    
    // Place text in center of canvas
    let newItem = { 
      id: newId, 
      value: text, 
      font: font, 
      size: fontSize, 
      color: fontColor, 
      x: platform.width / 2,  // Center horizontally
      y: platform.height / 2  // Center vertically
    };
    
    setTexts([...texts, newItem]);
    setText(""); // Clear input after adding
  };


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


  // unsplash states and functions
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    const res = await fetch(`/api/search-unsplash?query=${query}`);
    const data = await res.json();
    setResults(data.results || []);
  };


  const handleImageSelect = (url) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous"; // important for canvas
    img.onload = () => {
      setImgObj(img);
      drawCanvas(img, texts);
    };
    img.src = url;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    if (imgObj) {
      drawCanvas(imgObj, texts);
    } else {
      // Draw empty canvas with white background
      const canvas = canvasRef.current;
      const platform = platforms[selectedPlatform];
      canvas.width = platform.width;
      canvas.height = platform.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [selectedPlatform, zoom, imageFitOption, texts]); // Added texts to dependencies
  

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

              {/* Platform Selection */}
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(platforms).map(([key, platform]) => (
                      <SelectItem key={key} value={key}>
                        {platform.name} ({platform.width}x{platform.height})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

                   {/* Image Fit Option */}
                   <div className="space-y-2">
                <Label htmlFor="image-fit">Image Fitting</Label>
                <Select value={imageFitOption} onValueChange={setImageFitOption}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(imageFitOptions).map(([key, option]) => (
                      <SelectItem key={key} value={key}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  {imageFitOptions[imageFitOption].description}
                </p>
              </div>


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
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full"
                    />
                    <Button onClick={handleSearch} className="w-full" variant="outline">
                      Search Unsplash
                    </Button>

                    {/* Results grid */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {results.map((img) => (
                        <img
                          key={img.id}
                          src={img.urls.small}
                          alt={img.alt_description}
                          className="rounded cursor-pointer hover:opacity-80"
                          onClick={() => handleImageSelect(img.urls.full)}
                        />
                      ))}
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

      {/* Center canvas area */}
      <div className="flex-1 bg-white p-4 flex flex-col">
        {/* Zoom controls */}
        <div className="flex items-center justify-center mb-4 space-x-4">
          <Label className="text-sm">Zoom:</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
          >
            -
          </Button>
          <Input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-32"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(1, zoom + 0.1))}
          >
            +
          </Button>
          <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
        </div>

        {/* Canvas container with fixed size and scrollbars */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="border border-gray-300 bg-white shadow-lg overflow-auto"
            style={{
              maxWidth: '600px',
              maxHeight: '500px',
              width: '600px',
              height: '500px'
            }}
          >
            <div className="flex items-center justify-center min-h-full">
              <canvas
                ref={canvasRef}
                className="cursor-move block"
                style={{
                  width: `${platforms[selectedPlatform].width * zoom}px`,
                  height: `${platforms[selectedPlatform].height * zoom}px`,
                  maxWidth: 'none'
                }}
              />
            </div>
          </div>
        </div>
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