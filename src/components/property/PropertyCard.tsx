import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Home, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';

export interface PropertyCardProps {
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
  horizontal?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
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
  horizontal = false,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-lg",
      horizontal ? "flex flex-row" : "flex flex-col",
      className
    )}>
      <Link
        to={`/property/${id}`}
        className={cn(
          "relative block overflow-hidden",
          horizontal ? "w-1/3" : "aspect-square"
        )}
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

      <div className={cn(
        "flex flex-col flex-grow",
        horizontal ? "flex-1 p-4" : ""
      )}>
        <CardContent className={cn(
          "p-4",
          horizontal ? "p-0" : ""
        )}>
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

        {!horizontal && (
          <CardFooter className="px-4 pb-4 pt-0">
            <Button variant="outline" className="w-full" asChild>
              <Link to={`/property/${id}`}>
                View Details
              </Link>
            </Button>
          </CardFooter>
        )}
      </div>
    </Card>
  );
};
