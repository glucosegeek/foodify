import React, { useState } from 'react';
import { Upload, FileText, Image, X, Download, Eye, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
}

interface MenuFile {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  url: string;
  size: string;
  uploaded_at: string;
}

export function RestaurantMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Truffle Risotto',
      description: 'Creamy risotto with wild mushrooms and truffle oil',
      price: 24.99,
      category: 'Main Course',
      image_url: 'https://images.unsplash.com/photo-1476124369491-b79d2e6b1b4c?w=400',
      is_available: true
    },
    {
      id: '2',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with lemon butter sauce',
      price: 28.50,
      category: 'Main Course',
      is_available: true
    }
  ]);

  const [menuFiles, setMenuFiles] = useState<MenuFile[]>([
    {
      id: '1',
      name: 'Main Menu 2025.pdf',
      type: 'pdf',
      url: 'https://example.com/menu.pdf',
      size: '2.4 MB',
      uploaded_at: '2025-01-15T10:30:00Z'
    }
  ]);

  const [uploadMode, setUploadMode] = useState<'items' | 'files'>('items');
  const [isDragging, setIsDragging] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const fileType = file.type.includes('pdf') ? 'pdf' : 'image';
      const newFile: MenuFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: fileType,
        url: URL.createObjectURL(file),
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploaded_at: new Date().toISOString()
      };
      setMenuFiles(prev => [...prev, newFile]);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}. Only PDF, JPG, and PNG files are allowed.`);
        return;
      }

      const fileType = file.type.includes('pdf') ? 'pdf' : 'image';
      const newFile: MenuFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: fileType,
        url: URL.createObjectURL(file),
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploaded_at: new Date().toISOString()
      };
      setMenuFiles(prev => [...prev, newFile]);
    });
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Are you sure you want to delete this menu file?')) {
      setMenuFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(prev => prev.filter(i => i.id !== itemId));
    }
  };

  const handleAddMenuItem = () => {
    // Temporary: Add a sample item
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: 'New Dish',
      description: 'Click edit to add description',
      price: 0.00,
      category: 'Main Course',
      is_available: true
    };
    setMenuItems(prev => [...prev, newItem]);
    alert('Menu item added! (This is a demo - full form coming soon)');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <p className="text-gray-600 mt-2">Manage your menu items or upload menu files (PDF, JPG, PNG)</p>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setUploadMode('items')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            uploadMode === 'items'
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Menu Items ({menuItems.length})
        </button>
        <button
          onClick={() => setUploadMode('files')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            uploadMode === 'files'
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Upload className="h-4 w-4 inline mr-2" />
          Menu Files ({menuFiles.length})
        </button>
      </div>

      {uploadMode === 'files' && (
        <>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Menu Files
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your menu files here, or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supported formats: PDF, JPG, PNG (Max size: 10MB)
                </p>
                <input
                  type="file"
                  id="menu-file-upload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="menu-file-upload">
                  <span className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Uploaded Menu Files</h2>
            {menuFiles.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No menu files uploaded yet
                  </h3>
                  <p className="text-gray-600">
                    Upload your menu in PDF or image format
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuFiles.map(file => (
                  <Card key={file.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                          file.type === 'pdf' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {file.type === 'pdf' ? (
                            <FileText className="h-6 w-6 text-red-600" />
                          ) : (
                            <Image className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                          <p className="text-sm text-gray-500">{file.size}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Uploaded {formatDate(file.uploaded_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.url;
                            link.download = file.name;
                            link.click();
                          }}
                          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {uploadMode === 'items' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
            <button 
              onClick={handleAddMenuItem}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </button>
          </div>

          {categories.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No menu items yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start building your digital menu by adding items
                </p>
                <button 
                  onClick={handleAddMenuItem}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Item
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 pb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex space-x-4">
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                  <span className="text-lg font-bold text-orange-600 ml-2">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {item.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      item.is_available
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {item.is_available ? 'Available' : 'Unavailable'}
                                  </span>
                                  <div className="flex space-x-1">
                                    <button 
                                      onClick={() => alert('Edit functionality coming soon!')}
                                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}