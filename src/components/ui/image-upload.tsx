import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface ImageUploadProps {
  onImageUpload: (imageUrls: string[]) => void;
  maxImages?: number;
  className?: string;
  initialImages?: string[];
  type?: 'property' | 'profile';
}

export function ImageUpload({
  onImageUpload,
  maxImages = 10,
  className,
  initialImages = [],
  type = 'property'
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the max number of images
    if (images.length + files.length > maxImages) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: `You can only upload a maximum of ${maxImages} images.`
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      // Append all files to the form data
      Array.from(files).forEach(file => {
        formData.append(type === 'property' ? 'images' : 'avatar', file);
      });

      // Upload the images
      const endpoint = type === 'property' ? '/api/upload/property' : '/api/upload/profile';
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://real-estate-backend-bq2m.onrender.com'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();

      // Get the image URLs from the response
      const uploadedImageUrls = type === 'property'
        ? data.images.map((img: { url: string }) => img.url)
        : [data.image.url];

      // Update the state with the new images
      const newImages = [...images, ...uploadedImageUrls];
      setImages(newImages);

      // Call the callback with the new images
      onImageUpload(newImages);

      toast({
        title: "Upload successful",
        description: `${uploadedImageUrls.length} image(s) uploaded successfully.`
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your images. Please try again."
      });
    } finally {
      setUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImageUpload(newImages);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Image preview area */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Uploaded image ${index + 1}`}
                className="h-32 w-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < maxImages && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={handleBrowseClick}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-gray-500">Uploading images...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">
                {type === 'property'
                  ? 'Drag & drop property images here, or click to browse'
                  : 'Click to upload your profile picture'}
              </p>
              <p className="text-gray-400 text-sm">
                {type === 'property'
                  ? `You can upload up to ${maxImages} images (${images.length}/${maxImages} used)`
                  : 'JPG, PNG or GIF, max 5MB'}
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={type === 'property'}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
