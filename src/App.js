import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PatternEditor = () => {
  const [dimensions, setDimensions] = useState({ width: 32, height: 27 });
  const [grid, setGrid] = useState(() => {
    return Array(dimensions.height).fill().map(() => Array(dimensions.width).fill(null));
  });
  const [selectedColor, setSelectedColor] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = {
    1: { name: 'white', rgb: { red: 236, green: 240, blue: 241 } },
    2: { name: 'lightgray', rgb: { red: 165, green: 180, blue: 190 } },
    3: { name: 'darkgray', rgb: { red: 105, green: 121, blue: 135 } },
    4: { name: 'black', rgb: { red: 44, green: 62, blue: 80 } },
    5: { name: 'pink', rgb: { red: 255, green: 167, blue: 209 } },
    6: { name: 'red', rgb: { red: 231, green: 76, blue: 60 } },
    7: { name: 'orange', rgb: { red: 230, green: 126, blue: 34 } },
    8: { name: 'brown', rgb: { red: 160, green: 106, blue: 66 } },
    9: { name: 'yellow', rgb: { red: 241, green: 196, blue: 15 } },
    10: { name: 'lime', rgb: { red: 54, green: 222, blue: 127 } },
    11: { name: 'green', rgb: { red: 2, green: 162, blue: 1 } },
    12: { name: 'cyan', rgb: { red: 0, green: 211, blue: 212 } },
    13: { name: 'blue', rgb: { red: 0, green: 152, blue: 255 } },
    14: { name: 'indigo', rgb: { red: 0, green: 65, blue: 176 } },
    15: { name: 'magenta', rgb: { red: 207, green: 110, blue: 228 } },
    16: { name: 'purple', rgb: { red: 155, green: 28, blue: 182 } },
    17: { name: 'beige', rgb: { red: 255, green: 224, blue: 180 } },
    18: { name: 'darkred', rgb: { red: 190, green: 0, blue: 57 } }
  };

  const getRgbString = (color) => {
    return `rgb(${color.rgb.red}, ${color.rgb.green}, ${color.rgb.blue})`;
  };

  const handleDimensionChange = (dim, value) => {
    const newValue = Math.max(1, Math.min(100, parseInt(value) || 1));
    setDimensions(prev => ({
      ...prev,
      [dim]: newValue
    }));
    
    // Recréer la grille avec les nouvelles dimensions
    setGrid(Array(newValue).fill().map(() => Array(dimensions.width).fill(null)));
  };

  const handleMouseDown = (row, col) => {
    setIsDrawing(true);
    const newGrid = [...grid];
    newGrid[row][col] = selectedColor;
    setGrid(newGrid);
  };

  const handleMouseOver = (row, col) => {
    if (!isDrawing) return;
    const newGrid = [...grid];
    newGrid[row][col] = selectedColor;
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const getPatternCode = () => {
    const pattern = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] !== null) {
          pattern.push({x, y, color: grid[y][x]});
        }
      }
    }
    
    const formattedPattern = pattern.map(p => `  { x: ${p.x}, y: ${p.y}, color: ${p.color} }`).join(',\n');
    
    return `// Pattern
const PATTERN = [
${formattedPattern}
];`;
  };

  const clearGrid = () => {
    setGrid(Array(dimensions.height).fill().map(() => Array(dimensions.width).fill(null)));
  };

  const exportDrawing = () => {
    const pattern = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] !== null) {
          pattern.push({x, y, color: grid[y][x]});
        }
      }
    }
    
    const data = {
      width: dimensions.width,
      height: dimensions.height,
      pattern: pattern
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ftplace-pattern.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDrawing = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setDimensions({
            width: data.width || 32,
            height: data.height || 27
          });
          
          const newGrid = Array(data.height || 27).fill().map(() => Array(data.width || 32).fill(null));
          data.pattern.forEach(({x, y, color}) => {
            if (x < newGrid[0].length && y < newGrid.length) {
              newGrid[y][x] = color;
            }
          });
          setGrid(newGrid);
        } catch (error) {
          console.error('Erreur lors de l\'importation:', error);
          alert('Erreur lors de l\'importation du fichier');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <Card>
        <CardHeader>
          <CardTitle>Éditeur de Pattern FTplace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Largeur:</label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                className="border rounded px-2 py-1 w-20"
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hauteur:</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                className="border rounded px-2 py-1 w-20"
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Couleurs :</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(colors).map(([id, color]) => (
                <div
                  key={id}
                  onClick={() => setSelectedColor(parseInt(id))}
                  className={`w-8 h-8 rounded cursor-pointer flex items-center justify-center ${selectedColor === parseInt(id) ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: getRgbString(color) }}
                  title={color.name}
                >
                  <span className="text-xs" style={{
                    color: parseInt(id) === 1 ? 'black' : 'white'
                  }}>{id}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 flex gap-2">
            <button onClick={clearGrid} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Effacer
            </button>
            <button onClick={exportDrawing} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Exporter
            </button>
            <label className="px-4 py-2 bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600">
              Importer
              <input
                type="file"
                accept=".json"
                onChange={importDrawing}
                className="hidden"
              />
            </label>
          </div>

          <div className="mb-4 inline-block border border-gray-300" style={{ maxWidth: '100%', overflowX: 'auto' }}>
            {grid.map((row, i) => (
              <div key={i} className="flex">
                {row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="w-6 h-6 border border-gray-200 cursor-pointer"
                    style={{ backgroundColor: cell !== null ? getRgbString(colors[cell]) : 'white' }}
                    onMouseDown={() => handleMouseDown(i, j)}
                    onMouseOver={() => handleMouseOver(i, j)}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="font-bold mb-2">Code Pattern généré :</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {getPatternCode()}
            </pre>
          </div>

          <div className="mt-4 text-sm">
            <p>Instructions :</p>
            <ol className="list-decimal pl-5">
              <li>Ajustez les dimensions de la grille</li>
              <li>Sélectionnez une couleur</li>
              <li>Cliquez et glissez pour dessiner</li>
              <li>Copiez le code généré</li>
              <li>Collez le code dans le script FTplace</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternEditor;