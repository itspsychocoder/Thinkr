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
import PreMadeTexts from "@/components/PreMadeTexts";

export default function Home() {
  const [zoom, setZoom] = useState(0.3); // Default zoom level
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [invert, setInvert] = useState(0);

  const [quality, setQuality] = useState("png");

  const availableFonts = [
    {
      label: "Arial",
      name: "Arial"
    },
    {
      label: "Helvetica",
      name: "Helvetica"
    },
    {
      label: "Times New Roman",
      name: "Times New Roman"
    },
    {
      label: "Times",
      name: "Times"
    },
    {
      label: "Courier New",
      name: "Courier New"
    },
    {
      label: "Courier",
      name: "Courier"
    },
    {
      label: "Verdana",
      name: "Verdana"
    },
    {
      label: "Georgia",
      name: "Georgia"
    },
    {
      label: "Palatino",
      name: "Palatino"
    },
    {
      label: "Garamond",
      name: "Garamond"
    },
    {
      label: "Bookman",
      name: "Bookman"
    },
    {
      label: "Comic Sans MS",
      name: "Comic Sans MS"
    },
    {
      label: "Trebuchet MS",
      name: "Trebuchet MS"
    },
    {
      label: "Arial Black",
      name: "Arial Black"
    },
    {
      label: "Impact",
      name: "Impact"
    },
    {
      label: "Lucida Sans Unicode",
      name: "Lucida Sans Unicode"
    },
    {
      label: "Tahoma",
      name: "Tahoma"
    },
    {
      label: "Lucida Console",
      name: "Lucida Console"
    },
    {
      label: "Monaco",
      name: "Monaco"
    },
    {
      label: "Bradley Hand ITC",
      name: "Bradley Hand ITC"
    },
    {
      label: "noori",
      name: "Noto Jameel"
    }
  ]

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
      
    // Split text into lines for multiline detection
    const lines = element.value.split('\n');
    const lineHeight = element.size * 1.2;
    const totalHeight = lines.length * lineHeight;
    
    // Get the widest line for click detection
    let maxWidth = 0;
    lines.forEach(line => {
      const lineWidth = ctx.measureText(line).width;
      if (lineWidth > maxWidth) maxWidth = lineWidth;
    });

    // Calculate text block boundaries
    const startY = element.y - (totalHeight / 2);
    const endY = element.y + (totalHeight / 2);


      // Check if click is within text bounds (considering center alignment)
      if (
        x >= element.x - maxWidth/2 &&
        x <= element.x + maxWidth/2 &&
        y >= startY &&
        y <= endY
      ){
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
      console.log(elementToChange)
      elementToChange.x = newPos.x;
      elementToChange.y = newPos.y;
      setTexts([...otherElements, elementToChange]);
    }
  };


  const handleMouseUp = () => {
    setDragging(false)
  }

  const drawCanvas = async (img, newTexts) => {

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const platform = platforms[selectedPlatform];

    // Set fixed canvas size based on platform
    canvas.width = platform.width;
    canvas.height = platform.height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (img) {
      ctx.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      grayscale(${grayscale}%)
      blur(${blur}px)
      sepia(${sepia}%)
      invert(${invert}%)
    `;
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
      ctx.filter = 'none';
    }

    const textsArray = Array.isArray(newTexts) && newTexts.length > 0 ? newTexts : texts;

    for (const text of textsArray) {
      ctx.save();

      if (text.font === "noori") {
        // Wait for font to load
        await document.fonts.load(`${text.size}px JameelNastaleeq`);
        ctx.font = `${text.size}px JameelNastaleeq, Arial`;
        ctx.direction = "rtl";
        ctx.textAlign = "center";
      } else {
        ctx.font = `${text.size}px "${text.font}", Arial, sans-serif`;
        ctx.direction = "ltr";
        ctx.textAlign = "center";
      }

      ctx.fillStyle = text.color;
      // Split text by line breaks and draw each line
      const lines = text.value.split('\n');
      const lineHeight = text.size * 1.2; // 1.2 is a good line height multiplier

      // Calculate starting Y position to center the text block
      const totalHeight = lines.length * lineHeight;
      const startY = text.y - (totalHeight / 2) + lineHeight;

      lines.forEach((line, index) => {
        const yPosition = startY + (index * lineHeight);
        ctx.fillText(line, text.x, yPosition);
      });

      ctx.restore();
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


  // font loading
  useEffect(() => {
    const loadFont = async () => {
      try {
        // Check if font is already loaded
        if (!document.fonts.check('16px JameelNastaleeq')) {
          const font = new FontFace('JameelNastaleeq', 'url(/fonts/noto-jameel.ttf)');
          await font.load();
          document.fonts.add(font);
          console.log('JameelNastaleeq font loaded successfully');
        }
      } catch (error) {
        console.error('Font loading failed:', error);
      }
    };

    loadFont();
  }, []);


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
  }, [selectedPlatform, zoom, imageFitOption, texts, brightness, contrast, saturation, grayscale, blur, sepia, invert]);


  const downloadImage = () => {
    const canvas = canvasRef.current;

    let mimeType = "image/png";
    if (quality === "jpg") mimeType = "image/jpeg";
    if (quality === "png") mimeType = "image/pg";

    const dataURL = canvas.toDataURL(mimeType);

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `canvas-image.${quality}`;
    link.click();
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
    {/* Left sidebar with tabs */}
    <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 grid-rows-2 h-20 bg-white dark:bg-gray-700">
          <TabsTrigger value="upload" className="text-xs dark:text-white dark:data-[state=active]:bg-gray-600">
            Image Upload
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs dark:text-white dark:data-[state=active]:bg-gray-600">
            Style
          </TabsTrigger>
          <TabsTrigger value="pretext" className="text-xs dark:text-white dark:data-[state=active]:bg-gray-600">
            Pre-texts
          </TabsTrigger>
          <TabsTrigger value="download" className="text-xs dark:text-white dark:data-[state=active]:bg-gray-600">
            Download
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <div className="space-y-4">
            <h3 className="font-semibold dark:text-white">Upload Image</h3>
            
            <div className="space-y-2">
              <Label htmlFor="platform" className="dark:text-gray-200">Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  {Object.entries(platforms).map(([key, platform]) => (
                    <SelectItem key={key} value={key} className="dark:text-white dark:focus:bg-gray-600">
                      {platform.name} ({platform.width}x{platform.height})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-fit" className="dark:text-gray-200">Image Fitting</Label>
              <Select value={imageFitOption} onValueChange={setImageFitOption}>
                <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  {Object.entries(imageFitOptions).map(([key, option]) => (
                    <SelectItem key={key} value={key} className="dark:text-white dark:focus:bg-gray-600">
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {imageFitOptions[imageFitOption].description}
              </p>
            </div>

            <Tabs defaultValue="local" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-10 dark:bg-gray-700">
                <TabsTrigger value="local" className="text-xs dark:text-white">Upload Image</TabsTrigger>
                <TabsTrigger value="unsplash" className="text-xs dark:text-white">Unsplash</TabsTrigger>
              </TabsList>

              <TabsContent value="local" className="mt-4">
                <div className="space-y-4">
                  <Input 
                    type="file" 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upload an image from your device</p>
                  {/* <p className="dark:text-white">Selected Text: {currentId}</p> */}
                </div>
              </TabsContent>

              <TabsContent value="unsplash" className="mt-4">
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Search for images..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                  <Button onClick={handleSearch} className="w-full" variant="outline">
                    Search Unsplash
                  </Button>
                  
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
          <div className="space-y-2 max-h-100 overflow-y-auto">
            <h3 className="font-semibold dark:text-white">Style Options</h3>
            
            <div className="space-y-2">
              <Label htmlFor="font-color" className="dark:text-gray-200">Font Color</Label>
              <Input 
                value={fontColor} 
                onChange={e => setFontColor(e.target.value)} 
                type="color" 
                id="font-color" 
                className="w-full h-10 dark:bg-gray-700 dark:border-gray-600" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="font-size" className="dark:text-gray-200">Font Size</Label>
              <Input 
                value={fontSize} 
                onChange={e => setFontSize(e.target.value)} 
                type="range" 
                id="font-size" 
                min="12" 
                max="72" 
                className="w-full" 
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{fontSize}px</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="font-family" className="dark:text-gray-200">Font Family</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  {availableFonts.map((f) => (
                    <SelectItem key={f.label} value={f.label} className="dark:text-white dark:focus:bg-gray-600">
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-600"></div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm dark:text-white">Image Styling</h4>
              
              {/* Add dark classes to all the slider sections */}
              <div className="space-y-2">
                <Label htmlFor="brightness" className="dark:text-gray-200">Brightness</Label>
                <Input
                  value={brightness}
                  onChange={e => setBrightness(e.target.value)}
                  type="range"
                  id="brightness"
                  min="0"
                  max="200"
                  className="w-full"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{brightness}%</span>
              </div>
              
              
              <div className="space-y-2">
                  <Label htmlFor="contrast">Contrast</Label>
                  <Input
                    value={contrast}
                    onChange={e => setContrast(e.target.value)}
                    type="range"
                    id="contrast"
                    min="0"
                    max="200"
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{contrast}%</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saturation">Saturation</Label>
                  <Input
                    value={saturation}
                    onChange={e => setSaturation(e.target.value)}
                    type="range"
                    id="saturation"
                    min="0"
                    max="200"
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{saturation}%</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grayscale">Grayscale</Label>
                  <Input
                    value={grayscale}
                    onChange={e => setGrayscale(e.target.value)}
                    type="range"
                    id="grayscale"
                    min="0"
                    max="100"
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{grayscale}%</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blur">Blur</Label>
                  <Input
                    value={blur}
                    onChange={e => setBlur(e.target.value)}
                    type="range"
                    id="blur"
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{blur}px</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sepia">Sepia</Label>
                  <Input
                    value={sepia}
                    onChange={e => setSepia(e.target.value)}
                    type="range"
                    id="sepia"
                    min="0"
                    max="100"
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{sepia}%</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invert">Invert</Label>
                  <Input
                    value={invert}
                    onChange={e => setInvert(e.target.value)}
                    type="range"
                    id="invert"
                    min="0"
                    max="100"
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{invert}%</span>
                </div>

                {/* Reset button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setBrightness(100);
                    setContrast(100);
                    setSaturation(100);
                    setGrayscale(0);
                    setBlur(0);
                    setSepia(0);
                    setInvert(0);
                  }}
                >
                  Reset Filters
                </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pretext" className="mt-4">
            <div className="space-y-4">
              {/* Add text section first */}
              <div className="space-y-2">
                <h3 className="font-semibold">Add Custom Text</h3>
                <Textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Add custom text..."
                  className="w-full h-20"
                />
                <Button onClick={handleTextAdd} className="w-full">Add Text</Button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300"></div>

              {/* Pre-made texts component */}
              <PreMadeTexts setText={setText} />
            </div>
          </TabsContent>

          <TabsContent value="download" className="mt-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Download Options</h3>
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={downloadImage} className="w-full" variant="default">Download Image</Button>
            </div>
          </TabsContent>
        </Tabs>

       

        {/* Credits Section */}
        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
          <div className="text-center space-y-2">
            <div className="text-xs text-gray-600 dark:text-gray-400">Created by</div>
            <div className="text-sm font-semibold text-gray-800 dark:text-white">Psycho Coder</div>
            <div className="space-y-1">
              <a
                href="https://github.com/itspsychocoder"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                GitHub: itspsychocoder
              </a>
              <a
                href="https://hussnainahmad.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                hussnainahmad.tech
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Center canvas area */}
      <div className="flex-1 bg-white dark:bg-gray-900 p-4 flex flex-col">
        <div className="flex items-center justify-center mb-4 space-x-4">
          <Label className="text-sm dark:text-white">Zoom:</Label>
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

        <div className="flex-1 flex items-center justify-center">
          <div
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg overflow-auto"
            style={{
              maxWidth: '600px',
              maxHeight: '500px',
              width: '600px',
              height: '500px'
            }}
          >
            {/* Canvas stays the same */}
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

      {/* Right sidebar - you'll need to update RightSidebar component too */}
      <RightSidebar
        fonts={availableFonts}
        texts={texts}
        currentId={currentId}
        setCurrentId={setCurrentId}
        updateSelectedText={updateSelectedText}
        deleteSelectedText={deleteSelectedText}
      />
    </div>
  );
}