import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Home, 
  Heart, 
  Edit, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export interface ManageablePropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  type: 'sale' | 'rent';
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  image: string;
  className?: string;
  onDelete: (id: string) => Promise<void>;
}

export const ManageablePropertyCard: React.FC<ManageablePropertyCardProps> = ({
  id,
  title,
  price,
  location,
  type,
  propertyType,
  bedrooms,
  bathrooms,
  area,
  image,
  className,
  onDelete
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isFav = isFavorite(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/properties/edit/${id}`);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(id);
      toast({
        title: "Property deleted",
        description: "The property has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the property. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card className={cn(
        "overflow-hidden transition-all hover:shadow-lg flex flex-col",
        className
      )}>
        <Link
          to={`/property/${id}`}
          className="relative block overflow-hidden aspect-square"
        >
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              // Fallback image if the property image fails to load
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <Badge
            variant="outline"
            className={cn(
              "absolute top-2 left-2",
              type === 'sale'
                ? "bg-blue-500 hover:bg-blue-500 text-white"
                : "bg-green-500 hover:bg-green-500 text-white"
            )}
          >
            For {type === 'sale' ? 'Sale' : 'Rent'}
          </Badge>

          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full bg-white"
              onClick={handleFavoriteClick}
            >
              <Heart
                className="h-4 w-4"
                fill={isFav ? "red" : "transparent"}
                stroke={isFav ? "red" : "currentColor"}
              />
            </Button>
          </div>
        </Link>

        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>

          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>

          <div className="flex items-center mb-3">
            <Badge variant="secondary" className="mr-2">
              {propertyType}
            </Badge>
            <span className="text-lg font-bold text-primary">{price}</span>
            {type === 'rent' && (
              <span className="text-sm text-muted-foreground ml-1">/month</span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            {bedrooms !== undefined && bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
            )}

            {bathrooms !== undefined && bathrooms > 0 && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
            )}

            <div className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              <span>{area}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 mr-2"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex-1"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete Property'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
