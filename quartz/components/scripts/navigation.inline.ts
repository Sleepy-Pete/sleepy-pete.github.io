function toggleFolderByPath(folderPath: string) {
  // Find the folder container with the matching path
  const folderContainer = document.querySelector(
    `.folder-container[data-folderpath="${folderPath}"]`
  ) as HTMLElement | null
  
  if (!folderContainer) {
    console.warn(`Folder not found: ${folderPath}`)
    return
  }

  // Get the folder outer element (the collapsible part)
  const folderOuter = folderContainer.nextElementSibling as HTMLElement | null
  if (!folderOuter) return

  // Toggle the open class
  const isCurrentlyOpen = folderOuter.classList.contains("open")
  
  // Close all other top-level folders first
  const allTopLevelFolders = document.querySelectorAll(
    '.explorer-ul > li > .folder-outer'
  ) as NodeListOf<HTMLElement>
  
  allTopLevelFolders.forEach((folder) => {
    if (folder !== folderOuter) {
      folder.classList.remove("open")
    }
  })

  // Toggle the clicked folder
  if (isCurrentlyOpen) {
    folderOuter.classList.remove("open")
  } else {
    folderOuter.classList.add("open")
    
    // Scroll the folder into view in the explorer
    setTimeout(() => {
      const explorerUl = document.querySelector(".explorer-ul")
      if (explorerUl && folderContainer) {
        const containerTop = folderContainer.offsetTop
        explorerUl.scrollTo({
          top: containerTop - 20,
          behavior: "smooth"
        })
      }
    }, 100)
  }

  // Update localStorage
  const currentExplorerState = JSON.parse(localStorage.getItem("fileTree") || "[]")
  const folderState = currentExplorerState.find((item: any) => item.path === folderPath)
  
  if (folderState) {
    folderState.collapsed = isCurrentlyOpen
  } else {
    currentExplorerState.push({
      path: folderPath,
      collapsed: isCurrentlyOpen
    })
  }
  
  localStorage.setItem("fileTree", JSON.stringify(currentExplorerState))
}

document.addEventListener("nav", () => {
  // Set up navigation button click handlers
  const navButtons = document.querySelectorAll(".nav-link") as NodeListOf<HTMLElement>

  navButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const folderPath = button.dataset.folderpath

      if (folderPath) {
        // Don't prevent default - let the navigation happen
        // Just toggle the folder in the explorer
        toggleFolderByPath(folderPath)
      }
    })
  })
})

