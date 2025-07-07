"use client"

import { useState } from 'react'
import { MediaService } from '@/lib/media-service'

export default function TestPage() {
  const [result, setResult] = useState<string>('')

  const testMockSave = async () => {
    try {
      const testData = {
        title: "Test Entry",
        media_type: "book" as const,
        date_completed: "2024-01-01",
        rating: 5,
        notes: "Test notes",
        cover_image_url: "https://example.com/image.jpg"
      }

      const response = await MediaService.createEntry("test-user", testData)
      setResult(JSON.stringify(response, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      
      <button 
        onClick={testMockSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Test Mock Save
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Result:</h2>
          <pre className="text-sm">{result}</pre>
        </div>
      )}
    </div>
  )
} 