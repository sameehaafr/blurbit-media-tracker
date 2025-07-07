import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bookmark, BookmarkCheck } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MediaCardProps {
  id: string
  title: string
  type: string
  coverImage: string
  dateCompleted?: string
  rating: number
  review: string
  status?: 'on_list' | 'consuming' | 'consumed'
  isSaved?: boolean
}

export function MediaCard({ id, title, type, coverImage, dateCompleted, rating, review, status, isSaved = false }: MediaCardProps) {
  // Map media type to color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "book":
        return "bg-rose-100 text-rose-800"
      case "movie":
        return "bg-amber-100 text-amber-800"
      case "podcast":
        return "bg-emerald-100 text-emerald-800"
      case "article":
        return "bg-sky-100 text-sky-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Map status to color and text
  const getStatusInfo = (status?: string) => {
    switch (status) {
      case "on_list":
        return { color: "bg-blue-100 text-blue-800", text: "On List" }
      case "consuming":
        return { color: "bg-yellow-100 text-yellow-800", text: "Consuming" }
      case "consumed":
        return { color: "bg-green-100 text-green-800", text: "Completed" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Unknown" }
    }
  }

  const statusInfo = getStatusInfo(status)

  return (
    <Link href={`/edit/${id}`} className="block group">
      <Card className="overflow-hidden bg-white hover:shadow-md transition-shadow group-hover:ring-2 group-hover:ring-amber-400">
        <CardHeader className="p-0 relative">
          <div className="relative h-48 w-full">
            <Image src={coverImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
            <Badge className={`absolute top-2 left-2 ${getTypeColor(type)}`}>{type}</Badge>
            {status && (
              <Badge className={`absolute top-2 right-2 ${statusInfo.color}`}>
                {statusInfo.text}
              </Badge>
            )}
            {isSaved ? <BookmarkCheck className="absolute top-8 right-2 h-6 w-6 text-amber-600" /> : null}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          {dateCompleted && <p className="text-sm text-amber-700 mb-2">Completed: {dateCompleted}</p>}
          {rating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1
                  const isFilled = starValue <= rating
                  const isPartial = starValue > rating && starValue - rating < 1 && rating > 0
                  
                  return (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        isFilled 
                          ? "text-amber-500 fill-amber-500" 
                          : isPartial 
                          ? "text-amber-500 fill-amber-500 opacity-50" 
                          : "text-gray-300"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  )
                })}
              </div>
              <span className="text-sm text-gray-600">({rating.toFixed(1)})</span>
            </div>
          )}
          <p className="text-sm text-gray-600 line-clamp-2">{review}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          {!isSaved ? (
            <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-900 hover:bg-amber-50 p-0">
              <Bookmark className="h-4 w-4 mr-1" />
              Save
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-900 hover:bg-amber-50 p-0">
              View Details
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
