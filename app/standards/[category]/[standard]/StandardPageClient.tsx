"use client"

import type React from "react"

import type { Standard } from "@/core/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useControls } from "@/core/hooks/use-controls"

interface StandardPageClientProps {
  standard: Standard
}

const StandardPageClient: React.FC<StandardPageClientProps> = ({ standard }) => {
  const { controls, loading: controlsLoading, error: controlsError } = useControls(standard.id, 1, 12)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{standard.nameEn}</h1>
      <p className="text-gray-700 mb-6">{standard.descriptionEn}</p>
      <Badge>{standard.code}</Badge>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Controls</h2>
        {controlsLoading && <div>Loading controls...</div>}
        {controlsError && <div>Error loading controls: {controlsError}</div>}
        {controls && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {controls.data.map((control) => (
              <Card key={control.id} className="cursor-pointer hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{control.nameEn}</h3>
                  <p className="text-gray-600 text-sm mb-4">{control.descriptionEn}</p>
                  <Badge variant="secondary">{control.code}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StandardPageClient
