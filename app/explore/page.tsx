import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaCard } from "@/components/media-card"
import { Search } from "lucide-react"

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-800 mb-6">Explore</h1>

      <div className="relative max-w-2xl mx-auto mb-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
        <Input
          placeholder="Search for books, movies, podcasts, articles..."
          className="pl-10 py-6 bg-white border-amber-200 focus-visible:ring-amber-500 text-lg"
        />
        <Button className="absolute right-1 top-1 bg-amber-600 hover:bg-amber-700">Search</Button>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="w-full max-w-md mx-auto bg-amber-50 text-amber-800 mb-8">
          <TabsTrigger value="trending" className="flex-1">
            Trending
          </TabsTrigger>
          <TabsTrigger value="new" className="flex-1">
            New Releases
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex-1">
            Most Popular
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <MediaCard
              title="Lessons in Chemistry"
              type="Book"
              coverImage="/placeholder.svg?height=200&width=150"
              dateCompleted=""
              rating={0}
              review="A novel about a female scientist in the 1960s"
              isSaved={false}
            />
            <MediaCard
              title="Oppenheimer"
              type="Movie"
              coverImage="/placeholder.svg?height=200&width=150"
              dateCompleted=""
              rating={0}
              review="Christopher Nolan's biographical thriller"
              isSaved={false}
            />
            <MediaCard
              title="The Rest Is History"
              type="Podcast"
              coverImage="/placeholder.svg?height=200&width=150"
              dateCompleted=""
              rating={0}
              review="Historians Tom Holland and Dominic Sandbrook discuss historical events"
              isSaved={false}
            />
            <MediaCard
              title="The Anthropocene Reviewed"
              type="Book"
              coverImage="/placeholder.svg?height=200&width=150"
              dateCompleted=""
              rating={0}
              review="John Green reviews different facets of the human-centered planet"
              isSaved={false}
            />
          </div>
        </TabsContent>

        <TabsContent value="new">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <MediaCard
              title="Fourth Wing"
              type="Book"
              coverImage="/placeholder.svg?height=200&width=150"
              dateCompleted=""
              rating={0}
              review="New fantasy release that's taking BookTok by storm"
              isSaved={false}
            />
            <MediaCard
              title="Barbie"
              type="Movie"
              coverImage="/placeholder.svg?height=200&width=150"
              dateCompleted=""
              rating={0}
              review="Greta Gerwig's take on the iconic doll"
              isSaved={false}
            />
          </div>
        </TabsContent>

        <TabsContent value="popular">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <MediaCard
              title="Atomic Habits"
              type="Book"
              coverImage="/placeholder.svg?height=200&width=150"
              dateCompleted=""
              rating={0}
              review="James Clear's guide to building good habits"
              isSaved={false}
            />
            <MediaCard
              title="Everything Everywhere All at Once"
              type="Movie"
              coverImage="/placeholder.svg?height=200&width=150"
              dateCompleted=""
              rating={0}
              review="Award-winning multiverse adventure"
              isSaved={false}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
