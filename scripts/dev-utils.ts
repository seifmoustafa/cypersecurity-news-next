/**
 * Development utilities to help with local development
 * Run this script with: npx tsx scripts/dev-utils.ts
 */

import fs from "fs"
import path from "path"
import { exec } from "child_process"

// Function to check if a directory exists
function directoryExists(dirPath: string): boolean {
  try {
    return fs.statSync(dirPath).isDirectory()
  } catch (error) {
    return false
  }
}

// Function to create a directory if it doesn't exist
function createDirectoryIfNotExists(dirPath: string): void {
  if (!directoryExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`Created directory: ${dirPath}`)
  }
}

// Function to check if all dynamic route directories exist
function checkDynamicRouteDirectories(): void {
  console.log("Checking dynamic route directories...")

  const dynamicRoutes = [
    "app/instructions/[type]/[year]",
    "app/standards/[category]",
    "app/standards/[category]/[standard]",
    "app/standards/[category]/[standard]/[control]",
    "app/standards/[category]/[standard]/[control]/[safeguard]",
    "app/standards/[category]/[standard]/[control]/[safeguard]/[technique]",
    "app/standards/[category]/[standard]/[control]/[safeguard]/[technique]/[implementation]",
    "app/news/[id]",
    "app/news/category/[category]",
    "app/awareness/[id]",
    "app/definitions/[id]",
    "app/definitions/category/[category]",
    "app/framework/[domain]",
    "app/media/lecture/[id]",
    "app/media/presentation/[id]",
  ]

  dynamicRoutes.forEach((route) => {
    const dirPath = path.join(process.cwd(), route)
    createDirectoryIfNotExists(dirPath)
  })

  console.log("All dynamic route directories checked and created if needed.")
}

// Function to clear Next.js cache
function clearNextCache(): void {
  console.log("Clearing Next.js cache...")

  const cacheDirectories = [".next", "node_modules/.cache"]

  cacheDirectories.forEach((dir) => {
    const dirPath = path.join(process.cwd(), dir)
    if (directoryExists(dirPath)) {
      exec(`rm -rf ${dirPath}`, (error) => {
        if (error) {
          console.error(`Error clearing ${dir}:`, error)
        } else {
          console.log(`Cleared ${dir}`)
        }
      })
    }
  })
}

// Main function
function main(): void {
  console.log("Running development utilities...")

  // Check dynamic route directories
  checkDynamicRouteDirectories()

  // Clear Next.js cache
  clearNextCache()

  console.log("Development utilities completed.")
}

// Run the main function
main()
