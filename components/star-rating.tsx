"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StarRatingProps {
  value?: number
  onChange?: (rating: number) => void
  disabled?: boolean
  allowDecimal?: boolean
}

export function StarRating({ value = 0, onChange, disabled = false, allowDecimal = false }: StarRatingProps) {
  const [hover, setHover] = useState(0)
  const [decimalInput, setDecimalInput] = useState(value.toString())

  const handleClick = (star: number) => {
    if (!disabled && onChange) {
      onChange(star)
      setDecimalInput(star.toString())
    }
  }

  const handleMouseEnter = (star: number) => {
    if (!disabled) {
      setHover(star)
    }
  }

  const handleMouseLeave = () => {
    if (!disabled) {
      setHover(0)
    }
  }

  const handleDecimalChange = (inputValue: string) => {
    setDecimalInput(inputValue)
    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 5 && onChange) {
      onChange(numValue)
    }
  }

  const renderStar = (star: number) => {
    const displayValue = hover || value
    const isFilled = star <= displayValue
    const isPartial = allowDecimal && star > displayValue && star - displayValue < 1 && displayValue > 0
    
    return (
      <Star
        className={`h-6 w-6 ${
          isFilled 
            ? "text-amber-500 fill-amber-500" 
            : isPartial 
            ? "text-amber-500 fill-amber-500 opacity-50" 
            : "text-gray-300"
        }`}
        style={isPartial ? { clipPath: `inset(0 ${100 - ((displayValue - (star - 1)) * 100)}% 0 0)` } : {}}
      />
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            disabled={disabled}
            className={`p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          >
            {renderStar(star)}
          </button>
        ))}
      </div>
      
      {allowDecimal && (
        <div className="flex items-center space-x-2">
          <Label htmlFor="decimal-rating" className="text-sm text-gray-600">
            Specific rating:
          </Label>
          <Input
            id="decimal-rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={decimalInput}
            onChange={(e) => handleDecimalChange(e.target.value)}
            className="w-20 h-8 text-sm"
            placeholder="4.7"
            disabled={disabled}
          />
          <span className="text-sm text-gray-500">/ 5</span>
        </div>
      )}
    </div>
  )
}
